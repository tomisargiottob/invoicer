import { v4 as uuidv4 } from 'uuid';
import StatusTypes from './types/StatusTypes';
import InvoiceTypes from './types/InvoiceTypes';
import IInvoice, { InvoiceItem } from './interface/IInvoice';
import ValidationException from './Exceptions/ValidationException';

class Invoice {
  public _id?: string;

  public number: number;

  public date: Date;

  public invoiceType: InvoiceTypes;

  public destinatary: string;

  public destinataryDocumentType: string;

  public destinataryDocument: string;

  public items: InvoiceItem[]

  public status: StatusTypes;

  public reason: string;

  public cae: string;

  public asociatedInvoice?: number

  constructor({
    _id,
    number,
    date,
    invoiceType,
    destinatary,
    destinataryDocumentType,
    destinataryDocument,
    items,
    status,
    reason,
    cae,
    asociatedInvoice,
  }: IInvoice) {
    const errors = Invoice.validate({
      number,
      date,
      invoiceType,
      destinatary,
      destinataryDocumentType,
      destinataryDocument,
      items,
      status,
    });
    if (errors.length > 0) throw new ValidationException(errors);

    this._id = _id || uuidv4();
    this.number = number;
    this.date = date;
    this.invoiceType = invoiceType;
    this.destinatary = destinatary;
    this.destinataryDocumentType = destinataryDocumentType;
    this.destinataryDocument = destinataryDocument;
    this.items = items;
    this.status = status;
    this.reason = reason || '';
    this.cae = cae || '';
    this.asociatedInvoice= asociatedInvoice;
  }

  public static validate({
    number,
    date,
    destinatary,
    destinataryDocumentType,
    destinataryDocument,
    items
  }: IInvoice) {
    const errors = [];
    if (!number) errors.push('Debe tener un numero de Factura.');
    if (!date) errors.push('Debe contener una fecha.');
    if (!destinatary) errors.push('Debe tener un destinatario.');
    if (!destinataryDocumentType || destinataryDocumentType === 'undefined')
      errors.push('Debe tener un tipo documento valido para el destinatario.');
    if (!RegExp(/[0-9]+/g).test(destinataryDocument))
      errors.push(
        'Debe tener un documento valido (XXXXXXXX) sin guiones en caso de CUIL o CUIT'
      );
    for(const item of items) {
      if (!item.description) {
        errors.push(
          'Producto debe tener una descripcion'
        );
      }
      if (!item.iva) {
        errors.push(
          'Producto debe tener un iva'
        );
      }
      if (!item.unitValue) {
        errors.push(
          'Producto debe tener una descripcion'
        );
      }
      if (!item.units) {
        errors.push(
          'Producto debe tener una cantidad de unidades'
        );
      }
    }

    return errors;
  }
}

export default Invoice;
