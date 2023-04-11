
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { User } from '../../store/UserSlice';
import { Dispatch } from 'redux';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { CuitAccount, setCuitCredentials, unsetCuitAccount } from '../../store/CuitSlice';
import { activateUserAccount } from '../../requests/cuitRequests';

class SystemAuth {

  static async authenticate(user: User ,profile: CuitAccount, dispatch: Dispatch, setActiveCuitAccount: ActionCreatorWithPayload<{cuit:CuitAccount}>) {

    try {
      Toastify({
        text: 'Iniciando Sesion...',
        style: {
          background: 'green',
          color: 'white',
        },
        position: 'center',
        duration: 3000,
      }).showToast();
      dispatch(setCuitCredentials({sign: '', token: '', tokenExpires: ''}))
      const loginObject = await activateUserAccount({user, id: profile.id!})
      if(!loginObject) {
        throw new Error('No se pudo iniciar sesion, vuelva a intentarlo mas tarde')
      }
      dispatch(setActiveCuitAccount({cuit: profile}))
      dispatch(setCuitCredentials({sign: loginObject.sign, token: loginObject.token, tokenExpires: loginObject.expirationTime}))
 
      Toastify({
        text: 'Sesion Iniciada',
        style: {
          background: 'green',
          color: 'white',
        },
        position: 'center',
        duration: 3000,
      }).showToast();
      return profile;
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
      dispatch(unsetCuitAccount())
      throw new Error(err.message);
    }
  }
}

export default SystemAuth;
