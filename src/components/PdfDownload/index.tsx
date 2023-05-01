import Invoice from "../../class/Invoice/Invoice";
import { registerTypesLabels } from "../../class/Profile/types/RegisterTypes";
import { CuitAccount } from "../../store/CuitSlice";
import { convertDateToDDMMAAAASeparated2 } from "../../utils/utils";
import './index.css';

export const invoiceTypes = {
  C: 11,
  A:1,
  B: 6,
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

function PDFDownload({invoice, cuit}: {invoice: Invoice, cuit: CuitAccount}) {
    const invoiceDate = new Date(invoice.date)
    const perdesDate = new Date(
        invoiceDate.getFullYear(),
        invoiceDate.getMonth(),
        1
      );
      const perhasDate = new Date(
        invoiceDate.getFullYear(),
        invoiceDate.getMonth() + 1,
        -1
      );
    const cod = invoiceTypes[invoice.invoiceType]
    const invoiceType =
      invoice.invoiceType === 'A' ||
      invoice.invoiceType === 'B' ||
      invoice.invoiceType === 'C'
        ? 'FACTURA'
        : 'NOTA CREDITO'
    return (
        <div className='pdf-download'>
            <div className="borderDiv originalLabel">
            ORIGINAL
            </div>
            <div className="invoiceHeaderContainer">
            <div className="invoiceTypeContainer">
              <div className="invoiceType">{invoiceCodes[invoice.invoiceType]}</div>
              <div>COD. {cod}</div>
            </div>     
          <div className="invoiceHeaderContent">
            <div className="fromName">{cuit.fullname}</div>
              <div className="inf">
                <div className="label">Razón Social: <span className="data">{cuit.fullname}</span></div>
                <div className="label">Domicilio Comercial: <span className="data">{cuit.address}</span></div>
                <div className="label">Condición frente al IVA: {registerTypesLabels[cuit.registerType]}</div>
              </div>
          </div>
          <div className="invoiceHeaderContent">
            <div className="fromName">{invoiceType}</div>
            <div className="inf">
              <div className="label">Punto de Venta: {cuit.salePoint} - Comp. Nro: {invoice.number}</div>
              <div className="label">Fecha Emisión: <span className="data">{convertDateToDDMMAAAASeparated2(invoiceDate)}</span></div>
              <div className="label">CUIT: <span className="data">{cuit.cuit}</span></div>
              <div className="label">Ingresos Brutos: <span className="data">{cuit.cuit}</span></div>
              <div className="label">Inicio de Actividades: <span className="data">{convertDateToDDMMAAAASeparated2(cuit.initAct)}</span></div>
            </div>
          </div>
        </div>
        <div className="borderDiv periodContainer">
          <div className="label">Periodo Facturado Desde: <span className="data">{convertDateToDDMMAAAASeparated2(perdesDate)}</span></div>
          <div className="label">Hasta: <span className="data">{perhasDate.toLocaleString().slice(0,10)}</span></div>
        </div>
        <div className="borderDiv">
          <div className="destinataryInfoContainer">
            <div className="label" style={{lineHeight: '16px', fontSize: '12px'}}>CUIT: <span className="data">{invoice.destinataryDocument}</span></div>
            <div className="label" style={{lineHeight: '16px', fontSize: '12px'}}>Apellido y Nombre / Razon Social: <span className="data">{invoice.destinatary}</span></div>
          </div>
          <div className="destinataryInfoContainer">
            <div className="label" style={{lineHeight: '16px', fontSize: '12px'}}>Condición frente al IVA: <span className="data">Consumidor Final</span></div>
            <div className="label" style={{lineHeight: '16px', fontSize: '12px'}}>Domicilio: <span className="data"> - </span></div>
          </div>
          <div className="destinataryInfoContainer">
            <div className="label" style={{lineHeight: '16px', fontSize: '12px'}}>Condición de venta: <span className="data">Otras</span></div>
          </div>
        </div>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto / Servicio</th>
                <th>Cantidad</th>
                <th>U. Medida</th>
                <th>Precio Unit.</th>
                <th>% Bonif</th>
                <th>Imp. Bonif.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>{invoice.description}</td>
                <td>{invoice.units}</td>
                <td>unidades</td>
                <td>{invoice.unitValue}</td>
                <td>0,00</td>
                <td>0,00</td>
                <td>{invoice.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="borderDiv invoiceTotal">
          <div className="label">Subtotal: $ {invoice.total}</div>
          <div className="label">Importe otros tributos: $ {invoice.total}</div>
          <div className="label">Importe total: $ {invoice.total}</div>
        </div>
        <div className="invoiceTotal">
          <div className="label" style={{fontSize: '12px'}}>CAE N°: {invoice.cae}</div>
        </div>
      </div>
    )
}

export default PDFDownload