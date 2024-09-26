import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarAvisoPage } from './registrar-aviso.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarAvisoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarAvisoPageRoutingModule {}
