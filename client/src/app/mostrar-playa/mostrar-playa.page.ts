import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-mostrar-playa',
	templateUrl: './mostrar-playa.page.html',
	styleUrls: ['./mostrar-playa.page.scss'],
})
export class MostrarPlayaPage implements OnInit {

	ID_playaAsociadaMostrar: string | null = '';
	nombrePlayaAsociadaMostrar: string | undefined;
	imagenPlayaAsociadaMostrar: any;
	avisosPlayaAsociadaMostrar: any;
	recursosRotosPlayaAsociadaMostrar: any;
	recursosRobadosPlayaAsociadaMostrar: any;
	usuariosPlayaAsociadaMostrar: any;

	constructor(
		private databaseService: DatabaseService,
		private navCtrl: NavController,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.ID_playaAsociadaMostrar = this.route.snapshot.paramMap.get('id');

		this.databaseService.getPlayaById(Number(this.ID_playaAsociadaMostrar)).subscribe(playa => {
			console.log("Playa: ", playa);
			this.nombrePlayaAsociadaMostrar = playa[0].name;
			this.imagenPlayaAsociadaMostrar = this.databaseService.getImagenPlayaByID(Number(this.ID_playaAsociadaMostrar));

			this.databaseService.getRecursosRotosByPlayaID(Number(1)).subscribe(recursosRotos => {
				this.recursosRotosPlayaAsociadaMostrar = recursosRotos.length;
				console.log('Recursos Rotos:', this.recursosRotosPlayaAsociadaMostrar);
			});

			this.databaseService.getRecursosRobadosByPlayaID(Number(this.ID_playaAsociadaMostrar)).subscribe(recursosRobados => {
				this.recursosRobadosPlayaAsociadaMostrar = recursosRobados.length;
				console.log('Recursos Robados:', this.recursosRobadosPlayaAsociadaMostrar);
			});

			this.databaseService.getAvisosPresentesByPlayaID(Number(this.ID_playaAsociadaMostrar)).subscribe(avisos => {
				this.avisosPlayaAsociadaMostrar = avisos.length;
				console.log('Avisos:', this.avisosPlayaAsociadaMostrar);
			});

			this.databaseService.getOnlineUsersByPlayaID(Number(this.ID_playaAsociadaMostrar)).subscribe(usuarios => {
				this.usuariosPlayaAsociadaMostrar = usuarios[0]['COUNT(*)'];
				console.log('Usuarios:', this.usuariosPlayaAsociadaMostrar);
			});
		});
	}

	navigateToListaAvisos(): void {
		this.navCtrl.navigateForward(`/lista-avisos/${this.ID_playaAsociadaMostrar}`);
	}

	navigateToListaRecursos(): void {
		this.navCtrl.navigateForward(`/lista-recursos/${this.ID_playaAsociadaMostrar}`);
	}

	navigateToListaSocorristas(): void {
		this.navCtrl.navigateForward(`/lista-socorristas/${this.ID_playaAsociadaMostrar}`);
	}

}
