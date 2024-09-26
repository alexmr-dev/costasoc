import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditarAvisoPageRoutingModule } from './editar-aviso-routing.module';
import { EditarAvisoPage } from './editar-aviso.page';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarAvisoPageRoutingModule
  ],
  declarations: [EditarAvisoPage],
  providers: [Camera, File]
})
export class EditarAvisoPageModule {}
