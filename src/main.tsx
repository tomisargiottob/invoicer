import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'toastify-js/src/toastify.css';
import { store } from './store/store'
import { Provider } from 'react-redux'
//@ts-ignore
import { WhatsAppWidget } from 'react-whatsapp-widget';
import 'react-whatsapp-widget/dist/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <WhatsAppWidget 
      companyName="Facturama" 
      phoneNumber="5493516808415" 
      message='Hola! 👋🏼 Bienvenido a Facturama! ¿Cómo te podemos ayudar?' 
      replyTimeText="En linea" 
      inputPlaceHolder="Escribe un mensaje"
      sendButtonText="Enviar"
    />
  </React.StrictMode>,
)
