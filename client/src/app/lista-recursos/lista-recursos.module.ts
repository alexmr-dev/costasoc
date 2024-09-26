import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaRecursosPageRoutingModule } from './lista-recursos-routing.module';

import { ListaRecursosPage } from './lista-recursos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaRecursosPageRoutingModule
  ],
  declarations: [ListaRecursosPage]
})
export class ListaRecursosPageModule {}
