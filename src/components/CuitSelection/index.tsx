import React, { useState, Dispatch } from "react"
import { useAppSelector } from "../../store/store"
import './index.css'
import Input from '../Input';
import { CuitAccount } from "../../store/CuitSlice";


const CuitSelection = ({selectProfile}: { selectProfile: Dispatch<React.SetStateAction<CuitAccount | undefined>>}) => {
    const user = useAppSelector((state) => state.user)
    const [accounts, setAccounts] = useState(user.cuitAccounts)

    const handleFilterChange = (value: string ) => {
        if(value) {
            setAccounts(user.cuitAccounts.filter((cuitAccount) => {
                const cuit = cuitAccount.cuit.replace('-', '')
                const parsedCuit = value.replace('-', '')

                return cuitAccount.fullname.toLowerCase().includes(value.toLowerCase()) || cuit.includes(parsedCuit)
            }))
        } else {
            setAccounts(user.cuitAccounts)
        }
    }

    return (
        <div className="cuit-selection-container">
            <div className="cuit-selection-section">
            <h3>Seleccione la cuenta a la que desea conectarse</h3>
                <Input label="Buscar" onChange={(e) => handleFilterChange(e.target.value)} inputStyle={{padding: '4px', width: '70%', margin: '0 auto', marginBottom: '10px'}} containerStyle={{display: 'grid', textAlign: 'center'}}></Input>
                <div className="cuit-selection-options">
                    {accounts.length ? <>
                        {accounts.map((account, idx) => (
                            <div key={idx} className="cuit-selection-account" onClick={()=>selectProfile(account)}>
                                <span>
                                    {account.fullname}
                                </span>
                                <span>
                                    ({account.cuit})
                                </span>
                                </div>
                        ))}</>
                    : <div className="filter-message">Ningun cuit cumple los criterios de busqueda indicados</div>
                }
                </div>
            </div>
        </div>
    )
}

export default CuitSelection