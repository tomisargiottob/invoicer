import { useMemo } from "react"
import Invoice from "../../class/Invoice/Invoice"
import LabelValue from "../../components/LabelValue"
import { getProductIva } from "../../components/PdfDownload/PdfDownloadV2"

const InvoiceV2View = ({invoice}: {invoice: Invoice}) => {
    const isInvoiceA = invoice.invoiceType === 'A'
    const invoiceTotal = useMemo(() => {
        return invoice.items.reduce((amount: {iva: number, grossAmount: number, netAmount: number, excentAmount: number, notTaxedAmount: number}, item) => {
            amount.netAmount += item.units! * item.unitValue!
            if(item.iva?.toString().toLowerCase() === 'exento') {
                amount.excentAmount += item.units! * item.unitValue!
                return amount
            }
            if(item.iva?.toString().toLowerCase() === 'no gravado') {
                amount.notTaxedAmount += item.units! * item.unitValue!
                return amount
            }
            amount.iva += getProductIva(isInvoiceA, item)
            amount.grossAmount += Math.round((item.units! * item.unitValue! * ((100 - +item.iva!) / 100)*100))/100
            return amount
        }, {iva: 0, grossAmount: 0, netAmount: 0, excentAmount: 0, notTaxedAmount: 0})
    }, [invoice])
    return (
        <>
        <div className="multiple-items">
            <span className="labelvalue-label">DESCRIPCION</span>
            <span className="labelvalue-label">IVA %</span>
            <span className="labelvalue-label">VALOR U.</span>
            <span className="labelvalue-label">UNIDADES</span>
            <span className="labelvalue-label">IVA $</span>
            <span className="labelvalue-label">TOTAL</span>

            {invoice.items.map((item) => {
                return (
                    <>
                        <span className="labelvalue-value">{item.description}</span>
                        <span className="labelvalue-value">{isNaN(item.iva as number) ? item.iva : `${item.iva}%`} </span>
                        <span className="labelvalue-value">{item.unitValue?.toLocaleString('es')} $</span>
                        <span className="labelvalue-value">{item.units}</span>
                        <span className="labelvalue-value">{getProductIva(isInvoiceA, item).toLocaleString('es')} $</span>
                        <span className="labelvalue-value">{(item.units! * item.unitValue!).toLocaleString('es')} $</span>
                    </>
                )
            })}
        </div>
        <div className="multiple-items-results">
            <span className="labelvalue-label">TOTAL BRUTO</span>
            <span className="labelvalue-label">TOTAL EXENTO</span>
            <span className="labelvalue-label">TOTAL NO GRAVADO</span>
            <span className="labelvalue-label">TOTAL IVA</span>
            <span className="labelvalue-label">TOTAL FACTURA</span>
            <span className="labelvalue-value">{invoiceTotal.grossAmount.toLocaleString('es')} $</span>
            <span className="labelvalue-value">{invoiceTotal.excentAmount.toLocaleString('es')} $</span>
            <span className="labelvalue-value">{invoiceTotal.notTaxedAmount.toLocaleString('es')} $</span>
            <span className="labelvalue-value">{invoiceTotal.iva.toLocaleString('es')} $</span>
            <span className="labelvalue-value">{invoiceTotal.netAmount.toLocaleString('es')} $</span>
        </div>
        </>

    )
}

export default InvoiceV2View