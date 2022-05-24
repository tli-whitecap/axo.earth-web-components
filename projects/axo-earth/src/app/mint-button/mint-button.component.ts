import { Component, Input, OnInit } from '@angular/core';
import DropKit from 'dropkit.js'
import { Wallet } from '../model/wallet';

@Component({
  selector: 'app-mint-button',
  templateUrl: './mint-button.component.html',
  styleUrls: ['./mint-button.component.css']
})
export class MintButtonComponent implements OnInit {
  @Input()
  set account(a: string)
  {
    this.getWalletFromSession();
    this.getDrop();
  }

  @Input()
  set balance(b: string)
  {
    this.getWalletFromSession();
    this.getDrop();
  }

  wallet?: Wallet;
  amount: number;
  minAmount: number;
  maxAmount: number;
  price: number;
  apiKey: string;
  drop: DropKit | null | undefined;
  isDev: boolean;

  get total(): number {
    return this.amount * this.price;
  }

  constructor() {
    this.minAmount = 1;
    this.maxAmount = 5;
    this.price = 0.04;
    this.apiKey = "6acf2d68-29b3-47f0-a8a1-e3ff255fb9d9";
    //this.apiKey = "44534190-5d15-4b49-8a88-1494d73cbedb";
    this.isDev = true;

    this.amount = this.minAmount;

    this.getWalletFromSession();
  }

  ngOnInit(): void {
  }

  async getDrop() {
      try {
        this.drop = await DropKit.create(this.apiKey);
      }
      catch(e) {
        alert('Ooops. Something went wrong')
        console.error(e)
      }
  }

  getWalletFromSession() 
  {
    let walletStr = sessionStorage.getItem("wallet");

    if (walletStr) {
      this.wallet = JSON.parse(walletStr) as Wallet;
    }

  }

  decrementAmount()
  {
    if (this.amount > this.minAmount)
    {
      this.amount--;
    }
  }

  incrementAmount()
  {
    if (this.amount < this.maxAmount)
    {
      this.amount++;
    }
  }

  async mint() {
    this.getWalletFromSession();
    if (this.wallet && this.wallet.account && this.wallet.balance && !isNaN(Number(this.wallet.balance))) {
      if (Number(this.wallet.balance) < this.total) {
        alert('You do not have sufficient funds.')
        return;
      }

      try {
        await this.getDrop();
        if (this.drop && this.drop.address)
        {
          alert('Transaction successful!')
        }
      }
      catch(e) {
        alert('Ooops. Something went wrong')
        console.error(e)
      }
    }
    else {
      alert('Please connect wallet');
    }
  }

}
