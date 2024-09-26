import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MostrarPlayaPageRoutingModule } from './mostrar-playa-routing.module';

import { MostrarPlayaPage } from './mostrar-playa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MostrarPlayaPageRoutingModule
  ],
  declarations: [MostrarPlayaPage]
})
export class MostrarPlayaPageModule {}
