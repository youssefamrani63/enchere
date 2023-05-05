import { Button } from 'antd';
import { useEthers } from '../hooks/useEthers';

const ConnectButton = () => {
  const { account, connect } = useEthers();

  return (
    <Button onClick={connect}>
      {account ? `Connecté : ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Se connecter'}
    </Button>
  );
};

export default ConnectButton;
