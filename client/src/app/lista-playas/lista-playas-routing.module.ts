import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaPlayasPage } from './lista-playas.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPlayasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaPlayasPageRoutingModule {}
