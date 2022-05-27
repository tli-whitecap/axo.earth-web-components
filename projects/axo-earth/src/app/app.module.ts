import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MintSectionComponent } from './mint-section/mint-section.component';
import { createCustomElement } from '@angular/elements';
import { ConnectButtonComponent } from './connect-button/connect-button.component';

@NgModule({
  declarations: [
    MintSectionComponent,
    ConnectButtonComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [MintSectionComponent, ConnectButtonComponent],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    const mintSectionWebComponent = createCustomElement(MintSectionComponent, {injector});
    customElements.define('axo-earth-mint-section', mintSectionWebComponent);

    const connectButtonWebComponent = createCustomElement(ConnectButtonComponent, {injector});
    customElements.define('axo-earth-connect-button', connectButtonWebComponent);
  }

  ngDoBootstrap() {}
 }
