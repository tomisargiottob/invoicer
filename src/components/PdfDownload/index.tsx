import { registerTypesLabels } from "../../class/Profile/types/RegisterTypes";
import { CuitAccount } from "../../store/CuitSlice";
import { convertDateToDDMMAAAASeparated2 } from "../../utils/utils";
import { lastDayOfMonth } from "date-fns";
import './index.css';
import InvoiceV1 from "../../class/Invoice/InvoiceV1";

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

function PDFDownload({invoice, cuit}: {invoice: InvoiceV1, cuit: CuitAccount}) {
    const invoiceDate = new Date(invoice.date)
    const perdesDate = new Date(
        invoiceDate.getFullYear(),
        invoiceDate.getMonth(),
        1
      );
    const perhasDate = lastDayOfMonth(invoiceDate)
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
                {/* <div className="label">Razón Social: <span className="data">{cuit.fullname}</span></div> */}
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
          <div className="label">Periodo Facturado Desde: 
            {/* <span className="data">{convertDateToDDMMAAAASeparated2(perdesDate)}</span> */}
          </div>
          <div className="label">Hasta: 
            {/* <span className="data">{convertDateToDDMMAAAASeparated2(perhasDate.toISOString())}</span> */}
          </div>
        </div>
        <div className="borderDiv cuit-data">
          <div className="destinataryInfoContainer">
            <div className="label">
            {
              invoice.destinataryDocumentType === '96' ? 'DNI:' : 'CUIT:'
            }
            <span className="data">{invoice.destinataryDocument}</span></div>
            <div className="label">Apellido y Nombre / Razon Social: <span className="data">{invoice.destinatary}</span></div>
          </div>
          <div className="destinataryInfoContainer">
            <div className="label">Condición frente al IVA: <span className="data">{['A', 'NOTA_CREDITO_A'].includes(invoice.invoiceType) ? 'Responsable Inscripto' : 'Consumidor Final'}</span></div>
            <div className="label">Domicilio: <span className="data"> - </span></div>
          </div>
          <div className="destinataryInfoContainer">
            <div className="label">Condición de venta: <span className="data">Otras</span></div>
          </div>
        </div>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Cód.</th>
                <th>Producto / Servicio</th>
                <th>Cant.</th>
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
                <td>{Number(invoice.unitValue).toFixed(2)}</td>
                <td>0,00</td>
                <td>0,00</td>
                <td>{invoice.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="borderDiv invoiceTotal vat-description">
          <div className="vat-types">
            {['A', 'NOTA_CREDITO_A'].includes(invoice.invoiceType) ? (<>
                <div className="label">Subtotal: </div><div>$ {invoice.total - invoice.total * cuit.vat/100}</div>
                <div className="label">Importe otros tributos: </div> <div>$ 0</div>
                <div className="label">IVA {cuit.vat}%: </div> <div>$ {invoice.total * cuit.vat/100}</div>
              </>) : (<>
                <div className="label">Subtotal: </div><div>$ {invoice.total}</div>
                <div className="label">Importe otros tributos: </div> <div>$ 0</div>
              </>)}
            <div className="label">Importe total: </div> <div>$ {invoice.total}</div>
          </div>
        </div>
        <div className="invoiceTotal">
          <div className="label">CAE N°: {invoice.cae}</div>
        </div>
      </div>
    )
}

export default PDFDownload