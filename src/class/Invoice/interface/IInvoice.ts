import StatusTypes from '../types/StatusTypes';
import InvoiceTypes from '../types/InvoiceTypes';

export interface InvoiceItem {
  id?: number
  description?: string,
  units?: number,
  iva?: number | string,
  unitValue?: number
}

export enum ItemProps {
  UNITARIO = 'unitValue',
  IVA = 'iva',
  UNIDADES = 'units',
  DESCRIPCION = 'description'
}

export type IInvoiceV1 = {
  readonly _id?: string;
  readonly number: number;
  readonly date: Date;
  readonly invoiceType: InvoiceTypes;
  readonly destinatary: string;
  readonly destinataryDocumentType: string;
  readonly destinataryDocument: string;
  readonly description: string,
  readonly units: number,
  readonly unitValue: number
  readonly total: number
  readonly status: StatusTypes;
  readonly reason?: string;
  readonly cae?: string;
  readonly asociatedInvoice?: number;
  readonly version: 'v1'
}

export type IInvoiceV2 = {
  readonly _id?: string;
  readonly number: number;
  readonly date: Date;
  readonly invoiceType: InvoiceTypes;
  readonly destinatary: string;
  readonly destinataryDocumentType: string;
  readonly destinataryDocument: string;
  readonly destinataryAddress: string;
  readonly items: InvoiceItem[]
  readonly startDate?: Date
  readonly endDate?: Date
  readonly status: StatusTypes;
  readonly reason?: string;
  readonly cae?: string;
  readonly asociatedInvoice?: number;
  readonly version: 'v2'
}

type IInvoice = IInvoiceV2 | IInvoiceV1

export default IInvoice;
