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
import { CuitAccount, setActiveCuitAccount, setCuitBalances, setCuitInvoices, setCurrentInvoice, unsetCuitAccount } from '../../store/CuitSlice';
import { getInvoices } from '../../requests/invoiceRequests';
import IBalance from '../../class/Profile/interface/IBalance';
import { getBalances } from '../../requests/balanceRequests';
import { format } from 'date-fns';
import useWindowDimensions from '../../utils/useWindowDimensions';
import { headers } from './utils';


const Home = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<CuitAccount | undefined>();
  const [balance, setBalance] = useState(0);
  const [page, setPage] = useState(1);
  const [finder, setFinder] = useState('');
  const [loading, setLoading] = useState(false)
  const [loadingInvoices, setLoadingInvoices] = useState(false)
  const [balanceFetched, setBalanceFetched] = useState(false)
  const [userAuthenticated, setUserAuthenticated] = useState(false)
  const [tableTitles, setTableTitles] = useState(headers)
  const { height, width } = useWindowDimensions();

  const user = useAppSelector((state) => state.user)
  const cuit = useAppSelector((state) => state.cuit)

  const dispatch = useDispatch()

  useEffect(() => {
    if(width < 800) {
      const mobileTitles = headers.filter((header) => !['description','invoiceType','status'].includes(header.accessor))
      setTableTitles(mobileTitles)
    } else {
      setTableTitles(headers)
    }
  },[width])

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
      if(selectedProfile && Object.keys(selectedProfile).length && (!selectedProfile.token || new Date(cuit?.tokenExpires) <= new Date()) && !userAuthenticated) {
        setUserAuthenticated(true)
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
      setUserAuthenticated(false)
      setBalanceFetched(false)
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
      if(selectedProfile?.id && cuit.id && !balanceFetched) {
        setBalanceFetched(true)
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
      const parsedDate = new Date(invoice.date)
      return {
        ...invoice,
        fullname: cuit.fullname,
        date: format(
          new Date(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate()),
          'dd/MM/yyyy',
        ).toString(),
        status: <StatusLabel status={invoice.status} />,
        invoiceType: InvoiceTypeMessage(invoice.invoiceType),
      };
    });
  return (
    <div className="container">
      <Navbar
        selectedProfile={selectedProfile}
        onSelectedProfile={(profile) => {
          setSelectedProfile(undefined)
          setUserAuthenticated(false)
          setBalanceFetched(false)
          dispatch(unsetCuitAccount())
          setSelectedProfile(profile)
          dispatch(setActiveCuitAccount({cuit: profile}))
        }}
        paymentRequired={user.paymentRequired}
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
              className='status-card'
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
              className='status-card'
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
                className='balance-icon import-balance-icon'
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
                  className="masive-invoice-button"
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
              headers={tableTitles}
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
