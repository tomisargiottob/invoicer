import Profile from '../../class/Profile/Profile';
import InvoiceTypes from '../../class/Invoice/types/InvoiceTypes';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ErrorMessage from '../../components/ErrorMessage';
import Input from '../../components/Input';
import SecondaryButton from '../../components/SecondaryButton';
import Select, { ISelectItemProps } from '../../components/Select';
import Title from '../../components/Title';
import React, { useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { createCuit, getUserCuits } from '../../requests/cuitRequests';
import { useAppSelector } from '../../store/store';
import {  CuitAccountInput } from '../../store/CuitSlice';
import { useDispatch } from 'react-redux';
import { setUserCuitAccounts } from '../../store/UserSlice';
import TextArea from '../../components/TextArea';

const NewProfile = () => {
  const navigate = useNavigate();
  const [fullname, setFullName] = useState('');
  const [cuit, setCuit] = useState('');
  const [invoiceType, setInvoiceType] = useState<ISelectItemProps | null>(null);
  const [salePoint, setSalePoint] = useState('');
  const [initAct, setInitAct] = useState(new Date());
  const [address, setAddress] = useState('');
  const [certificate, setCertificate] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const dispatch = useDispatch()

  const cuitChange = (value: string) => {
    if(value.length > 2 && value[2] !== '-') {
      setCuit([value.slice(0, 2), '-', value.slice(2)].join(''));
    } else if(value.length > 11 && value[11] !== '-') {
      setCuit([value.slice(0, 11), '-', value.slice(11)].join(''));
    } else {
      setCuit(value)
    }
  }

  const verifyCertificate = (value: string, validationErrors: string[]) => {
    const begining = value.startsWith('-----BEGIN CERTIFICATE-----')
    const ending = value.endsWith('-----END CERTIFICATE-----')
    if(!begining || !ending) {
      validationErrors.push('Formato de certificado invalido. Debe comenzar con -----BEGIN CERTIFICATE----- y terminar con -----END CERTIFICATE-----')
    }
  }

  const verifyPrivateKey = (value: string, validationErrors: string[]) => {
    const begining = value.startsWith('-----BEGIN RSA PRIVATE KEY-----')
    const ending = value.endsWith('-----END RSA PRIVATE KEY-----')
    if(!begining || !ending) {
      validationErrors.push('Formato de clave privada invalido. Debe comenzar con -----BEGIN RSA PRIVATE KEY----- y terminar con -----END RSA PRIVATE KEY-----')
    }
  }

  const verifyForm = (profile: CuitAccountInput, validationErrors: string[])=> {
    if (!profile.fullname) validationErrors.push('Debe tener un nombre completo.');
    if (!RegExp(/[0-9]{2}-[0-9]+-[0-9]/g).test(profile.cuit))
      validationErrors.push('Debe tener un Cuit / Cuil valido (XX-XXXXXXXX-X)');
    if (!RegExp(/[0-9]{5}/g).test(profile.salePoint))
      validationErrors.push('Debe tener un Punto de venta (5 digitos)');
    if (!profile.invoiceType)
      validationErrors.push('Debe tener un tipo de comprobante valido.');
  }

  const [errors, setErrors] = useState<Array<string> | null>(null);
  const user = useAppSelector((state) => state.user)

  const createProfile = async () => {
    try {
      setErrors(null);
      const validationErrors: string[] = []
      const profile: CuitAccountInput = {
        fullname,
        cuit,
        invoiceType: InvoiceTypes[invoiceType?.value as InvoiceTypes],
        salePoint,
        address,
        initAct: initAct.toISOString(),
        certificate,
        privateKey
      };
      verifyForm(profile, validationErrors)
      verifyCertificate(certificate,validationErrors)
      verifyPrivateKey(privateKey,validationErrors)
      if(validationErrors.length) {
        setErrors(validationErrors)
        throw validationErrors
      }
      await createCuit({user, cuit: profile})
      const cuits = await getUserCuits({user})
      dispatch(setUserCuitAccounts({cuitAccounts: cuits}))
      navigate('/');
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="new-profile-card-container">
      <Card>
        <div className="new-profile-card-title">
          <Title>Crea un nuevo Perfil</Title>
        </div>
        <div className="new-profile-card-body">
          <div className="new-profile-card-body-item">
            <Input
              label="NOMBRE COMPLETO"
              containerStyle={{ width: '55%' }}
              value={fullname}
              onChange={(event) => setFullName(event.target.value)}
            />
            <Input
              label="CUIT / CUIL"
              containerStyle={{ width: '35%' }}
              value={cuit}
              onChange={(event) => cuitChange(event.target.value)}
            />
          </div>
          <div className="new-profile-card-body-item">
            <Input
              label="PUNTO DE VENTA"
              containerStyle={{ width: '25%' }}
              value={salePoint}
              onChange={(event) => setSalePoint(event.target.value)}
            />
            <Select
              label="TIPO DE COMPROBANTE"
              items={[
                { value: 'A', message: 'FACTURA A' },
                { value: 'B', message: 'FACTURA B' },
                { value: 'C', message: 'FACTURA C' },
              ]}
              containerStyle={{ width: '25%' }}
              onSelect={(selected: ISelectItemProps) => {
                setInvoiceType(selected);
              }}
            >
              {invoiceType?.message || 'SELECCIONAR'}
            </Select>
            <Input
              label="INICIO ACT."
              containerStyle={{ width: '25%' }}
              onChange={(event) => setInitAct(new Date(event.target.value))}
              type="date"
            />
          </div>
          <div className="new-profile-card-body-item">
            <Input
              label="DIRECCION COMERCIAL"
              containerStyle={{ width: '100%' }}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>
          <div className="new-profile-card-body-item">
            <TextArea
              label="CLAVE PRIVADA"
              containerStyle={{ width: '50%' }}
              inputStyle={{height: '200px'}}
              value={privateKey}
              onChange={(event) => setPrivateKey(event.target.value)}
            />
            <TextArea
              label="CERTIFICADO AFIP"
              containerStyle={{ width: '50%' }}
              inputStyle={{height: '200px'}}
              value={certificate}
              onChange={(event) => setCertificate(event.target.value)}
            />
          </div>
        </div>
        <div className="new-profile-card-footer">
          <SecondaryButton onClick={() => navigate('/')}>
            VOLVER
          </SecondaryButton>
          <Button onClick={createProfile}>CREAR NUEVO PERFIL</Button>
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

export default NewProfile;
