import React, { useState, useEffect, useCallback } from 'react';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';
import CompoundForm from './components/CompoundForm';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import { dbank_backend } from 'declarations/dbank_backend';

function App() {
  const [isLoading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  const updateBalance = useCallback(async () => {
    setLoading(true);
    try {
      const balance = await dbank_backend.getBalance();
      setBalance(balance.toFixed(2));
    } catch (error) {
      console.error('Error while getting balance:', error);
      toast.error("Error while getting balance.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateBalance();
  }, []);

  return (
    <div className="container">
      {isLoading ? (
        <>
          <Typography variant="h5" style={{ marginBottom: '2rem', color: "white" }}>
            Transaction is in process...
          </Typography>
          <CircularProgress />
        </>
      ) : (
        <>
          <img src="dbank_logo.png" alt="DBank logo" width="100" />
          <h1>Current Balance: ${balance}</h1>
          <div className="divider"></div>
          <div className="form-container">
            <DepositForm
              setLoading={setLoading}
              updateBalance={updateBalance}
            />
            <WithdrawForm
              setLoading={setLoading}
              updateBalance={updateBalance}
            />
          </div>
          <CompoundForm
            setLoading={setLoading}
            updateBalance={updateBalance}
          />
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;