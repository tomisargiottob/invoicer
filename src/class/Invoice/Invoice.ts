import { v4 as uuidv4 } from 'uuid';
import StatusTypes from './types/StatusTypes';
import InvoiceTypes from './types/InvoiceTypes';
import IInvoice from './interface/IInvoice';
import ValidationException from './Exceptions/ValidationException';

class Invoice {
  public _id?: string;

  public number: number;

  public date: Date;

  public invoiceType: InvoiceTypes;

  public destinatary: string;

  public destinataryDocumentType: string;

  public destinataryDocument: string;

  public description: string;

  public units: number;

  public unitValue: number;

  public total: number;

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
    description,
    units,
    unitValue,
    total,
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
      description,
      units,
      unitValue,
      status,
      total,
    });
    if (errors.length > 0) throw new ValidationException(errors);

    this._id = _id || uuidv4();
    this.number = number;
    this.date = date;
    this.invoiceType = invoiceType;
    this.destinatary = destinatary;
    this.destinataryDocumentType = destinataryDocumentType;
    this.destinataryDocument = destinataryDocument;
    this.description = description;
    this.units = units;
    this.unitValue = unitValue;
    this.total = total;
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
    description,
    units,
    unitValue,
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
    if (!description) errors.push('Debe tener una descripcion.');
    if (units <= 0) errors.push('Debe tener al menos una unidad.');
    if (unitValue <= 0) errors.push('Debe tener un valor unitario mayor a 0.');

    return errors;
  }
}

export default Invoice;
