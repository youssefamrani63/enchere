import { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Form, Input, InputNumber, notification } from 'antd';

import { useContract } from '../hooks/useContract';
import { useEthers } from '../hooks/useEthers';

const BidForm = ({ auctionEndTime, highestBid }) => {
  const { account, ethereum } = useEthers();
  const { contract, isLoading } = useContract();
  const [value, setValue] = useState('');
  const [form] = Form.useForm();

  const onFinish = async values => {
    const { bidValue } = values;

    try {
      const parsedValue = ethers.utils.parseEther(bidValue.toString());
      const transaction = await contract.bid({ value: parsedValue });
      await transaction.wait();

      form.resetFields();
      notification.success({ message: 'Offre soumise avec succès' });
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Erreur lors de la soumission de l\'offre' });
    }
  };

  const validateBid = (_, value) => {
    if (value && ethers.utils.parseEther(value.toString()).lte(highestBid)) {
      return Promise.reject('Le montant doit être supérieur à l\'enchère actuelle');
    }

    if (value && !ethers.utils.parseEther(value.toString()).lte(ethers.utils.parseEther('10'))) {
      return Promise.reject('Le montant maximum est de 10 ETH');
    }

    return Promise.resolve();
  };

  const validateConnect = () => {
    if (!ethereum || !account) {
      notification.warning({ message: 'Connectez votre wallet' });
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="bidValue"
        label="Montant de l'offre"
        rules={[
          { required: true, message: 'Veuillez entrer le montant de l\'offre' },
          { validator: validateBid },
        ]}
      >
        <InputNumber
          disabled={isLoading || !ethereum || !account || Date.now() >= auctionEndTime}
          step="0.01"
          placeholder="Saisissez votre montant d'offre"
          onChange={setValue}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isLoading || !ethereum || !account || Date.now() >= auctionEndTime || !value}
          onClick={validateConnect}
        >
          Soumettre une offre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BidForm;
