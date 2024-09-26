import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

// Services
import { SaveLocationService } from '../services/save-location.service';
import { MarcadoresService } from '../services/marcadores.service';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-lista-avisos',
	templateUrl: './lista-avisos.page.html',
	styleUrls: ['./lista-avisos.page.scss'],
})
export class ListaAvisosPage {

	playaAsociadaID: string | null = '1'; // Asegúrate de tener el ID de la playa
	playaAsociadaMostrar: string | undefined = '';

	constructor(
		private navCtrl: NavController,
		private databaseService: DatabaseService,
		private route: ActivatedRoute,
	) { }

	public avisos$: Observable<any> = of();

	ionViewWillEnter() {
		this.playaAsociadaID = this.route.snapshot.paramMap.get('id');
		console.log("Playa asociada: ", this.playaAsociadaID);
		this.avisos$ = this.databaseService.getAvisosPresentesByPlayaID(Number(this.playaAsociadaID));
	
		this.databaseService.getPlayaById(Number(this.playaAsociadaID)).subscribe((playa: any[]) => {
			this.playaAsociadaMostrar = playa[0].name;
		});
	
		this.avisos$.subscribe((avisos: any[]) => {
			console.log("Avisos: ", avisos);
		});
	}

	navigateToEditarAviso(id: number): void {
		this.navCtrl.navigateForward(`/editar-aviso/${id}`);
	}

}
