import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPlayasPageRoutingModule } from './lista-playas-routing.module';

import { ListaPlayasPage } from './lista-playas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPlayasPageRoutingModule
  ],
  declarations: [ListaPlayasPage]
})
export class ListaPlayasPageModule {}
