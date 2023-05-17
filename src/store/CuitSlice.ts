import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Invoice from "../class/Invoice/Invoice";
import StatusTypes from "../class/Invoice/types/StatusTypes";
import { RegisterTypes } from "../class/Profile/types/RegisterTypes";

export interface CuitAccountInput {
    id?: string;
    fullname: string;
    address: string;
    cuit: string,
    registerType: RegisterTypes,
    salePoint: string,
    initAct: string,
    certificate: string,
    privateKey: string,
    vat: number,
    staticVat: boolean,
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
    updated?: number,
    vat: number,
    staticVat: boolean,
}

interface BalanceData {
    amount: number,
    date: Date
}

const initialState: CuitAccount = {
    id: '',
    fullname: '',
    cuit: '',
    registerType: RegisterTypes.MONOTRIBUTO,
    initAct: '',
    salePoint: '',
    address: '',
    balances: [],
    token: '',
    tokenExpires: '',
    invoices: [],
    sign: '',
    totalInvoices: 0,
    currentInvoice: undefined,
    updated: Date.now(),
    staticVat: false,
    vat: 0,

}

export const CuitSlice = createSlice({
    name: 'cuit',
    initialState,
    reducers: {
        setActiveCuitAccount: (state, action: PayloadAction<({cuit: CuitAccount})>) => {
            state.id = action.payload.cuit.id!;
            state.fullname = action.payload.cuit.fullname
            state.address = action.payload.cuit.address
            state.registerType = action.payload.cuit.registerType
            state.cuit = action.payload.cuit.cuit
            state.initAct = action.payload.cuit.initAct
            state.salePoint = action.payload.cuit.salePoint
            state.vat = action.payload.cuit.vat
            state.staticVat = action.payload.cuit.staticVat
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
            state.updated = Date.now()
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
            state.registerType = initialState.registerType
            state.cuit = initialState.cuit
            state.initAct = initialState.initAct
            state.invoices = initialState.invoices
            state.token = initialState.token
            state.sign = initialState.sign
            state.tokenExpires = initialState.tokenExpires
            state.salePoint = initialState.salePoint
            state.balances = initialState.balances
            state.vat = initialState.vat,
            state.staticVat = initialState.staticVat
        },
        setCurrentInvoice: (state, action: PayloadAction<{invoiceNumber?: string}>) => {
            state.currentInvoice = action.payload.invoiceNumber
        },
    }
})

export default CuitSlice.reducer
export const { setActiveCuitAccount, setCuitCredentials, setCuitInvoices, unsetCuitAccount, setCuitBalances, addPendingInvoices, updateInvoiceStatus, setCurrentInvoice  }= CuitSlice.actions