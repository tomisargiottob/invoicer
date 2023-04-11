import axios from "axios";
import Invoice from "../class/Invoice/Invoice";
import { User } from "../store/UserSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000/api",
});

export async function getNextInvoiceNumber({user, cuit, invoiceType}: {user:User, cuit: string, invoiceType: string}) {
    const response = await api.get(`/organizations/${user.organization}/cuits/${cuit}/invoiceNumber`, {headers: {Authorization: user.token}, params: {invoiceType}})
    return response.data
}

export async function createInvoice({user, cuit, invoice}: {user:User, cuit: string, invoice: Invoice}) {
    if(invoice._id) {
        delete invoice._id
    }
    const response = await api.post(`/organizations/${user.organization}/cuits/${cuit}/invoices`,{invoiceData:invoice}, {headers: {Authorization: user.token}})
    return response.data
}

export async function getInvoices({user, cuit, skip, filter}: {user:User, cuit: string, skip?: number, filter?: string}) {
    const response = await api.get(`/organizations/${user.organization}/cuits/${cuit}/invoices`, {headers: {Authorization: user.token}, params: {skip, filter}})
    return response.data
}

