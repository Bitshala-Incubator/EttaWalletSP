import React, { createContext, useState } from 'react';
import BdkRn from 'bdk-rn';
import { PincodeType } from '../src/utils/types';

export const EttaStorageContext = createContext();

export const EttaStorageProvider = ({ children }) => {
  const [mnemonic, setMnemonic] = useState('');
  const [wallet, setWallet] = useState('');
  const [path, setPath] = useState("m/84'/0'/0'");
  const [pinType, setPinType] = useState(PincodeType.Unset);

  const getMnemonic = async () => {
    const { data } = await BdkRn.generateMnemonic({
      network: 'testnet',
      length: 12,
    });
    console.log(data);
    setMnemonic(data); // update mnemonic in state
    // @todo: encrypt and save the mnemonic to device
  };

  const createWallet = async () => {
    const { data } = await BdkRn.createWallet({
      mnemonic: mnemonic,
      network: 'mainnet',
    });
    setWallet(data);
  };

  return (
    <EttaStorageContext.Provider
      value={{ mnemonic, wallet, path, getMnemonic, createWallet, pinType }}
    >
      {children}
    </EttaStorageContext.Provider>
  );
};