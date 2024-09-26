import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarRecursoBanderasPage } from './editar-recurso-banderas.page';

const routes: Routes = [
  {
    path: '',
    component: EditarRecursoBanderasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarRecursoBanderasPageRoutingModule {}
