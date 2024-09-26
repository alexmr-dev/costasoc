import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaRecursosPage } from './lista-recursos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaRecursosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaRecursosPageRoutingModule {}
