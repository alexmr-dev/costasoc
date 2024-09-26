import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

// Services
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-lista-socorristas',
	templateUrl: './lista-socorristas.page.html',
	styleUrls: ['./lista-socorristas.page.scss'],
})
export class ListaSocorristasPage {
	playaAsociadaID: string | null = '1'; // Asegúrate de tener el ID de la playa
	playaAsociadaMostrar: string | undefined = '';
	filtroEstado: string = 'todos';

	constructor(
		private navCtrl: NavController,
		private databaseService: DatabaseService,
		private route: ActivatedRoute,
	) { }

	public socorristas$: Observable<any> = of();

	ngOnInit() {
	}

}
