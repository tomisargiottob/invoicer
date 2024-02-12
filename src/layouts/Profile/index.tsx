import React, { useState } from 'react'
import { ConfirmSuscription, FakePassword,CancelSuscription, ProfileSection, ProfileTitle, SecondaryTitle, StatusLight, TableData, TableLabel, TableSpace, TableValue, WarningMessage, Separator, SuscriptionSection } from './styles'
import Navbar from '../../components/Navbar'
import { useDispatch } from 'react-redux'
import { setActiveCuitAccount } from '../../store/CuitSlice'
import { useNavigate } from 'react-router-dom'
import { Col, Collapse, Row, Select } from 'antd';
import { useAppSelector } from '../../store/store'
import { createSuscription, cancelSuscription } from '../../requests/paymentRequests'
import { setUser } from '../../store/UserSlice'
import { getUserData } from '../../requests/userRequest'

const { Panel } = Collapse;

const Profile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [warning,serWarning] = useState('')
    const [amount, setAmount] = useState(0)
    const user = useAppSelector((state) => state.user)

    const createPaymentLink = async () => {
        try {
            serWarning('')
            const order = await createSuscription(amount, user)
            window.location.href = order.link;
        } catch (err: any) {
            serWarning(err.response?.data?.message || 'Algo ha fallado por favor intentelo de nuevo')
        }
    }
    const handleCancel = async () => {
        try {
            serWarning('')
            await cancelSuscription(user)
            const response = await getUserData(localStorage.getItem('logged_user')!)
            dispatch(setUser({user: {...response.user, token: response.token, paymentRequired: response.paymentRequired, maxCuits: response.maxCuits}}))
        } catch (err: any) {
            serWarning(err.response?.data?.message || 'Algo ha fallado por favor intentelo de nuevo')
        }
    }
    const onChange = (value: number) => {
        setAmount(value)
    };

    const generateOptions = () => {
        const options = []
        for (let i =1; i<100; i++) {
            options.push({
                label: i.toString(),
                value: i,
            })
        }
        return options
    }

    return (
        <>
        <Navbar
            selectedProfile={undefined}
            onSelectedProfile={(profile) => {
                dispatch(setActiveCuitAccount({cuit: profile}))
                navigate('/')
            }}
            paymentRequired={user.paymentRequired}
        />
        <ProfileSection className="container">
            <ProfileTitle>Perfil </ProfileTitle>
            <TableData>
                <SecondaryTitle> Información </SecondaryTitle>
                <Row>
                    <Col span={8}>
                        <TableSpace>
                            <TableLabel>Nombre</TableLabel>
                            <TableValue>{user.name}</TableValue>
                        </TableSpace>
                    </Col>
                    <Col span={8}>
                        <TableSpace>
                            <TableLabel>Email</TableLabel>
                            <TableValue>{user.email}</TableValue>
                        </TableSpace>
                    </Col>
                    <Col span={8}>
                        <TableSpace>
                            <TableLabel>Contraseña</TableLabel>
                            <TableValue><FakePassword>12345678</FakePassword></TableValue>
                        </TableSpace>
                    </Col>
                </Row>
            </TableData>
            <TableData>
                <SecondaryTitle>Suscripción</SecondaryTitle>
                <Row>
                    <Col span={6}>
                        <TableSpace>
                            <TableLabel>Cuits registrados</TableLabel>
                            <TableValue>{user.cuitAccounts.length}</TableValue>
                        </TableSpace>
                    </Col>
                    <Col span={6}>
                        <TableSpace>
                            <TableLabel>Cuits disponibles</TableLabel>
                            <TableValue>{user.maxCuits - user.cuitAccounts.length}</TableValue>
                        </TableSpace>
                    </Col>
                    <Col span={6}>
                        <TableSpace>
                            <TableLabel>Cuits totales</TableLabel>
                            <TableValue>{user.maxCuits}</TableValue>
                        </TableSpace>
                    </Col>
                    <Col span={6}>
                        <TableSpace>
                            <TableLabel>Estado de la cuenta</TableLabel>
                            <TableValue>
                                <StatusLight color={user.paymentRequired ? 'red' : 'green'}></StatusLight>
                                {user.paymentRequired ? 'INACTIVO': 'ACTIVO'}
                            </TableValue>
                        </TableSpace>
                    </Col>
                </Row>
                <Separator></Separator>
                <Collapse defaultActiveKey={[]}>
                    <Panel header="Editar suscripción" key="1">
                        <Row style={{justifyContent: 'center'}}>
                            <Col offset={0} span={24}>
                                {warning && 
                                    <Row>
                                        <WarningMessage>{warning}</WarningMessage>
                                    </Row>
                                }
                                <SuscriptionSection>
                                    <TableLabel>Cantidad de cuits</TableLabel>
                                    <Select
                                        showSearch
                                        placeholder="Seleccione"
                                        optionFilterProp="children"
                                        onChange={onChange}
                                        filterOption={(input, option) =>
                                        (option?.label as string ?? '').includes(input)
                                        }
                                        options={generateOptions()}
                                    />
                                    <ConfirmSuscription onClick={createPaymentLink}> Confirmar Suscripción </ConfirmSuscription>
                                </SuscriptionSection>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>
                {!user.paymentRequired && <Row>
                    <Col offset={0} span={24}>
                        <h3>Detener suscripción</h3>
                        <SuscriptionSection>
                            <CancelSuscription onClick={()=>handleCancel()}> Eliminar </CancelSuscription>
                        </SuscriptionSection>
                    </Col>
                </Row>}
                
            </TableData>

        </ProfileSection>
        </>
    )
}

export default Profile