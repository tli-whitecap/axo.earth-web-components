import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  
  @Output() onMinted = new EventEmitter();

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
    this.price = 0.001;
    this.apiKey = "9bd57a2d-2eda-404a-b368-b88a8cc3c1e6";
    //this.apiKey = "2d45111f-dc63-4f76-a612-e157c62cd924";
    //this.apiKey = "44534190-5d15-4b49-8a88-1494d73cbedb";
    this.isDev = false;

    this.amount = this.minAmount;

    this.getWalletFromSession();

    if (this.wallet)
    {
      this.getDrop();
    }

    this.alertMessage = "";
  }

  ngOnInit(): void {
  }

  async getDrop() {
      try {
        this.drop = await DropKit.create(this.apiKey);
        if (this.drop)
        {
          this.drop.onMinted((...args) => {
            this.showAlertModal("Transaction successful!");

            if (this.wallet && this.wallet.account && this.wallet.balance && !isNaN(Number(this.wallet.balance))) {
              this.wallet.balance = (Number(this.wallet?.balance) - this.total).toString();
            }
            sessionStorage.setItem("wallet", JSON.stringify(this.wallet));

            console.log(
                `[onMinted] TokenId: ${args[2]}, From ${args[0]}, To ${args[1]}`
            );

            this.onMinted.emit(args[2]);
          });
        }
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
          await this.drop.mint(this.amount);
        }
      }
      catch(e: any) {
        if (typeof e === "string") {
          this.showAlertModal(e);
        }
        else if (typeof e.message === "string") {
          this.showAlertModal(e.message);
        }
        else
        {
          this.showAlertModal("Ooops. Something went wrong");
        }

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
