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
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import Dropzone from 'react-dropzone';
import LabelValue from '../../components/LabelValue';
import { RegisterTypes } from '../../class/Profile/types/RegisterTypes';

const NewProfile = () => {
  const navigate = useNavigate();
  const [fullname, setFullName] = useState('');
  const [cuit, setCuit] = useState('');
  const [registerType, setRegisterType] = useState<ISelectItemProps | null>(null);
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

  const onImportPrivateKey = (file: any) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setPrivateKey(event.target!.result as string)
    }
    fileReader.readAsBinaryString(file[0]);
  }

  const onImportCertificate = (file: any) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setCertificate(event.target!.result as string)
    }
    fileReader.readAsBinaryString(file[0]);
  }

  const verifyForm = (profile: CuitAccountInput, validationErrors: string[])=> {
    if (!profile.fullname) validationErrors.push('Debe tener un nombre completo.');
    if (!RegExp(/[0-9]{2}-[0-9]+-[0-9]/g).test(profile.cuit))
      validationErrors.push('Debe tener un Cuit / Cuil valido (XX-XXXXXXXX-X)');
    if (!RegExp(/[0-9]{5}/g).test(profile.salePoint))
      validationErrors.push('Debe tener un Punto de venta (5 digitos)');
    if (!profile.registerType)
      validationErrors.push('Debe tener un tipo de registro valido.');
    if (!profile.certificate)
      validationErrors.push('Debe introducir un certificado.');
    if (!profile.privateKey)
      validationErrors.push('Debe introducir la clave privada.');
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
        registerType: RegisterTypes[registerType?.value as RegisterTypes],
        salePoint,
        address,
        initAct: initAct.toISOString(),
        certificate,
        privateKey
      };
      verifyForm(profile, validationErrors)
      if(validationErrors.length) {
        setErrors(validationErrors)
        throw new Error('Por favor revise los errores del formulario')
      }
      await createCuit({user, cuit: profile})
      const cuits = await getUserCuits({user})
      dispatch(setUserCuitAccounts({cuitAccounts: cuits}))
      navigate('/');
      Toastify({
        text: 'Se ha agregado correctamente el cuit',
        style: {
          background: 'green',
          color: 'white',
        },
        position: 'center',
        duration: 3000,
      }).showToast();
    } catch (error: any) {
      console.log(error)
      Toastify({
        text: error.message || 'Error desconocido vuelva a intentarlo',
        style: {
          background: 'red',
          color: 'white',
        },
        position: 'center',
        duration: 3000,
      }).showToast();
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
              label="TIPO DE REGISTRO"
              items={[
                { value: 'MONOTRIBUTO', message: 'Monotributista' },
                { value: 'RESPONSABLE_INSCRIPTO', message: 'Responsable inscripto' },
              ]}
              containerStyle={{ width: '25%' }}
              onSelect={(selected: ISelectItemProps) => {
                setRegisterType(selected);
              }}
            >
              {registerType?.message || 'SELECCIONAR'}
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
            <div>
              <Dropzone
                onDrop={onImportPrivateKey}
              >
                {({
                  getRootProps,
                  getInputProps,
                  isDragActive,
                  isDragReject,
                }) => {
                return (
                  <>
                    <LabelValue label="CLAVE PRIVADA" value="" />
                    <Input
                      {...getInputProps()}
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
                      {...getRootProps()}
                      onChange={onImportPrivateKey}
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
            <div>
              <Dropzone
                onDrop={onImportCertificate}
              >
                {({
                  getRootProps,
                  getInputProps,
                  isDragActive,
                  isDragReject,
                }) => {
                return (
                  <>
                    <LabelValue label="CERTIFICADO" value="" />
                    <Input
                      {...getInputProps()}
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
                      {...getRootProps()}
                      onChange={onImportCertificate}
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
