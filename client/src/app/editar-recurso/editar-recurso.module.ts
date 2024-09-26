import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditarRecursoPageRoutingModule } from './editar-recurso-routing.module';
import { EditarRecursoPage } from './editar-recurso.page';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarRecursoPageRoutingModule
  ],
  declarations: [EditarRecursoPage],
  providers: [Camera, File]
})
export class EditarRecursoPageModule {}
