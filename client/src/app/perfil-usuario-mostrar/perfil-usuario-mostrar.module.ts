import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilUsuarioMostrarPageRoutingModule } from './perfil-usuario-mostrar-routing.module';

import { PerfilUsuarioMostrarPage } from './perfil-usuario-mostrar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilUsuarioMostrarPageRoutingModule
  ],
  declarations: [PerfilUsuarioMostrarPage]
})
export class PerfilUsuarioMostrarPageModule {}
