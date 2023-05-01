import './index.css';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ErrorMessage from '../../components/ErrorMessage';
import Input from '../../components/Input';
import SecondaryButton from '../../components/SecondaryButton';
import Title from '../../components/Title';
import LabelValue from '../../components/LabelValue';
import Select, { ISelectItemProps } from '../../components/Select';
import ValidationException from '../../class/Invoice/Exceptions/ValidationException';
import Invoice from '../../class/Invoice/Invoice';
import StatusTypes from '../../class/Invoice/types/StatusTypes';
import 'toastify-js/src/toastify.css';
import InvoiceTypes, {
  InvoiceTypeMessage,
} from '../../class/Invoice/types/InvoiceTypes';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store/store';
import { createInvoice, getInvoices, getNextInvoiceNumber } from '../../requests/invoiceRequests';
import { setCuitBalances, setCuitInvoices } from '../../store/CuitSlice';
import { getBalances } from '../../requests/balanceRequests';
import { RegisterTypes, defaultInvoiceType } from '../../class/Profile/types/RegisterTypes';

const EditExistInvoice = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [number, setNumber] = useState(0);
  const [invoiceType, setInvoiceType] = useState<InvoiceTypes | null>(null)
  const [date, setDate] = useState(new Date());
  const [destinatary, setDestinatary] = useState('');
  const [destinataryDocumentType, setDestinataryDocumentType] =
    useState<ISelectItemProps | null>(null);
  const [destinataryDocument, setDestinataryDocument] = useState('');
  const [description, setDescription] = useState('');
  const [units, setUnits] = useState(0);
  const [unitValue, setUnitValue] = useState(0.0);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState<Array<string> | null>(null);

  const invoiceNumber = params.getAll('invoiceNumber')[0];
  const isCredit = Boolean(params.getAll('credit')[0]);

  const dispatch = useDispatch()
  const cuit = useAppSelector((state) => state.cuit)
  const user = useAppSelector((state) => state.user)
  
  useEffect(() => {
    if (!cuit.currentInvoice) {
      navigate('/');
    } else {
      const invoice = cuit.invoices.find((invoice) => invoice._id === cuit.currentInvoice)!
      setDestinatary(invoice.destinatary);
      setInvoiceType(isCredit ? getCreditInvoice(invoice.invoiceType) : invoice.invoiceType )
      setDate(new Date(invoice.date))
      setDestinataryDocument(invoice.destinataryDocument);
      setDestinataryDocumentType(
        invoice.destinataryDocumentType === '96'
          ? { value: '96', message: 'DNI' }
          : { value: '80', message: 'CUIT' }
      );
      setDescription(invoice.description);
      setUnits(invoice.units);
      setUnitValue(invoice.unitValue);
      setTotal(invoice.total);
    }
  }, [invoiceNumber, navigate]);

  useEffect(() => {
    
    const searchInvoiceNumber = async () => {
      if (
        !cuit.tokenExpires ||
        new Date(cuit?.tokenExpires) <= new Date()
      ) {
        navigate('/');
      }
      if(invoiceType) {
        const data = await getNextInvoiceNumber({user, cuit: cuit.id, invoiceType})
        setNumber(
          Number(
            data.nextInvoiceNumber
          )
        );
      }
    };

    searchInvoiceNumber();
  }, [navigate, invoiceType]);

  const getCreditInvoice = (invoiceType: InvoiceTypes) => {
    if (invoiceType === InvoiceTypes.A) return InvoiceTypes.NOTA_CREDITO_A;
    if (invoiceType === InvoiceTypes.B) return InvoiceTypes.NOTA_CREDITO_B;
    if (invoiceType === InvoiceTypes.C) return InvoiceTypes.NOTA_CREDITO_C;

    return InvoiceTypes.NOTA_CREDITO_C;
  };

  const createNewInvoice = async () => {
    try {
      setErrors(null);
      const invoice = new Invoice({
        number,
        date: date,
        destinatary,
        destinataryDocument,
        destinataryDocumentType: String(destinataryDocumentType?.value),
        description,
        units,
        unitValue,
        total,
        status: StatusTypes.PENDING,
        asociatedInvoice: cuit.invoices.find((invoice) => invoice._id === cuit.currentInvoice)?.number,
        invoiceType: invoiceType!,
      });
      await createInvoice({ user, cuit: cuit.id, invoice })
      const response = await getInvoices({ user, cuit: cuit.id })
      dispatch(setCuitInvoices({invoices: response.invoices, totalInvoices: response.count}))
      const balances = await getBalances({user, cuit: cuit.id})
      dispatch(setCuitBalances({balances}))
      navigate('/');
    } catch (error: any) {
      if (error instanceof ValidationException) {
        setErrors(error.getDetailedErrors());
      } else if(error.response.data.message){
        setErrors([error.response.data.message])
      }
    }
  };

  return (
    <div className="edit-invoice-card-container">
      <Card>
        <div className="edit-invoice-card-title">
          <Title>Crea una {isCredit ? 'Nota de credito' : 'Factura'}</Title>
        </div>
        <div className="edit-invoice-card-body">
          <div className="edit-invoice-card-body-item">
            <LabelValue
              label={`${isCredit ? 'Nota de credito' : 'Factura'} N°`}
              value={number.toString().padStart(8, '0')}
              containerStyle={{ width: '20%' }}
            />
            <Input
              label="FECHA"
              containerStyle={{ width: '55%' }}
              type="date"
              value={`${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`}
              onChange={(event) => {
                const dateInput = new Date(event.target.value);
                dateInput.setDate(dateInput.getDate() + 1);
                setDate(dateInput);
              }}
            />
            <LabelValue
              label="TIPO"
              value={InvoiceTypeMessage(
                isCredit
                  ? getCreditInvoice(
                    cuit.invoices.find((invoice) => invoice._id === cuit.currentInvoice)!.invoiceType
                    )
                  : cuit.invoices.find((invoice) => invoice._id === cuit.currentInvoice)!.invoiceType
              )}
              containerStyle={{ width: '25%' }}
            />            
          </div>
          <div className="edit-invoice-card-body-item">
            <LabelValue
              label="EMISOR"
              value={`${
                cuit.fullname
              } ( ${
                cuit.cuit
              })`}
            />
          </div>
          <div className="edit-invoice-card-body-item">
            <Input
              label="DESTINATARIO"
              containerStyle={{ width: '100%' }}
              onChange={(event) => {
                setDestinatary(event.target.value);
              }}
              value={destinatary}
            />
          </div>
          <div className="edit-invoice-card-body-item">
            <Select
              label="TIPO DE DOCUMENTO"
              items={[
                { value: '96', message: 'DNI' },
                { value: '100', message: 'CUIT' },
              ]}
              containerStyle={{ width: '20%' }}
              onSelect={(selected: ISelectItemProps) => {
                setDestinataryDocumentType(selected);
              }}
            >
              {destinataryDocumentType?.message || 'SELECCIONAR'}
            </Select>
            <Input
              label="DOCUMENTO DESTINATARIO"
              containerStyle={{ width: '75%' }}
              onChange={(event) => {
                setDestinataryDocument(event.target.value);
              }}
              value={destinataryDocument}
            />
          </div>
          <div className="edit-invoice-card-body-item">
            <Input
              label="DESCRIPCION"
              containerStyle={{ width: '100%' }}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              value={description}
            />
          </div>
          <div className="edit-invoice-card-body-item">
            <Input
              label="UNIDADES"
              containerStyle={{ width: '15%' }}
              type="number"
              onChange={(event) => {
                setUnits(Number(event.target.value));
                setTotal(Number(event.target.value) * unitValue);
              }}
              value={String(units)}
            />
            <Input
              label="VALOR UNITARIO"
              containerStyle={{ width: '15%' }}
              type="number"
              onChange={(event) => {
                setUnitValue(Number(event.target.value));
                setTotal(Number(event.target.value) * units);
              }}
              value={String(unitValue)}
            />
            <LabelValue
              label="TOTAL"
              value={`$ ${total}`}
              containerStyle={{ width: '70%' }}
            />
          </div>
        </div>
        <div className="edit-invoice-card-footer">
          <SecondaryButton onClick={() => navigate('/')}>
            VOLVER
          </SecondaryButton>
          <Button onClick={createNewInvoice}>CREAR {isCredit ? 'NOTA DE CREDITO' : 'FACTURA'}</Button>
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

export default EditExistInvoice;
