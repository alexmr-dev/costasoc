import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostrarPlayaPage } from './mostrar-playa.page';

const routes: Routes = [
  {
    path: '',
    component: MostrarPlayaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MostrarPlayaPageRoutingModule {}
