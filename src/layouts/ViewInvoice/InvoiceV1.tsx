import InvoiceV1 from "../../class/Invoice/InvoiceV1"
import LabelValue from "../../components/LabelValue"

const InvoiceV1View = ({invoice}: {invoice: InvoiceV1}) => {
    return (
        <>
            <div className="view-invoice-card-item">
                <LabelValue
                label="DESCRIPCION:"
                value={invoice ? invoice.description : ''}
                containerStyle={{ width: '50%' }}
                />
            </div>
            <div className="view-invoice-card-item">
                <LabelValue
                label="UNIDADES:"
                value={invoice ? `${invoice.units} u.` : ''}
                containerStyle={{ width: '33%' }}
                />
                <LabelValue
                label="VALOR UNITARIO:"
                value={invoice ? `$ ${invoice.unitValue}` : ''}
                containerStyle={{ width: '33%' }}
                />
                <LabelValue
                label="TOTAL:"
                value={invoice ? `$ ${invoice.total}` : ''}
                containerStyle={{ width: '33%' }}
                />
            </div>
        </>
    )
}

export default InvoiceV1View