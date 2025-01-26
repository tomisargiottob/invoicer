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
import { setCuitBalances, setCuitInvoices, updateInvoiceStatus } from '../../store/CuitSlice';
import {v4 as uuid} from 'uuid'
import { RegisterTypes, defaultInvoiceType, registerTypeInvoices } from '../../class/Profile/types/RegisterTypes';
import InvoiceTypes from '../../class/Invoice/types/InvoiceTypes';
import { InvoiceItem, ItemProps } from '../../class/Invoice/interface/IInvoice';

const ImportInvoices = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [number, setNumber] = useState<{[k:string]: number}>({});
  const [errors, setErrors] = useState<Array<string> | null>(null);
  const [dataExcel, setDataExcel] = useState<
    Array<{
      FECHA: number | Date,
      NOMBRE_COMPLETO: string;
      FACTURA_TIPO: InvoiceTypes;
      DNI: string;
      DIRECCION: string;
      PERIODO_DESDE?: number | Date,
      PERIODO_HASTA?: number | Date,
      DESCRIPCION: string;
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
      const invoicesNumbers: {[k:string]: number} = {}
      for (const invoiceType of registerTypeInvoices[cuit.registerType]) {
        const data = await getNextInvoiceNumber({user, cuit: cuit.id, invoiceType: invoiceType})
        invoicesNumbers[invoiceType] = data.nextInvoiceNumber
      }
      setNumber(
        invoicesNumbers
      );
    };

    searchInvoiceNumber();
  }, [cuit, navigate]);

  const createOneInvoice = async (invoice: Invoice, errors: {[k:string]: number}) => {
    try {
      dispatch(updateInvoiceStatus({id: invoice._id!, status: StatusTypes.PROCESSING}))
      if(errors[invoice.invoiceType]) {
        invoice.number-=errors[invoice.invoiceType]
      }
      await createInvoice({user, cuit: cuit.id, invoice})
      dispatch(updateInvoiceStatus({id: invoice._id!, status: StatusTypes.PROCESSED}))
    } catch (err) {
      if(!errors[invoice.invoiceType]) {
        errors[invoice.invoiceType] = 0
      }
      errors[invoice.invoiceType] +=1
      dispatch(updateInvoiceStatus({id: invoice._id!, status: StatusTypes.REJECTED}))
    }
  }
  const ExcelDateToJSDate = (serial: number) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);
    return dateInfo;
  };
  const createInvoices = async () => {
    try {
      dataExcel.forEach((row) => {
        row.FECHA = typeof row.FECHA === 'number' ? ExcelDateToJSDate(row.FECHA) : new Date()
        row.PERIODO_DESDE = typeof row.PERIODO_DESDE === 'number' ? ExcelDateToJSDate(row.PERIODO_DESDE) : undefined
        row.PERIODO_HASTA = typeof row.PERIODO_HASTA === 'number' ? ExcelDateToJSDate(row.PERIODO_HASTA) : undefined
      })
      dataExcel.sort((prev, next) => {
        const prevValue = (prev.FECHA as Date).getTime()
        const nextValue = (next.FECHA as Date).getTime()
        if(prevValue === nextValue) {
          return 0
        }
        if(prevValue < nextValue) {
          return -1
        } else {
          return 1
        }
      })
      const dataFormatted = dataExcel.reduce((invoices: {[k:string]:Array<Invoice>}, row) => {
        const invoiceType = (row.FACTURA_TIPO || defaultInvoiceType[cuit.registerType]).toUpperCase()
        if(!invoices[invoiceType]) {
          invoices[invoiceType] = []
        }
        let nextNumber = +number[invoiceType] + invoices[invoiceType]?.length;
        const columns = Object.keys(row)
        const items = columns.reduce((items: {[k:string]: InvoiceItem}, column) => {
          const columnSplit = column.match(/(descripcion|unidades|iva|unitario)_(\d+)/i)
          if(!columnSplit || !columnSplit[2] || !parseInt(columnSplit[2]) ) return items
          if (!items[columnSplit[2]]) items[columnSplit[2]] = {}
          const propName = ItemProps[columnSplit[1] as 'DESCRIPCION']
          items[columnSplit[2]][propName] = row[column as 'DESCRIPCION']
          return items
        },{})
        const parsedItems = Object.values(items).map((item) => {
          if(item.iva === undefined) {
            item.iva = cuit.vat
          }
          return item
        })
        invoices[invoiceType].push(new Invoice({
          _id: uuid(),
          number: nextNumber,
          date: row.FECHA as Date,
          invoiceType: row.FACTURA_TIPO || defaultInvoiceType[cuit.registerType],
          startDate: row.PERIODO_DESDE as Date,
          endDate: row.PERIODO_HASTA as Date,
          status: StatusTypes.PENDING,
          destinatary: row.NOMBRE_COMPLETO,
          destinataryDocument: String(row.DNI),
          destinataryDocumentType: String(row.DNI).length === 8 ? '96' : '80',
          destinataryAddress: row.DIRECCION,
          items: parsedItems,
          version: 'v2'
        }));
        return invoices
      },{});
      dispatch(setCuitInvoices({ invoices: [...Object.values(dataFormatted).flat().reverse(), ...cuit.invoices], totalInvoices: cuit.totalInvoices + Object.values(dataFormatted).flat().length }))

      navigate('/');
      const allInvoices = Object.values(dataFormatted).flat()
      allInvoices.sort((prev, next) => {
        const prevValue = (prev.date as Date).getTime()
        const nextValue = (next.date as Date).getTime()
        if(prevValue === nextValue) {
          return 0
        }
        if(prevValue < nextValue) {
          return -1
        } else {
          return 1
        }
      })
      const errors = {};
      for (const invoice of allInvoices) {
        await createOneInvoice(invoice, errors)
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
    items: Array<any>
  ): Array<string> => {
    setErrors(null);
    const errorsExcel: Array<string> = [];
    const maxLimit = new Date()
    maxLimit.setDate(maxLimit.getDate() + 10);
    const minLimit = new Date()
    minLimit.setDate(minLimit.getDate() - 10);
    const existentColumns = Object.keys(items[0]).reduce((allItems: string[], column) => {
      const columnSplit = column.match(/(descripcion|unidades|iva|unitario)_(\d+)/gi)
      if(!columnSplit || !columnSplit[2] || !parseInt(columnSplit[2]) ) return allItems
      if (allItems.includes(columnSplit[2])) return allItems
      allItems.push(columnSplit[2])
      return allItems
    }, [])
    items.map((row, index) => {
      const rowDate = ExcelDateToJSDate(row.FECHA).getTime()
      if(!row.FACTURA_TIPO && cuit.registerType === RegisterTypes.RESPONSABLE_INSCRIPTO) {
        errorsExcel.push(`Los responsables inscriptos deben indicar el FACTURA_TIPO A o B, falta en la linea ${index + 1} `)
      }
      if (rowDate > maxLimit.getTime())
        errorsExcel.push(`La fecha indicada en la linea ${index + 1} no puede ser mayor a 10 días desde hoy`);
      if (rowDate < minLimit.getTime())  {
        errorsExcel.push(`La fecha indicada en la linea ${index + 1} no puede ser menor a 10 días desde hoy`);
      }
      if (!row.NOMBRE_COMPLETO)
        errorsExcel.push(`Falta NOMBRE_COMPLETO en la linea ${index + 1}`);
      if (!row.DNI) errorsExcel.push(`Falta DNI en la linea ${index + 1}`);

      let itemsAmount = 0
      for (const unitNumber of existentColumns) {
        if(
          !row[`DESCRIPCION_${unitNumber}`] && 
          !row[`UNIDADES_${unitNumber}`] &&
          !row[`UNITARIO_${unitNumber}`] && 
          !row[`IVA_${unitNumber}`]) continue
        if (!row[`DESCRIPCION_${unitNumber}`])
          errorsExcel.push(`Falta DESCRIPCION_${unitNumber} en la linea ${index + 1}`);
        if (!row[`UNIDADES_${unitNumber}`])
          errorsExcel.push(`Falta UNIDADES_${unitNumber} en la linea ${index + 1}`);
        if (!row[`IVA_${unitNumber}`])
          errorsExcel.push(`Falta IVA_${unitNumber} en la linea ${index + 1}`);
        if (Number.isNaN(Number(row[`UNIDADES_${unitNumber}`])))
          errorsExcel.push(`UNIDADES_${unitNumber} debe ser numerico en la linea ${index + 1}`);
        if (!row[`UNITARIO_${unitNumber}`])
          errorsExcel.push(`Falta UNITARIO_${unitNumber} en la linea ${index + 1}`);
        if (Number.isNaN(Number(row[`UNITARIO_${unitNumber}`])))
          errorsExcel.push(`UNITARIO_${unitNumber} debe ser numerico en la linea ${index + 1}`);
        itemsAmount +=1
      }
      if(!itemsAmount) {
        errorsExcel.push(`La linea ${index + 1} debe tener al menos un item cargado`);
      }
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
              break; // If you only take the first table, uncomment this line
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
            <Link to={`/plantilla_facturador_web${cuit.registerType === RegisterTypes.RESPONSABLE_INSCRIPTO ? '_responsable_inscripto' : ''}.xlsx`} target="_blank" download>
              <Button>
                Download
              </Button>
            </Link>
          </div>
          <div className="masive-invoice-card-body-item">
            <Dropzone
              onDrop={onImportExcel}
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
