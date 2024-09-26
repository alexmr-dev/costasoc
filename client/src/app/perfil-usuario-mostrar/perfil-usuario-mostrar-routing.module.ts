import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilUsuarioMostrarPage } from './perfil-usuario-mostrar.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilUsuarioMostrarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilUsuarioMostrarPageRoutingModule {}
