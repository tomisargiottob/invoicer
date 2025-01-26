import { registerTypesLabels } from "../../class/Profile/types/RegisterTypes";
import { CuitAccount } from "../../store/CuitSlice";
import { convertDateToDDMMAAAASeparated2 } from "../../utils/utils";
import './pdfDownloadV2Styles.css';
import Invoice from "../../class/Invoice/Invoice";
import { format, parseISO } from "date-fns";

export const invoiceTypes = {
  C: 11,
  A: '01',
  B: '006',
  NOTA_CREDITO_A: 3,
  NOTA_CREDITO_B: 8,
  NOTA_CREDITO_C: 13,
}

const invoiceCodes = {
  C: 'C',
  A:'A',
  B: 'B',
  NOTA_CREDITO_A: 'A',
  NOTA_CREDITO_B: 'B',
  NOTA_CREDITO_C: 'C',
}

export const vatValues: {[k:string]: number} = {
  'No gravado': 0,
  'Excento': 0,
  0: 0,
  10.5: 10.5,
  21: 21,
  27: 27,
  5: 5,
  2.5: 2.5
}

const copies = ['ORIGINAL', 'DUPLICADO', 'TRIPLICADO']

const transformDigitNumber = (number: number, digits: number, fill=0) => {
  const currentLength = number.toString().length
  const missingNumbers = digits - currentLength
  return fill.toString().repeat(missingNumbers)+number
}

