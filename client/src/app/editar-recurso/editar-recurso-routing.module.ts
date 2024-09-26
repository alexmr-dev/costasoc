import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarRecursoPage } from './editar-recurso.page';

const routes: Routes = [
  {
    path: '',
    component: EditarRecursoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarRecursoPageRoutingModule {}
