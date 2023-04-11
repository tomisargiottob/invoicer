import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Invoice from "../class/Invoice/Invoice";
import InvoiceTypes from "../class/Invoice/types/InvoiceTypes";
import StatusTypes from "../class/Invoice/types/StatusTypes";

export interface CuitAccountInput {
    id?: string;
    fullname: string;
    address: string;
    cuit: string,
    invoiceType: InvoiceTypes,
    salePoint: string,
    initAct: string,
    certificate: string,
    privateKey: string
}

export interface CuitAccount extends Pick<CuitAccountInput, Exclude<keyof CuitAccountInput,'certificate' | 'privateKey'>> {
    id: string;
    token: string;
    invoices: Invoice[];
    balances: BalanceData[];
    tokenExpires: string;
    sign: string;
    totalInvoices: number;
    currentInvoice?: string;
}

interface BalanceData {
    amount: number,
    date: Date
}

const initialState: CuitAccount = {
    id: '',
    fullname: '',
    cuit: '',
    invoiceType: InvoiceTypes.C,
    initAct: '',
    salePoint: '',
    address: '',
    balances: [],
    token: '',
    tokenExpires: '',
    invoices: [],
    sign: '',
    totalInvoices: 0,
    currentInvoice: undefined
}

export const CuitSlice = createSlice({
    name: 'cuit',
    initialState,
    reducers: {
        setActiveCuitAccount: (state, action: PayloadAction<({cuit: CuitAccount})>) => {
            state.id = action.payload.cuit.id!;
            state.fullname = action.payload.cuit.fullname
            state.address = action.payload.cuit.address
            state.invoiceType = action.payload.cuit.invoiceType
            state.cuit = action.payload.cuit.cuit
            state.initAct = action.payload.cuit.initAct
            state.salePoint = action.payload.cuit.salePoint
        },
        setCuitInvoices: (state, action: PayloadAction<({invoices: Invoice[], totalInvoices: number})>) => {
            state.invoices = action.payload.invoices
            state.totalInvoices = action.payload.totalInvoices
        },
        addPendingInvoices: (state,action: PayloadAction<({invoices: Invoice[]})>) => {
            state.invoices = state.invoices.concat(action.payload.invoices)
        },
        updateInvoiceStatus: (state,action: PayloadAction<({id: string, status: StatusTypes})>) => {
            const updatedInvoice = state.invoices.find((invoice) => invoice._id === action.payload.id)
            if(updatedInvoice) {
                updatedInvoice.status= action.payload.status
            }
        },
        setCuitCredentials: (state, action: PayloadAction<({sign: string, token: string, tokenExpires: string})>) => {
            state.token = action.payload.token
            state.sign = action.payload.sign
            state.tokenExpires = action.payload.tokenExpires
        },
        setCuitBalances: (state, action: PayloadAction<{balances: { date: Date, amount: number }[]}>) => {
            state.balances = action.payload.balances
        },
        unsetCuitAccount:(state) => {
            state.id = initialState.id!;
            state.fullname = initialState.fullname
            state.address = initialState.address
            state.invoiceType = initialState.invoiceType
            state.cuit = initialState.cuit
            state.initAct = initialState.initAct
            state.invoices = initialState.invoices
            state.token = initialState.token
            state.sign = initialState.sign
            state.tokenExpires = initialState.tokenExpires
            state.salePoint = initialState.salePoint
        },
        setCurrentInvoice: (state, action: PayloadAction<{invoiceNumber?: string}>) => {
            state.currentInvoice = action.payload.invoiceNumber
        },
    }
})

export default CuitSlice.reducer
export const { setActiveCuitAccount, setCuitCredentials, setCuitInvoices, unsetCuitAccount, setCuitBalances, addPendingInvoices, updateInvoiceStatus, setCurrentInvoice  }= CuitSlice.actions