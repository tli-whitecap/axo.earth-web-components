import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Wallet } from '../model/wallet';
import {ethers} from 'ethers'
import { Device } from '../model/device';
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { provider } from 'web3-core';

@Component({
  selector: 'app-connect-button',
  templateUrl: './connect-button.component.html',
  styleUrls: ['./connect-button.component.css']
})
export class ConnectButtonComponent implements OnInit {
  @Output() accountChanged = new EventEmitter();
  @Output() balanceChanged = new EventEmitter();

  @Input()
  set onMinted(tokenId:string) {
    this.getAccountInfo();
  }

  wallet?: Wallet;
  web3Modal?: Web3Modal;
  provider?: provider;
  web3js?: Web3;
  isDev: boolean;
  
  constructor() {
    this.isDev = false;
    
    let walletStr = sessionStorage.getItem("wallet");

    if (walletStr) {
      this.wallet = JSON.parse(walletStr) as Wallet;
    }

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "228dfce81d73482fbb2226519c91d96b" // required
        }
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK, // Required
        options: {
          appName: "axo.earth", // Required
          infuraId: "228dfce81d73482fbb2226519c91d96b", // Required
          rpc: "", // Optional if `infuraId` is provided; otherwise it's required
          chainId: 1, // Optional. It defaults to 1 if not provided
          darkMode: false // Optional. Use dark theme, defaults to false
        }
      }
    };
    
    this.web3Modal = new Web3Modal({
      network: this.isDev ? "ropsten" : "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions, // required
    });
  }

  ngOnInit(): void {
  }

  async connect() {
    if (this.web3Modal)
    {
      this.provider = await this.web3Modal.connect(); // set provider
      if (this.provider) {
        this.web3js = new Web3(this.provider);

        this.getAccountInfo();
      }
    }
  }

  async getAccountBalance() {
      if (this.wallet && this.wallet.account && this.web3js)
      {
        const balance = await this.web3js.eth.getBalance(this.wallet.account);
        this.wallet.balance = ethers.utils.formatEther(balance);
        sessionStorage.setItem("wallet", JSON.stringify(this.wallet));

        this.balanceChanged.emit(this.wallet.balance);
      }
  }

  async getAccountInfo() {
    if (this.web3js)
    {
      const accounts = await this.web3js.eth.getAccounts();
      if (accounts && accounts.length > 0)
      {
        if (!this.wallet)
        {
          this.wallet = new Wallet();
        }
  
        this.wallet.account = accounts[0];
        sessionStorage.setItem("wallet", JSON.stringify(this.wallet));

        this.accountChanged.emit(this.wallet.account);

        await this.getAccountBalance();
      }
    }
  }
}
