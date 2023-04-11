import './index.css';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Title from '../../components/Title';
import Button from '../../components/Button';
import Table from '../../components/Table';
import StatusLabel from '../../components/StatusLabel';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  faAddressCard,
  faCheckCircle,
  faEye,
  faPlusCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { InvoiceTypeMessage } from '../../class/Invoice/types/InvoiceTypes';
import Input from '../../components/Input';
import SystemAuth from '../../class/SystemAuth/SystemAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useAppSelector } from '../../store/store';
import { getUserCuits } from '../../requests/cuitRequests';
import { useDispatch } from 'react-redux';
import { setUserCuitAccounts } from '../../store/UserSlice';
import Spinner from "../../components/Spinner/Spinner";
import CuitSelection from '../../components/CuitSelection';
import { CuitAccount, setActiveCuitAccount, setCuitBalances, setCuitInvoices, setCurrentInvoice } from '../../store/CuitSlice';
import { getInvoices } from '../../requests/invoiceRequests';
import IBalance from '../../class/Profile/interface/IBalance';
import { getBalances } from '../../requests/balanceRequests';


const Home = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<CuitAccount>();
  const [balance, setBalance] = useState(0);
  const [page, setPage] = useState(1);
  const [finder, setFinder] = useState('');
  const [loading, setLoading] = useState(false)
  const [loadingInvoices, setLoadingInvoices] = useState(false)
  const user = useAppSelector((state) => state.user)
  const cuit = useAppSelector((state) => state.cuit)

  const dispatch = useDispatch()

  const loadProfiles = async () => {
    try {
      setLoading(true)
      const userCuits = await getUserCuits({user})
      if(userCuits && userCuits.length) {
        dispatch(setUserCuitAccounts({cuitAccounts: userCuits}))
      }
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      console.log(err)
    }
  };

  useEffect(() => {
    if(selectedProfile) {
      const timer = setTimeout(() => {
        fetchInvoices({filter: finder})
      }, 1000);
  
      return () => clearTimeout(timer);
    }
  }, [finder]); 

  const fetchInvoices = async ({skip, filter}: {skip?: number, filter?: string}) => {
    setLoadingInvoices(true)
    const response = await getInvoices({ user, cuit: selectedProfile!.id, skip, filter })
    dispatch(setCuitInvoices({invoices: response.invoices, totalInvoices: response.count}))
    setLoadingInvoices(false)
  }

  useEffect(() => {
    const onSelectedProfile = async () => {
      if(selectedProfile && Object.keys(selectedProfile).length && (!selectedProfile.token || new Date(cuit?.tokenExpires) <= new Date())) {
        await SystemAuth.authenticate(user, selectedProfile, dispatch, setActiveCuitAccount)
        if(!cuit.invoices.length &&!loadingInvoices) {
          await fetchInvoices({})
        }
      }
    };
    onSelectedProfile()
  },[selectedProfile])


  const onPageChange = async (selectedPage: number) => {
    setPage(selectedPage)
    await fetchInvoices({skip: (selectedPage-1) * 10})
  }

  useEffect(() => {
    if(!cuit.id) {
      setSelectedProfile(undefined)
    } else {
      setSelectedProfile(cuit)
    }
  },[cuit])

  useEffect(() => {
    if (selectedProfile?.tokenExpires) {
      const interval = setInterval(async () => {
        try {
          if (
            ( new Date(selectedProfile.tokenExpires) <= new Date() )
          ) {
            await SystemAuth.authenticate(user, selectedProfile, dispatch, setActiveCuitAccount)
          }
        } catch (err) {
          console.error(err);
        }
      }, 20000);

      return () => clearInterval(interval);
    }
  }, [selectedProfile]);

  useEffect(() => {
    const loadBalance = async () => {
      let balances;
      if(selectedProfile?.id && cuit.id && !cuit.balances?.length) {
        balances = await getBalances({user, cuit: cuit.id})
        dispatch(setCuitBalances({balances}))
      }
      setBalance((balances || cuit.balances).reduce((totalBalance: number, balance: IBalance) => {
        return totalBalance + balance.amount
      },0))
    }
    loadBalance()
  }, [selectedProfile]);

  useEffect(() => {
    if(user.id && !user.cuitAccounts.length) {
      loadProfiles();
    }
  }, [user.id, user.cuitAccounts]);

  const roundUp = (num: number, precision: number) => {
    const precisionV = 10 ** precision;
    return Math.ceil(num * precisionV) / precisionV;
  };

  const visiblesInvoices = 10;

  const invoicesVisibles = cuit.invoices
    .map((invoice) => {
      return {
        ...invoice,
        fullname: cuit.fullname,
        date: `${new Date(invoice.date)
          .getDate()
          .toString()
          .padStart(2, '0')}/${(new Date(invoice.date).getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${new Date(invoice.date).getFullYear()}`,
        status: <StatusLabel status={invoice.status} />,
        invoiceType: InvoiceTypeMessage(invoice.invoiceType),
      };
    });
  return (
    <div className="container">
      <Navbar
        selectedProfile={selectedProfile}
        onSelectedProfile={(profile) => setSelectedProfile(profile)}
      />
      {
        loading ? <><Spinner /></> :
        user.cuitAccounts.length ? !selectedProfile?.cuit ? <CuitSelection selectProfile={setSelectedProfile}/>: <>
        <div className="home-card-detail-container">
          <Card
            containerStyle={{
              width: '30%',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              <Title>Autentificado:</Title>
              <FontAwesomeIcon
                icon={
                  cuit?.token &&
                  cuit?.tokenExpires &&
                  new Date(cuit?.tokenExpires) >= new Date()
                    ? faCheckCircle
                    : faTimesCircle
                }
                size="2x"
                color={
                  cuit?.token &&
                  cuit?.tokenExpires &&
                  new Date(cuit?.tokenExpires) >= new Date()
                    ? 'green'
                    : 'red'
                }
              />
            </div>
          </Card>
          <Card
            containerStyle={{
              width: '30%',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <Title>
                  Balance: $ {Number(balance).toLocaleString()}
                </Title>
              </div>
              <FontAwesomeIcon
                icon={faPlusCircle}
                className='balance-icon'
                color="#0D658B"
                size="2x"
                onClick={() =>
                  navigate(
                    `importBalance?profile=${JSON.stringify(selectedProfile)}`
                  )
                }
              />
              <FontAwesomeIcon
                icon={faEye}
                className='balance-icon'
                color="#0D658B"
                size="2x"
                onClick={() =>
                  navigate(
                    `viewBalance?profile=${JSON.stringify(selectedProfile)}`
                  )
                }
              />
            </div>
          </Card>
        </div>
        <div className="home-card-container">
          <Card>
            {cuit?.token && cuit?.tokenExpires && new Date(cuit?.tokenExpires) >= new Date() && 
            <div className="home-card-title-container">
              <Title>Facturas</Title>
              <div className="home-card-title-options">
                <Button
                  onClick={() =>
                    navigate(
                      `/importInvoices?profile=${JSON.stringify(selectedProfile)}`
                    )
                  }
                >
                  CREAR MASIVAMENTE
                </Button>
                <Button
                  onClick={() => {
                    navigate(
                      `/newInvoice`
                    );
                  }}
                >
                  NUEVA FACTURA
                </Button>
              </div>
            </div>}
            <div style={{ marginTop: 10 }}>
              <Input
                placeholder="Busca entre las facturas"
                onChange={(event) => setFinder(event.target.value)}
              />
            </div>
            <Table
              loading={loadingInvoices}
              headers={[
                { accessor: 'number', title: 'N°', width: '5%' },
                { accessor: 'date', title: 'FECHA', width: '10%' },
                // { accessor: 'fullname', title: 'EMISOR', width: '20%' },
                {
                  accessor: 'destinatary',
                  title: 'DESTINATARIO',
                  width: '20%',
                },
                {
                  accessor: 'description',
                  title: 'DESCRIPCION',
  
                  width: '30%',
                },
                { accessor: 'invoiceType', title: 'TIPO', width: '20%' },
                {
                  accessor: 'status',
                  title: 'ESTADO',
                  width: '10%',
                },
                {
                  accessor: 'visite',
                  width: 10,
                  title: '',
                },
              ]}
              values={invoicesVisibles.map((invoice) => {
                const invoiceNumber = invoice._id;
                return {
                  ...invoice,
                  visite: (
                    <FontAwesomeIcon
                      icon={faEye}
                      color="#0D658B"
                      key={invoiceNumber}
                      onClick={() => {
                        dispatch(setCurrentInvoice({invoiceNumber}))
                        navigate(
                          `/viewInvoice?invoiceNumber=${invoiceNumber}`
                        )
                      }
                      }
                    />
                  ),
                };
              })}
              total={
                cuit.totalInvoices
              }
              page={page}
              totalPages={roundUp(
                cuit.totalInvoices / visiblesInvoices,
                0
              )}
              onChangePage={(selectedPage: number) => onPageChange(selectedPage)
              }
            />
          </Card>
        </div>
        {selectedProfile && (
          <div className="home-delete-user">
            <Button
              style={{
                backgroundColor: 'rgba(255, 0, 0, .70)',
                color: 'white',
                outline: 0,
              }}
              onClick={() => navigate(`/deleteProfile/${selectedProfile.cuit}`)}
            >
              ELIMINAR USUARIO
            </Button>
          </div>
        )}
        </> : 
        <div className='empty-state-container'>
          <div className='empty-state'>
            <FontAwesomeIcon className="navbar-user-icon" icon={faAddressCard}/>
            <h3>No tienes ningun CUIT registrado aún</h3>
            <p>Para comenzar a utilizar el facturador, agrega un usuario</p>
            <button onClick={()=> navigate('/newProfile')}>Agregar Nuevo</button>
          </div>
        </div>
      }

    </div>
  );
};

export default Home;
