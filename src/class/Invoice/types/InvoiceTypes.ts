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

export default InvoiceTypes;
