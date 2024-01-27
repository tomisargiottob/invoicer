import { useMemo } from "react"
import Invoice from "../../class/Invoice/Invoice"
import LabelValue from "../../components/LabelValue"

const InvoiceV2View = ({invoice}: {invoice: Invoice}) => {
    const invoiceTotal = useMemo(() => {
        return invoice.items.reduce((amount: {iva: number, grossAmount: number, netAmount: number}, item) => {
            amount.iva += item.units! * item.unitValue! * (item.iva! / 100)
            amount.grossAmount += Math.round((item.units! * item.unitValue! * ((100 - item.iva!) / 100)*100))/100
            amount.netAmount += item.units! * item.unitValue!
            return amount
        }, {iva: 0, grossAmount: 0, netAmount: 0})
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
                        <span className="labelvalue-value">{item.iva} %</span>
                        <span className="labelvalue-value">{item.unitValue} $</span>
                        <span className="labelvalue-value">{item.units}</span>
                        <span className="labelvalue-value">{Math.round((item.units! * item.unitValue! * (1 - item.iva!/100) * item.iva!/100)*100)/100 } $</span>
                        <span className="labelvalue-value">{item.units! * item.unitValue!} $</span>
                    </>
                )
            })}
        </div>
        <div className="multiple-items-results">
            <span className="labelvalue-label">TOTAL BRUTO</span>
            <span className="labelvalue-label">TOTAL IVA</span>
            <span className="labelvalue-label">TOTAL FACTURA</span>
            <span className="labelvalue-value">{invoiceTotal.grossAmount} $</span>
            <span className="labelvalue-value">{invoiceTotal.iva} $</span>
            <span className="labelvalue-value">{invoiceTotal.netAmount} $</span>
        </div>
        </>

    )
}

export default InvoiceV2View