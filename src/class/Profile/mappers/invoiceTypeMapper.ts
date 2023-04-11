import InvoiceTypes from '../../Invoice/types/InvoiceTypes';

//TODO: esto es un enum
export default (invoiceType: InvoiceTypes) => {
  switch (invoiceType) {
    case InvoiceTypes.C:
      return 11;

    case InvoiceTypes.A:
      return 1;

    case InvoiceTypes.B:
      return 6;

    case InvoiceTypes.NOTA_CREDITO_A:
      return 3;

    case InvoiceTypes.NOTA_CREDITO_B:
      return 8;

    case InvoiceTypes.NOTA_CREDITO_C:
      return 13;

    default:
      return 11;
  }
};
