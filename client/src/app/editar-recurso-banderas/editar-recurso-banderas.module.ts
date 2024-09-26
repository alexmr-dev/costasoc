import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarRecursoBanderasPageRoutingModule } from './editar-recurso-banderas-routing.module';

import { EditarRecursoBanderasPage } from './editar-recurso-banderas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarRecursoBanderasPageRoutingModule
  ],
  declarations: [EditarRecursoBanderasPage]
})
export class EditarRecursoBanderasPageModule {}
