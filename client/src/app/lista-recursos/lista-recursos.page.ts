import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

// Services
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-lista-recursos',
	templateUrl: './lista-recursos.page.html',
	styleUrls: ['./lista-recursos.page.scss'],
})
export class ListaRecursosPage {
	playaAsociadaID: string | null = '1'; // Asegúrate de tener el ID de la playa
	playaAsociadaMostrar: string | undefined = '';
	filtroEstado: string = 'todos';

	constructor(
		private navCtrl: NavController,
		private databaseService: DatabaseService,
		private route: ActivatedRoute,
	) { }

	public recursos$: Observable<any> = of();

	ionViewWillEnter() {
		this.playaAsociadaID = this.route.snapshot.paramMap.get('id');
		this.cargarRecursos();
	}
	
	cargarRecursos() {
		if (this.filtroEstado === 'todos') {
			this.recursos$ = this.databaseService.getRecursosByPlayaID(Number(this.playaAsociadaID));
		} else if (this.filtroEstado === 'rotos') {
			this.recursos$ = this.databaseService.getRecursosRotosByPlayaID(Number(this.playaAsociadaID));
		} else if (this.filtroEstado === 'robados') {
			// Reemplaza 'getRecursosRobadosByPlayaID' con el nombre del método correspondiente
			this.recursos$ = this.databaseService.getRecursosRobadosByPlayaID(Number(this.playaAsociadaID));
		}
	
		this.recursos$.subscribe((recursos: any[]) => {
			console.log("recursos: ", recursos);
			if (recursos.length > 0) {
				this.databaseService.getPlayaById(recursos[0].Playa_asociada).subscribe((playa: any[]) => {
					this.playaAsociadaMostrar = playa[0].name;
				});
			}
		});
	}
	
	cambiarFiltroEstado(nuevoEstado: string) {
		this.filtroEstado = nuevoEstado;
		this.cargarRecursos();
	}

	navigateToEditarRecurso(id: number): void {
		this.navCtrl.navigateForward(`/editar-recurso/${id}`);
	}

}
