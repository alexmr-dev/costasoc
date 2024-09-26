import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-lista-playas',
	templateUrl: './lista-playas.page.html',
	styleUrls: ['./lista-playas.page.scss'],
})
export class ListaPlayasPage implements OnInit {
    regiones: any[] = [];
    playas: any[] = [];
    selectedRegion: any = 'all';
	searchText: string = '';
    filteredPlayas: any[] = [];

    constructor(
        private databaseService: DatabaseService,
		private authService: AuthService,
        private navCtrl: NavController,
        private route: ActivatedRoute,
		private alertController: AlertController,
    ) { }

    ngOnInit() {
        this.loadRegiones();
    }

    loadRegiones() {
        this.databaseService.getRegiones().subscribe(
            data => {
                this.regiones = data;
                this.loadPlayas();
            },
            error => {
                console.error('Error:', error);
            }
        );
    }

    loadPlayas() {
		let playas$: Observable<any>;
	
		if (this.selectedRegion === 'all') {
			playas$ = this.databaseService.getPlayas();
		} else {
			playas$ = this.databaseService.getPlayasByRegion(this.selectedRegion);
		}
	
		playas$.subscribe(
			data => {
				this.playas = data;
				this.filterPlayas();  // Añade esta línea
			},
			error => {
				console.error('Error:', error);
			}
		);
	}

	getImagenPlayaByID(id: number) {
        return this.databaseService.getImagenPlayaByID(id);
    }

	filterPlayas() {
		if (!this.searchText) {
			this.filteredPlayas = this.playas;
		} else {
			this.filteredPlayas = this.playas.filter(playa =>
				playa.name.toLowerCase().includes(this.searchText.toLowerCase())
			);
		}
	}

	async selectPlaya(playa: any) {
		const alert = await this.alertController.create({
			header: `Seleccionar ${playa.name}`,
			message: `¿Estás seguro de que quieres seleccionar ${playa.name} como tu playa asociada?`,
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel'
				},
				{
					text: 'Confirmar',
					handler: () => {
						let user = { ...this.authService.currentUserValue };  // Hacer una copia de currentUserValue
						user.playa_asociada = playa.ID;  // Modificar la copia
						this.authService.currentUserSubject.next(user);  // Asignar la copia de nuevo a currentUserValue
						console.log('Playa seleccionada:', playa.name);
						this.navCtrl.back();  // Navega hacia atrás
					}
				}
			]
		});
	
		await alert.present();
	}
}