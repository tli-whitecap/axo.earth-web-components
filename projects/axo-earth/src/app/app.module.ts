import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MintButtonComponent } from './mint-button/mint-button.component';
import { createCustomElement } from '@angular/elements';
import { ConnectButtonComponent } from './connect-button/connect-button.component';

@NgModule({
  declarations: [
    MintButtonComponent,
    ConnectButtonComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [MintButtonComponent, ConnectButtonComponent],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    const mintButtonWebComponent = createCustomElement(MintButtonComponent, {injector});
    customElements.define('axo-earth-mint-button', mintButtonWebComponent);

    const connectButtonWebComponent = createCustomElement(ConnectButtonComponent, {injector});
    customElements.define('axo-earth-connect-button', connectButtonWebComponent);
  }

  ngDoBootstrap() {}
 }
