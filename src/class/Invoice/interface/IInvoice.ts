import StatusTypes from '../types/StatusTypes';
import InvoiceTypes from '../types/InvoiceTypes';

interface IInvoice {
  readonly _id?: string;
  readonly number: number;
  readonly date: Date;
  readonly invoiceType: InvoiceTypes;
  readonly destinatary: string;
  readonly destinataryDocumentType: string;
  readonly destinataryDocument: string;
  readonly description: string;
  readonly units: number;
  readonly unitValue: number;
  readonly total: number;
  readonly status: StatusTypes;
  readonly reason?: string;
  readonly cae?: string;
  readonly asociatedInvoice?: number;
}

export default IInvoice;
