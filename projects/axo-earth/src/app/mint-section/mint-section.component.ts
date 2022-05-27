import { Component, Input, OnInit } from '@angular/core';
import DropKit from 'dropkit.js'
import { Wallet } from '../model/wallet';

import type * as bs from 'bootstrap';
declare var bootstrap: typeof bs;

@Component({
  selector: 'app-mint-section',
  templateUrl: './mint-section.component.html',
  styleUrls: ['./mint-section.component.css']
})
export class MintSectionComponent implements OnInit {
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
  alertMessage: string;

  get total(): number {
    return this.amount * this.price;
  }

  constructor() {
    this.minAmount = 1;
    this.maxAmount = 5;
    this.price = 0.04;
    this.apiKey = "2d45111f-dc63-4f76-a612-e157c62cd924";
    this.isDev = true;

    this.amount = this.minAmount;

    this.getWalletFromSession();

    this.alertMessage = "";
  }

  ngOnInit(): void {
  }

  async getDrop() {
      try {
        this.drop = await DropKit.create(this.apiKey);
      }
      catch(e) {
        //this.showAlertModal("Ooops. Something went wrong");
        console.error(e);
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
        this.showAlertModal("You do not have sufficient funds.");
        return;
      }

      try {
        await this.getDrop();
        if (this.drop && this.drop.address)
        {
          this.showAlertModal("Transaction successful!");
        }
      }
      catch(e) {
        //alert('Ooops. Something went wrong');
        this.showAlertModal("Ooops. Something went wrong");
        console.error(e);
      }
    }
    else {
      this.showAlertModal("Please connect wallet");
    }
  }

  showAlertModal(alertMessage: string)
  {
    this.alertMessage = alertMessage;
    const elem = document.getElementById('alertModal');
    if (elem)
    {
      var alertModal = new bootstrap.Modal(elem);
      alertModal.show();
    }
  }
}
