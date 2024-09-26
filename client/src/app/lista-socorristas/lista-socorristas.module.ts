import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaSocorristasPageRoutingModule } from './lista-socorristas-routing.module';

import { ListaSocorristasPage } from './lista-socorristas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaSocorristasPageRoutingModule
  ],
  declarations: [ListaSocorristasPage]
})
export class ListaSocorristasPageModule {}
