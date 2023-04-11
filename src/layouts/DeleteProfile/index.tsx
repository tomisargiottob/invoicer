import Button from '../../components/Button';
import Card from '../../components/Card';
import SecondaryButton from '../../components/SecondaryButton';
import Title from '../../components/Title';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
// import SystemProfiles from '../../class/SystemProfiles/SystemProfiles';
import React, { useEffect, useState } from 'react';
import Profile from '../../class/Profile/Profile';
import { useAppSelector } from '../../store/store';
import { useDispatch } from 'react-redux';

const DeleteProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch()
  const cuit = useAppSelector((state) => state.cuit)

  const user = useAppSelector((state) => state.user)

  const onDeleteUser = () => {
    console.log('delete user')
    navigate('/');
  };


  return (
    <div className="delete-profile-card-container">
      <Card>
        <div className="delete-profile-card-title">
          <Title>Eliminar cuit</Title>
        </div>
        <div className="delete-profile-card-body">
          <p className="delete-profile-card-text">
            Esta a punto de eliminar el perfil {cuit?.fullname} (
            {cuit?.cuit}). Toda la información será borrada incluyend facturas y balances creados.
          </p>
          <p className="delete-profile-card-text">
            ¿Esta seguro que desea continuar?
          </p>
        </div>
        <div className="delete-profile-card-footer">
          <SecondaryButton onClick={() => navigate('/')}>
            VOLVER
          </SecondaryButton>
          <Button
            style={{
              backgroundColor: 'rgba(255, 0, 0, .70)',
              color: 'white',
              outline: 0,
            }}
            onClick={onDeleteUser}
          >
            ELIMINAR PERFIL
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DeleteProfile;
