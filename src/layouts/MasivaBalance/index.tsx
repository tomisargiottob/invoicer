import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// eslint-disable-next-line
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
import IBalance from '../../class/Profile/interface/IBalance';
import ValidationException from '../../class/Invoice/Exceptions/ValidationException';
import React from 'react'
import { getBalances, importBalances } from '../../requests/balanceRequests';
import { useAppSelector } from '../../store/store';
import { useDispatch } from 'react-redux';
import { setCuitBalances } from '../../store/CuitSlice';

const ImportBalance = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [errors, setErrors] = useState<Array<string> | null>(null);
  const [dataExcel, setDataExcel] = useState<
    Array<{
      FECHA: string;
      IMPORTE: string;
    }>
  >([]);
  
  const user = useAppSelector((state) => state.user)
  const cuit = useAppSelector((state) => state.cuit)
  const dispatch = useDispatch()

  const profile = params.getAll('profile')[0];

  useEffect(() => {
    if (profile === 'undefined') navigate('/');
  }, [profile, navigate]);

  const ExcelDateToJSDate = (serial: number) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);
    return dateInfo;
  };

  const createBalances = async () => {
    try {
      const dataFormatted: Array<IBalance> = dataExcel.map((row): IBalance => {
        const date = ExcelDateToJSDate(Number(row.FECHA));
        return {
          date,
          amount: Number(row.IMPORTE),
        };
      });
      await importBalances(dataFormatted, cuit.id, user)
      navigate('/')
      const balances = await getBalances({user, cuit: cuit.id})
      dispatch(setCuitBalances({ balances }))
    } catch (error) {
      if (error instanceof ValidationException) {
        setErrors(error.getDetailedErrors());
      }
      console.log(error);
    }
  };

  const validateExcel = (
    items: Array<{
      FECHA: string;
      IMPORTE: string;
    }>
  ): Array<string> => {
    setErrors(null);
    const errorsExcel: Array<string> = [];
    items.map((row, index) => {
      if (!row.FECHA) errorsExcel.push(`Falta FECHA en la linea ${index + 1}`);
      if (!row.IMPORTE)
        errorsExcel.push(`Falta IMPORTE en la linea ${index + 1}`);
      if (Number.isNaN(Number(row.IMPORTE)))
        errorsExcel.push(`IMPORTE debe ser numerico en la linea ${index + 1}`);
      return row;
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
          <Title>Cargue el balance de su perfil de manera masiva</Title>
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
            <Link to="/plantilla_balance.xlsx" target="_blank" download>
              <Button>
                Download
              </Button>
            </Link>
          </div>
          <div className="masive-invoice-card-body-item">
            <Dropzone
              onDrop={onImportExcel}
              // accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            >
              {({
                getRootProps,
                getInputProps,
                isDragActive,
                isDragReject,
              }) => (
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
              )}
            </Dropzone>
          </div>
        </div>
        <div className="masive-invoice-card-footer">
          <SecondaryButton onClick={() => navigate('/')}>
            VOLVER
          </SecondaryButton>
          <Button onClick={createBalances}>AGREGAR BALANCES</Button>
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

export default ImportBalance;
