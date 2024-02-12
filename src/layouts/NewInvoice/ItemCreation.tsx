import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { InvoiceItem } from "../../class/Invoice/interface/IInvoice"
import Input from "../../components/Input"
import LabelValue from "../../components/LabelValue"
import Select, { ISelectItemProps } from "../../components/Select"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import SecondaryButton from "../../components/SecondaryButton"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useAppSelector } from "../../store/store"

const ItemCreation = ({items, setItems}: {items: InvoiceItem[], setItems: Dispatch<SetStateAction<any>>}) => {
    const cuit = useAppSelector((state) => state.cuit)
    useEffect(() => {
        if(items.length === 0) {
          setItems([{
            id: 0,
            description: '',
            iva: cuit.vat ?? 0,
            unitValue: 0,
            units: 0,
          }])
        }
      },[items])
    
      const handleAddItem = () => {
        setItems([...items, {
          id: items.length,
          description: '',
          iva: 0,
          unitValue: 0,
          units: 0,
        }])
      }
    
      const handleRemoveItem = (id: number) => {
        const itemsCopy = [...items]
        itemsCopy.splice(id, 1)
        setItems(itemsCopy)
      }
    
      const handleItemChange = (id: number, property: keyof InvoiceItem , value: any) => {
        const itemsCopy = [...items]
        const itemCopy = itemsCopy[id]
        itemCopy[property] = value
        setItems(itemsCopy)
      }
    
    return (
        <div className="new-invoice-card-body-item amount-section">
        {items.map((item, idx) => {
          return (<div className="invoice-item">
            <Input
              label="DESCRIPCION"
              containerStyle={{ width: '50%' }}
              onChange={(e) => {
                handleItemChange(idx, 'description', e.target.value)
              }}
              value={item.description}
            />
            <Input
              label="UNIDADES"
              containerStyle={{ width: '10%' }}
              type="number"
              onChange={(e) => {
                handleItemChange(idx, 'units', e.target.value)
              }}
              value={String(item.units)}
            />
            <Input
              label="VALOR UNITARIO"
              containerStyle={{ width: '15%' }}
              type="number"
              onChange={(e) => {
                handleItemChange(idx, 'unitValue', e.target.value)
              }}
              value={String(item.unitValue)}
            />
            <Select
              label="IVA"
              items={[
                { value: '27', message: '27%' },
                { value: '21', message: '21%' },
                { value: '10.5', message: '10.5%' },
                { value: '5', message: '5%' },
                { value: '2.5', message: '2.5%' },
                { value: '0', message: '0%' },
              ]}
              containerStyle={{ width: '15%', marginLeft: '0px' }}
              onSelect={(selected: ISelectItemProps) => {
                handleItemChange(idx, 'iva', selected.value)
              }}
            >
              {item.iva ? `${item.iva}%` : 'SELECCIONAR'}
            </Select>
            <LabelValue
              label='MONTO IVA'
              value={isNaN(item.iva as number) ? '0 $' : `${((item.units || 0) * (item.unitValue || 0) * ( 1 - +item.iva!/100 ) * +item.iva!/100).toLocaleString()} $` }
              containerStyle={{width: '20%'}}
            />
            <LabelValue
              label='Total'
              value={`${((item.units || 0) * (item.unitValue || 0)).toLocaleString()} $` }
              containerStyle={{width: '15%'}}
            />  
            <button className="remove-item" onClick={()=>handleRemoveItem(idx)}>
              <FontAwesomeIcon icon={faTrash}/>
            </button>
          </ div>)
        })}
        <div className="new-invoice-card-footer add-item">
            <SecondaryButton onClick={handleAddItem}>
              Agregar Item
            </SecondaryButton>
        </div>
      </div>
    )
}

export default ItemCreation