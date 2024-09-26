import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistrarAvisoPageRoutingModule } from './registrar-aviso-routing.module';
import { RegistrarAvisoPage } from './registrar-aviso.page';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarAvisoPageRoutingModule
  ],
  declarations: [RegistrarAvisoPage],
  providers: [Camera, File]
})
export class RegistrarAvisoPageModule {}
