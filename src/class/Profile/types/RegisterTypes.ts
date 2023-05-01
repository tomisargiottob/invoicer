import InvoiceTypes from "../../Invoice/types/InvoiceTypes";

export enum RegisterTypes {
    MONOTRIBUTO = 'MONOTRIBUTO',
    RESPONSABLE_INSCRIPTO = 'RESPONSABLE_INSCRIPTO'
}

export const defaultInvoiceType = {
    MONOTRIBUTO: InvoiceTypes.C,
    RESPONSABLE_INSCRIPTO: InvoiceTypes.A
}

export const registerTypesLabels = {
    MONOTRIBUTO: 'MONOTRIBUTISTA',
    RESPONSABLE_INSCRIPTO: 'RESPONSABLE INSCRIPTO'
}

export const registerTypeInvoices = {
    MONOTRIBUTO: ['C'],
    RESPONSABLE_INSCRIPTO: ['A','B']
}