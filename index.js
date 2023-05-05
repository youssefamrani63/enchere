import { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Input, Text, VStack } from '@rainbow-me/design-system';
import { useWallet } from '@gimmixorg/use-wallet';

import SimpleAuction from '../artifacts/contracts/SimpleAuction.sol/SimpleAuction.json';

import Head from 'next/head';
import { useState } from 'react';
import ConnectButton from '../components/ConnectButton';
import Countdown from "/Users/mohamedamrani/Desktop/blockchain/components/CountDown.js";
import BidForm from 'components/BidForm.js';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TransactionMessage from '../components/TransactionMessage';
import WinnerBanner from '../components/WinnerBanner';
import Layout from '../components/Layout';
import { useContract } from '../hooks/useContract';

export default function Home() {
  const [bidAmount, setBidAmount] = useState('');
  const { contract, currentBid, auctionEndTime, isLoading, errorMessage, transactionMessage, winner } = useContract();

  async function submitBid() {
    // ...
  }

  async function endAuction() {
    // ...
  }

  return (
    <Layout>
      <Head>
        <title>NFT Auction</title>
      </Head>
      <main>
        <h1>NFT Auction</h1>
        {winner && <WinnerBanner winner={winner} />}
        <p>
          Current bid: <strong>{currentBid} ETH</strong>
        </p>
        <Countdown auctionEndTime={auctionEndTime} />
        <BidForm bidAmount={bidAmount} setBidAmount={setBidAmount} onSubmit={submitBid} />
        <ConnectButton />
        {isLoading && <LoadingSpinner />}
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {transactionMessage && <TransactionMessage message={transactionMessage} />}
        <button onClick={endAuction}>End Auction</button>
      </main>
    </Layout>
  );
}

export default function Home() {
  const { ethereum } = useWallet();
  const [highestBid, setHighestBid] = useState('0');
  const [minValue, setMinValue] = useState('0');
  const [bidValue, setBidValue] = useState('0');
  const [status, setStatus] = useState('');

  // Fonction pour récupérer les informations sur l'enchère depuis la blockchain
  async function getAuctionData() {
    if (!ethereum) {
      setStatus('Connectez votre wallet');
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const contractAddress = '0xA9bBb60E783c4e5d583Cb43102381156B624eF37'; // Mettez ici l'adresse de votre contrat
const abi = [  ]; // Mettez ici l'ABI de votre contrat

const auctionContract = new ethers.Contract(contractAddress, abi, signer);


    try {
      const [seller, auctionEndTime, minValue, highestBidder, _highestBid] = await Promise.all([
        auctionContract.seller(),
        auctionContract.auctionEndTime(),
        auctionContract.minValue(),
        auctionContract.highestBidder(),
        auctionContract.highestBid(),
      ]);
      setMinValue(minValue.toString());
      setHighestBid(_highestBid.toString());
      setStatus(`Vendeur: ${seller} - Enchère terminera le: ${new Date(auctionEndTime.toNumber() * 1000).toLocaleString()}`);
      if (highestBidder !== ethers.constants.AddressZero) {
        setStatus((prevStatus) => `${prevStatus}\nOffre la plus élevée: ${highestBidder} pour ${ethers.utils.formatEther(_highestBid)} ETH`);
      } else {
        setStatus((prevStatus) => `${prevStatus}\nAucune offre n'a été faite`);
      }
    } catch (err) {
      console.log(err);
      setStatus('Erreur lors de la récupération des données de l\'enchère');
    }
  }

  // Fonction pour faire une offre
  async function makeBid() {
    if (!ethereum) {
      setStatus('Connectez votre wallet');
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const auctionContract = new ethers.Contract(process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS, SimpleAuction.abi, signer);

    try {
      const bidTxn = await auctionContract.bid({ value: ethers.utils.parseEther(bidValue) });
      await bidTxn.wait();
      setStatus(`Votre offre de ${bidValue} ETH a été envoyée`);
      await getAuctionData();
    } catch (err) {
      console.log(err);
      setStatus('Erreur lors de l\'envoi de votre offre');
    }
  }

  // Fonction pour terminer l'enchère et récupérer les fonds
  async function endAuction() {
    if (!ethereum) {
      setStatus('Connectez votre wallet');
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
  
    try {
      const auctionContract = new ethers.Contract(
        contractAddress,
        auctionAbi,
        signer
      );
  
      // Vérifier que l'enchère est terminée
      const auctionEnded = await auctionContract.ended();
      if (auctionEnded) {
        setStatus('L\'enchère est déjà terminée.');
        return;
      }
  
      // Appeler la fonction de terminaison de l'enchère
      const tx = await auctionContract.auctionEnd();
      setStatus('Transaction en cours...');
  
      // Attendre que la transaction soit confirmée
      await tx.wait();
  
      setStatus('L\'enchère est terminée !');
  
      // Mettre à jour les informations d'affichage
      await updateAuction();
    } catch (err) {
      console.error(err);
      setStatus('Erreur lors de la fin de l\'enchère.');
    }
  }
}  