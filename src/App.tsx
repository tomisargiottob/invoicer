import DeleteProfile from './layouts/DeleteProfile';
import EditExistInvoice from './layouts/EditExistInvoice';
import Home from './layouts/Home';
import ImportInvoices from './layouts/ImportInvoices';
import ImportBalance from './layouts/MasivaBalance';
import NewInvoice from './layouts/NewInvoice';
import NewProfile from './layouts/NewProfile';
import ViewBalance from './layouts/ViewBalance';
import ViewInvoice from './layouts/ViewInvoice';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import React from 'react'
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './layouts/Login/Login';
import Register from './layouts/Register/Register';
import Instructions from './layouts/Instructions';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/newProfile" element={<PrivateRoute><NewProfile /></PrivateRoute>} />
        <Route path="/deleteProfile/:cuit" element={<PrivateRoute><DeleteProfile /></PrivateRoute>} />
        <Route path="/newInvoice" element={<PrivateRoute><NewInvoice /></PrivateRoute>} />
        <Route path="/importInvoices" element={<PrivateRoute><ImportInvoices /></PrivateRoute>} />
        <Route path="/viewInvoice" element={<PrivateRoute><ViewInvoice /></PrivateRoute>} />
        <Route path="/importBalance" element={<PrivateRoute><ImportBalance /></PrivateRoute>} />
        <Route path="/editInvoice" element={<PrivateRoute><EditExistInvoice /></PrivateRoute>} />
        <Route path="/viewBalance" element={<PrivateRoute><ViewBalance /></PrivateRoute>} />
        <Route path="/instructions" element={<Instructions />} />
      </Routes>
    </Router>
  );
}
