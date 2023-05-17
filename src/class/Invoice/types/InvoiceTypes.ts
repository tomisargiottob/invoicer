enum InvoiceTypes {
  A = 'A',
  B = 'B',
  C = 'C',
  NOTA_CREDITO_A = 'NOTA_CREDITO_A',
  NOTA_CREDITO_B = 'NOTA_CREDITO_B',
  NOTA_CREDITO_C = 'NOTA_CREDITO_C',
}

export const InvoiceTypeMessage = (type: InvoiceTypes) => {
  return type.includes('NOTA') ? type : `FACTURA_${type}`;
};

export const AllowedVats = [0, 10.5, 21, 27, 5, 2.5]

export default InvoiceTypes;
