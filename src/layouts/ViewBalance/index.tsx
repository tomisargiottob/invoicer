import './index.css';
import Card from '../../components/Card';
import SecondaryButton from '../../components/SecondaryButton';
import Title from '../../components/Title';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/store';

const ViewBalance = () => {
  const navigate = useNavigate();
  const [balanceDate, setBalanceDate] = useState([]);
  const cuit = useAppSelector((state) => state.cuit)

  const loadBalance = () => {
    const balanceDateCalc: {period: string, value: string}[] = [];
    const dateNow = new Date();
    dateNow.setMonth(dateNow.getMonth() + 1);
    for (let i = 0; i <= 12; i += 1) {
      const period = `${
        dateNow.getMonth() === 0
          ? dateNow.getFullYear() - 1
          : dateNow.getFullYear()
      } - ${(dateNow.getMonth() === 0 ? 12 : dateNow.getMonth())
        .toString()
        .padStart(2, '0')}`;
      dateNow.setMonth(dateNow.getUTCMonth() - 1);
      const values = cuit?.balances.reduce((tot, balance) => {
        if (
          new Date(balance.date).getUTCFullYear() === dateNow.getUTCFullYear() &&
          new Date(balance.date).getUTCMonth() === dateNow.getUTCMonth()
        )
          return tot + +balance.amount;

        return tot;
      }, 0);

      balanceDateCalc.push({
        period,
        value: `$ ${values?.toLocaleString('en')}`,
      });
    }

    setBalanceDate(Object.assign(balanceDateCalc.reverse()));
  };

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <div className="view-balance-card-container">
      <Card>
        <div className="view-balance-card-title">
          <Title>Balance mensual</Title>
        </div>
        <div className="view-balance-card-body">
          <ul className="timeline" id="timeline">
            {balanceDate.map((balance: any, index) => (
              <li key={index} className={index === 12 ? 'li complete' : 'li'}>
                <div className="timestamp">
                  <span className="date">{balance.period}</span>
                </div>
                <div className="status">
                  <span> {balance.value} </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="view-balance-card-footer">
          <SecondaryButton onClick={() => navigate('/')}>
            VOLVER
          </SecondaryButton>
        </div>
      </Card>
    </div>
  );
};

export default ViewBalance;
