import StatusTypes from '../types/StatusTypes';
import InvoiceTypes from '../types/InvoiceTypes';

export interface InvoiceItem {
  description?: string,
  units?: number,
  iva?: string,
  unitValue?: number
}

export enum ItemProps {
  UNITARIO = 'unitValue',
  IVA = 'iva',
  UNIDADES = 'units',
  DESCRIPCION = 'description'
}
interface IInvoice {
  readonly _id?: string;
  readonly number: number;
  readonly date: Date;
  readonly invoiceType: InvoiceTypes;
  readonly destinatary: string;
  readonly destinataryDocumentType: string;
  readonly destinataryDocument: string;
  readonly items: InvoiceItem[]
  readonly status: StatusTypes;
  readonly reason?: string;
  readonly cae?: string;
  readonly asociatedInvoice?: number;
}

export default IInvoice;
