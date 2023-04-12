import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// @ts-ignore
import * as XLSX from 'xlsx';
import 'react-dropzone-uploader/dist/styles.css';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import ErrorMessage from '../../components/ErrorMessage';
import Card from '../../components/Card';
import Title from '../../components/Title';
import './index.css';
import Input from '../../components/Input';
import LabelValue from '../../components/LabelValue';
import Button from '../../components/Button';
import SecondaryButton from '../../components/SecondaryButton';
import StatusTypes from '../../class/Invoice/types/StatusTypes';
import ValidationException from '../../class/Invoice/Exceptions/ValidationException';
import React from 'react'
import { useAppSelector } from '../../store/store';
import { createInvoice, getInvoices, getNextInvoiceNumber } from '../../requests/invoiceRequests';
import { getBalances } from '../../requests/balanceRequests';
import { useDispatch } from 'react-redux';
import Invoice from '../../class/Invoice/Invoice';
import { addPendingInvoices, setCuitBalances, setCuitInvoices, updateInvoiceStatus } from '../../store/CuitSlice';
import {v4 as uuid} from 'uuid'

const ImportInvoices = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [number, setNumber] = useState(0);
  const [errors, setErrors] = useState<Array<string> | null>(null);
  const [dataExcel, setDataExcel] = useState<
    Array<{
      FECHA: number | Date,
      NOMBRE_COMPLETO: string;
      DNI: string;
      DIRECCION: string;
      DESCRIPCION: string;
      UNIDADES: string;
      UNITARIO: string;
      TOTAL: string;
    }>
  >([]);
  const dispatch = useDispatch()

  const user = useAppSelector((state) => state.user)
  const cuit = useAppSelector((state) => state.cuit)

  useEffect(() => {

    const searchInvoiceNumber = async () => {
      if (
        !cuit.tokenExpires ||
        new Date(cuit?.tokenExpires) <= new Date()
      ) {
        navigate('/');
      }
      const data = await getNextInvoiceNumber({user, cuit: cuit.id, invoiceType: cuit.invoiceType})
      setNumber(
        Number(
          data.nextInvoiceNumber
        )
      );
    };

    searchInvoiceNumber();
  }, [cuit, navigate]);

  const createOneInvoice = async (invoice: Invoice) => {
    try {
      dispatch(updateInvoiceStatus({id: invoice._id!, status: StatusTypes.PROCESSING}))
      await createInvoice({user, cuit: cuit.id, invoice})
      dispatch(updateInvoiceStatus({id: invoice._id!, status: StatusTypes.PROCESSED}))
    } catch (err) {
      dispatch(updateInvoiceStatus({id: invoice._id!, status: StatusTypes.REJECTED}))
    }
  }
  const ExcelDateToJSDate = (serial: number) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);
    dateInfo.setDate(dateInfo.getDate()+ 1)
    return dateInfo;
  };
  const createInvoices = async () => {
    try {
      dataExcel.forEach((row) => {
        row.FECHA = typeof row.FECHA === 'number' ? ExcelDateToJSDate(row.FECHA) : new Date()
      })
      dataExcel.sort((prev, next) => {
        if(prev.FECHA < next.FECHA) {
          return -1
        } else {
          return 1
        }
      })
      const dataFormatted: Array<Invoice> = dataExcel.map((row, idx): Invoice => {
        let nextNumber = +number + idx;
        return new Invoice({
          _id: uuid(),
          number: nextNumber,
          date: row.FECHA as Date,
          invoiceType: cuit.invoiceType,
          status: StatusTypes.PENDING,
          destinatary: row.NOMBRE_COMPLETO,
          destinataryDocument: String(row.DNI),
          destinataryDocumentType: '96',
          description: row.DESCRIPCION,
          units: Number(row.UNIDADES),
          unitValue: Number(row.UNITARIO),
          total: Number(row.UNIDADES) * Number(row.UNITARIO),
        });
      });

      dispatch(setCuitInvoices({ invoices: [...[...dataFormatted].reverse(), ...cuit.invoices], totalInvoices: cuit.totalInvoices + dataFormatted.length }))

      navigate('/');
      
      for( const invoice of dataFormatted) {
        await createOneInvoice(invoice)
      }
      const response = await getInvoices({ user, cuit: cuit.id })
      dispatch(setCuitInvoices({ invoices: response.invoices, totalInvoices: response.count as number }))
      const balances = await getBalances({user, cuit: cuit.id})
      dispatch(setCuitBalances({balances}))
    } catch (error) {
      if (error instanceof ValidationException) {
        setErrors(error.getDetailedErrors());
      }
    }
  };

  const validateExcel = (
    items: Array<{
      FECHA: number;
      NOMBRE_COMPLETO: string;
      DNI: string;
      DIRECCION: string;
      DESCRIPCION: string;
      UNIDADES: string;
      UNITARIO: string;
      TOTAL: string;
    }>
  ): Array<string> => {
    setErrors(null);
    const errorsExcel: Array<string> = [];
    const maxLimit = new Date()
    maxLimit.setDate(maxLimit.getDate() + 10);
    const minLimit = new Date()
    minLimit.setDate(minLimit.getDate() - 10);
    items.map((row, index) => {
      const rowDate = ExcelDateToJSDate(row.FECHA).getTime()
      if (rowDate > maxLimit.getTime())
        errorsExcel.push(`La fecha indicada en la linea ${index + 1} no puede ser mayor a 10 días desde hoy`);
      if (rowDate < minLimit.getTime())  {
        errorsExcel.push(`La fecha indicada en la linea ${index + 1} no puede ser menor a 10 días desde hoy`);
      }
      if (!row.NOMBRE_COMPLETO)
        errorsExcel.push(`Falta NOMBRE_COMPLETO en la linea ${index + 1}`);
      if (!row.DNI) errorsExcel.push(`Falta DNI en la linea ${index + 1}`);
      if (!row.DESCRIPCION)
        errorsExcel.push(`Falta DESCRIPCION en la linea ${index + 1}`);
      if (!row.UNIDADES)
        errorsExcel.push(`Falta UNIDADES en la linea ${index + 1}`);
      if (Number.isNaN(Number(row.UNIDADES)))
        errorsExcel.push(`UNIDADES debe ser numerico en la linea ${index + 1}`);
      if (!row.UNITARIO)
        errorsExcel.push(`Falta UNITARIO en la linea ${index + 1}`);
      if (Number.isNaN(Number(row.UNITARIO)))
        errorsExcel.push(`UNITARIO debe ser numerico en la linea ${index + 1}`);
      return items;
    });

    return errorsExcel;
  };

  const onImportExcel = (file: any) => {
    try {
      setErrors(null);
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          // eslint-disable-next-line
          // @ts-ignore
          const { result } = event.target;

          // Read the entire excel table object in binary stream
          const workbook = XLSX.read(result, { type: 'binary' });

          let data: any = []; // store the acquired data
          // Traverse each worksheet for reading (here only the first table is read by default)
          // eslint-disable-next-line
          for (const sheet in workbook.Sheets) {
            if (Object.prototype.hasOwnProperty.call(workbook.Sheets, sheet)) {
              // Convert excel to json data using the sheet_to_json method
              data = data.concat(
                XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
              );
              // break; // If you only take the first table, uncomment this line
            }
          }
          if (data.length <= 0) {
            return setErrors(['La planilla debe tener al menos un registro.']);
          }
          const errorsExcel = validateExcel(data);
          if (errorsExcel.length > 0) {
            return setErrors(errorsExcel);
          }
          return setDataExcel(data);
        } catch (e) {
          // Here you can throw a related prompt with a file type error incorrect.
          // setDataError(true);
          return 0;
        }
      };
      // Open the file in binary mode
      fileReader.readAsBinaryString(file[0]);
    } catch (e) {
      // setDataError(true);
    }
  };
  
  const onDrop = (acceptedFiles: any) => {
    onImportExcel(acceptedFiles);
  };

  return (
    <div className="masive-invoice-card-container">
      <Card>
        <div className="masive-invoice-card-title">
          <Title>Cree facturas de manera masiva</Title>
        </div>
        <div className="masive-invoice-card-body">
          <div className="masive-invoice-card-body-item">
            <p>
              {' '}
              Para ello, vamos a cargar un archivo excel pre-formateado con la
              informacion.
            </p>
            <p>Si no tiene el archivo, puede descargarlo aquí.</p>
          </div>
          <div className="masive-invoice-card-body-item">
            <Link to="/plantilla_facturador_web.xlsx" target="_blank" download>
              <Button>
                Download
              </Button>
            </Link>
          </div>
          <div className="masive-invoice-card-body-item">
            <Dropzone
              onDrop={onImportExcel}
              // accept= {{
              //   'application/vnd.ms-excel': [],
              //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':[]
              // }}
            >
              {({
                getRootProps,
                getInputProps,
                isDragActive,
                isDragReject,
              }) => {
              return (
                <>
                  <LabelValue label="ADJUNTAR ARCHIVO EXCEL" value="" />
                  <Input
                    // eslint-disable-next-line
                    {...getInputProps()}
                    // eslint-disable-next-line
                    // @ts-ignore
                    id="adjuntarPlantilla"
                    className="inputFileDriver"
                    type="file"
                  />

                  <div
                    className={
                      isDragActive
                        ? 'qbk-dragndrop__screen is-active'
                        : 'qbk-dragndrop__screen'
                    }
                    // eslint-disable-next-line
                    {...getRootProps()}
                    onChange={onImportExcel}
                  >
                    <div className="textoLabel mt-1">
                      {!isDragActive}
                      {isDragActive && !isDragReject && 'Soltar y cargar'}
                      {isDragReject &&
                        'Archivo no aceptado. Por favor, intenta de nuevo'}
                    </div>
                  </div>
                </>
              )}}
            </Dropzone>
          </div>
        </div>
        <div className="masive-invoice-card-footer">
          <SecondaryButton onClick={() => navigate('/')}>
            VOLVER
          </SecondaryButton>
          <Button onClick={createInvoices}>CREAR FACTURAS</Button>
        </div>
        {errors && (
          <ErrorMessage>
            <ul>
              {errors.map((errorItem) => (
                <li key={errorItem}>{errorItem}</li>
              ))}
            </ul>
          </ErrorMessage>
        )}
      </Card>
    </div>
  );
};

export default ImportInvoices;