function PDFDownloadV2({invoice, cuit}: {invoice: Invoice, cuit: CuitAccount}) {
    const invoiceDate = new Date(invoice.date)
    const perdesDate = invoice.startDate && new Date(invoice.startDate);
    const perhasDate = invoice.endDate && new Date(invoice.endDate);
    const cod = invoiceTypes[invoice.invoiceType]
    const invoiceType =
      invoice.invoiceType === 'A' ||
      invoice.invoiceType === 'B' ||
      invoice.invoiceType === 'C'
        ? 'FACTURA'
        : 'NOTA CREDITO'

    const total = invoice.items.reduce((amount: {iva: {[k: string]: number}, grossAmount: number, netAmount: number, excentAmount: number, notTaxedAmount: number}, item) => {
      amount.netAmount += item.units! * item.unitValue!
      if (item.iva?.toString().toLowerCase() === 'exento') {
        amount.excentAmount += item.units! * item.unitValue!
        return amount
      }
      if (item.iva?.toString().toLowerCase() === 'no gravado') {
        amount.notTaxedAmount += item.units! * item.unitValue!
        return amount
      }
      if (!amount.iva[item.iva!]) amount.iva[item.iva!] = 0
      amount.iva[item.iva!] += item.units! * item.unitValue! * (vatValues[item.iva!] / 100)
      amount.grossAmount += Math.round((item.units! * item.unitValue! * 100/(100 + +vatValues[item.iva!])*100))/100
      return amount
  }, {iva: {}, grossAmount: 0, netAmount: 0, excentAmount: 0, notTaxedAmount: 0})
    return (
      <>
        {copies.map((copy) => {
          return (
              <div className='pdf-download-v2'>
                <div className="borderDiv originalLabel">
                  {copy}
                </div>
              <div className="invoiceHeaderContainer">
                <div className="invoiceTypeContainer">
                  <div className="invoiceType">{invoiceCodes[invoice.invoiceType]}</div>
                  <div className="invoice-code">COD. {cod}</div>
                </div>     
                <div className="invoiceHeaderContent">
                  <div className="fromName">{cuit.fullname}</div>
                  <div className="inf">
                    {/* <div className="label">Razón Social: <span className="data">{cuit.fullname}</span></div> */}
                    <div className="label">Domicilio Comercial: <span className="data">{cuit.address}</span></div>
                    <div className="label">Condición frente al IVA: {registerTypesLabels[cuit.registerType]}</div>
                  </div>
                </div>
                <div className="invoiceHeaderContent">
                  <div className="fromName">{invoiceType}</div>
                  <div className="inf">
                    <div className="label">Punto de Venta: {cuit.salePoint} - Comp. Nro: {transformDigitNumber(invoice.number,8)}</div>
                    <div className="label">Fecha Emisión: <span className="data">{convertDateToDDMMAAAASeparated2(invoiceDate)}</span></div>
                    <div className="label">CUIT: <span className="data">{cuit.cuit}</span></div>
                    <div className="label">Ingresos Brutos: <span className="data">{cuit.cuit}</span></div>
                    <div className="label">Inicio de Actividades: <span className="data">{convertDateToDDMMAAAASeparated2(cuit.initAct)}</span></div>
                  </div>
                </div>
              </div>
              <div className="borderDiv periodContainer">
                <div className="label">Periodo Facturado Desde: 
                  {perdesDate && <span className="data date-period">{convertDateToDDMMAAAASeparated2(perdesDate)}</span>}
                </div>
                <div className="label">Hasta: 
                  {perhasDate && <span className="data date-period">{convertDateToDDMMAAAASeparated2(perhasDate.toISOString())}</span>}
                </div>
              </div>
              <div className="borderDiv cuit-data">
                <div className="destinataryInfoContainer">
                  <div className="label">
                  {
                    invoice.destinataryDocumentType === '96' ? 'DNI:' : 'CUIT:'
                  }
                  <span className="data">{invoice.destinataryDocument}</span></div>
                  <div className="label">Condición frente al IVA: <span className="data">{['A', 'NOTA_CREDITO_A'].includes(invoice.invoiceType) ? 'Responsable Inscripto' : 'Consumidor Final'}</span></div>
                  <div className="label">Condición de venta: <span className="data">Otras</span></div>
                </div>
                <div className="destinataryInfoContainer">
                  <div className="label">Apellido y Nombre / Razon Social: <span className="data">{invoice.destinatary}</span></div>
                  <div className="label">Domicilio: <span className="data"> {invoice.destinataryAddress || '-'} </span></div>
                </div>
              </div>
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th className="table-description">Producto / Servicio</th>
                      <th>Cantidad</th>
                      <th>U. medida</th>
                      <th>Precio Unit.</th>
                      <th>% Bonif</th>
                      <th>Imp. Bonif.</th>
                      <th>Subtotal</th>
                      {invoice.invoiceType === 'A' && (
                        <>
                          <th>Alicuota IVA</th>
                          <th>Subtotal c/IVA</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => {
                      return (
                        <tr>
                          <td></td>
                          <td className="table-description">{item.description}</td>
                          <td>{item.units}</td>
                          <td>unidades</td>
                          <td>{Number(item.unitValue! * (invoice.invoiceType === 'A' ? 100/(100 + +vatValues[item.iva!]) : 1)).toFixed(2)}</td>
                          <td>0,00</td>
                          <td>0,00</td>
                          <td>{(+item.units! * +(item.unitValue! * (invoice.invoiceType === 'A' ? 100/(100 + +vatValues[item.iva!]) : 1))).toFixed(2)}</td>
                          {invoice.invoiceType === 'A' && (
                            <>
                              <td>{isNaN(item.iva! as number) ? item.iva : `${item.iva}%`}</td>
                              <td>{+item.units! * +item.unitValue!}</td>
                            </>
                          )}
                        </tr>
                      ) 
                    })}
                  </tbody>
                </table>
              </div>
              <div className="borderDiv invoiceTotal vat-description">
                <div className="vat-types">
                  {['A', 'NOTA_CREDITO_A'].includes(invoice.invoiceType) ? (<>
                      <div className="label">Importe Exento: </div><div>$ {total.excentAmount}</div>
                      <div className="label">Importe No gravado: </div><div>$ {total.notTaxedAmount}</div>
                      <div className="label">Importe Neto gravado: </div><div>$ {total.grossAmount}</div>
                      <div className="label">Importe otros tributos: </div> <div>$ 0</div>
                      {Object.entries(total.iva).map(([ivaAmount, ivaValue]) => (
                        <>
                          <div className="label" key={ivaAmount}>IVA {ivaAmount}%: </div> <div>$ {ivaValue}</div>
                        </>
                      ))}
                    </>) : (<>
                      <div className="label">Subtotal: </div><div>$ {total.netAmount}</div>
                      <div className="label">Importe otros tributos: </div> <div>$ 0</div>
                    </>)}
                  <div className="label">Importe total: </div> <div>$ {total.netAmount}</div>
                </div>
              </div>
              <div className="invoice-footer">
                <div className="label">Fecha Vto. de CAE: {invoice.caeExpirationDate ? format(parseISO(invoice.caeExpirationDate), 'dd/MM/yyyy') : ''}</div>
                <div className="label">CAE N°: {invoice.cae}</div>
              </div>
            </div>
          )
        })}
      </>
    )
}

export default PDFDownloadV2