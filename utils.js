import { ethers } from 'ethers';

export const formatEther = (amount) => {
  return ethers.utils.formatEther(amount);
};

export const parseEther = (amount) => {
  return ethers.utils.parseEther(amount);
};
