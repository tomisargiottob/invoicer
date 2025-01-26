import './index.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Toastify from 'toastify-js';
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
import InvoiceTypes, { InvoiceTypeMessage } from '../../class/Invoice/types/InvoiceTypes';
import React from 'react'
import { useAppSelector } from '../../store/store';
import { createInvoice, getInvoices, getNextInvoiceNumber } from '../../requests/invoiceRequests';
import { setCuitBalances, setCuitInvoices } from '../../store/CuitSlice';
import { useDispatch } from 'react-redux';
import { getBalances } from '../../requests/balanceRequests';
import { RegisterTypes, defaultInvoiceType } from '../../class/Profile/types/RegisterTypes';
import { InvoiceItem } from '../../class/Invoice/interface/IInvoice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ItemCreation from './ItemCreation';

const NewInvoice = () => {
  const navigate = useNavigate();
  const [number, setNumber] = useState(0);
  const [invoiceType, setInvoiceType] = useState<InvoiceTypes | null>(null)
  const [date, setDate] = useState<Date>(new Date());
  const [destinatary, setDestinatary] = useState('');
  const [destinataryDocumentType, setDestinataryDocumentType] =
    useState<ISelectItemProps | null>(null);
  const [destinataryDocument, setDestinataryDocument] = useState('');
  const [errors, setErrors] = useState<Array<string> | null>(null);
  const [disabled, setDisabled] = useState(false);
  const cuit = useAppSelector((state) => state.cuit)

  const [items, setItems] = useState<any[]>([{
    id: 0,
    description: '',
    iva: cuit.vat || 0,
    unitValue: 0,
    units: 0,
  }])

  const user = useAppSelector((state) => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    if(cuit.registerType === RegisterTypes.MONOTRIBUTO && !invoiceType) {
      setInvoiceType(defaultInvoiceType[cuit.registerType])
    }
  },[cuit])
  useEffect(() => {
    const searchInvoiceNumber = async () => {
      try {
        if(invoiceType) {
          const data = await getNextInvoiceNumber({user, cuit: cuit.id, invoiceType: invoiceType || defaultInvoiceType[cuit.registerType]  })
          setNumber(
            data.nextInvoiceNumber
          );
        }
      } catch (err: any) {
        Toastify({
          text: err.message,
          style: {
            background: 'red',
            color: 'white',
          },
          position: 'center',
          duration: 3000,
        }).showToast();
        console.error(err);
      }
    };
    if(invoiceType || cuit.registerType === RegisterTypes.MONOTRIBUTO) {
      searchInvoiceNumber();
    }
  }, [invoiceType]);

  const invoiceTotal = useMemo(() => {
    return items.reduce((total, item) => {
      total += item.unitValue * item.units
      return total
    },0)
  },[items])
  const addInvoice = async () => {
    try {
      setErrors(null);
      setDisabled(true);
      const invoice = new Invoice({
        number,
        date: date || new Date(),
        destinatary,
        destinataryDocument,
        destinataryDocumentType: String(destinataryDocumentType?.value),
        destinataryAddress: '',
        items,
        invoiceType: invoiceType!,
        status: StatusTypes.PENDING,
        version: 'v2'
      });

      await createInvoice({user, cuit: cuit.id, invoice})
      setDisabled(false)
      navigate('/');
      const response = await getInvoices({ user, cuit: cuit.id })
      dispatch(setCuitInvoices({invoices: response.invoices, totalInvoices: response.count}))
      const balances = await getBalances({user, cuit: cuit.id})
      dispatch(setCuitBalances({balances}))
    } catch (error: any) {
      setDisabled(false)
      if (error instanceof ValidationException) {
        setErrors(error.getDetailedErrors());
      } else if(error.response.data.message){
        setErrors([error.response.data.message])
      }
    }
  };
  return (
    <div className="new-invoice-card-container">
      <Card>
        <div className="new-invoice-card-title">
          <Title>Crea una nueva Factura</Title>
        </div>
        <div className="new-invoice-card-body">
          <div className="new-invoice-card-body-item">
            <LabelValue
              label="FACTURA N°"
              value={number.toString().padStart(8, '0')}
              containerStyle={{ width: '20%' }}
            />
            <LabelValue
              label="EMISOR"
              containerStyle={{ width: '30%' }}
              value={`${
                cuit.fullname
              } ( ${
                cuit.cuit
              })`}
            />
            <Input
              label="FECHA"
              containerStyle={{ width: '50%' }}
              type="date"
              value={date.toISOString().substring(0, 10)}
              onChange={(event) => {
                const dateInput = new Date(event.target.value);
                setDate(dateInput);
              }}
            />
          </div>
          <div className="new-invoice-card-body-item">
              { cuit.registerType === RegisterTypes.RESPONSABLE_INSCRIPTO ? <Select
                  label="TIPO"
                  items={[
                    { value: InvoiceTypes.A, message: 'Factura A' },
                    { value: InvoiceTypes.B, message: 'Factura B' },
                  ]}
                  containerStyle={{ width: '20%' }}
                  onSelect={(selected: ISelectItemProps) => {
                    setInvoiceType(selected.value as InvoiceTypes);
                  }}
                >
                {invoiceType ? InvoiceTypeMessage(
                  invoiceType
                ) : 'SELECCIONAR'}
              </Select> :
              <LabelValue
                label="TIPO"
                value={InvoiceTypeMessage(
                  InvoiceTypes.C
                )}
                containerStyle={{ width: '20%' }}
              />
              }
              <Input
                label="DESTINATARIO"
                containerStyle={{ width: '50%' }}
                onChange={(event) => {
                  setDestinatary(event.target.value);
                }}
                value={destinatary}
              />
          </div>
          <div className="new-invoice-card-body-item">
            <Select
              label="TIPO DE DOCUMENTO"
              items={[
                { value: '96', message: 'DNI' },
                { value: '80', message: 'CUIT' },
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
              containerStyle={{ width: '30%' }}
              onChange={(event) => {
                setDestinataryDocument(event.target.value);
              }}
              value={destinataryDocument}
            />
            <LabelValue
              label='Total Factura'
              value={`${invoiceTotal.toLocaleString()} $` }
              containerStyle={{width: '15%', marginLeft: '50px'}}
            />
          </div>
          <ItemCreation items={items} setItems={setItems}></ItemCreation>
        </div>
        <div className="new-invoice-card-footer">
          <SecondaryButton onClick={() => navigate('/')}>
            VOLVER
          </SecondaryButton>
          <Button onClick={addInvoice} disabled={disabled}>CREAR FACTURA</Button>
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

export default NewInvoice;
