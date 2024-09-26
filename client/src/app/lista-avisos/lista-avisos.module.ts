import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaAvisosPageRoutingModule } from './lista-avisos-routing.module';

import { ListaAvisosPage } from './lista-avisos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaAvisosPageRoutingModule
  ],
  declarations: [ListaAvisosPage]
})
export class ListaAvisosPageModule {}
