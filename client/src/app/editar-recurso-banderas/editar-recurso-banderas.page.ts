import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
// Services
import { SaveLocationService } from '../services/save-location.service';
import { MarcadoresService } from '../services/marcadores.service';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute } from '@angular/router';
// Leaflet
import * as L from 'leaflet';

// Camara
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File, Entry, FileEntry } from '@ionic-native/file/ngx';
import { ChangeDetectorRef } from '@angular/core';
@Component({
	selector: 'app-editar-recurso-banderas',
	templateUrl: './editar-recurso-banderas.page.html',
	styleUrls: ['./editar-recurso-banderas.page.scss'],
})
export class EditarRecursoBanderasPage implements OnInit {
	recursoBanderaID: 			string | null = '1'; // Asegúrate de tener el ID del recurso
	estadoBandera: 				string = 'Selecciona una bandera';	
	comentarioMostrar: 			string | undefined;
	hora: 						number | undefined;
	lat_BBDD: 					number = 0;
	lng_BBDD: 					number = 0;
	coordinates: 				L.LatLng | null = null;

	nombreMostrar: 				string | undefined;
	playaAsociadaMostrar: 		string | undefined;
	usuarioLastUpdateMostrar: 	string | undefined;
	horaMostrar: 				string | undefined;
	fechaMostrar: 				string | undefined;
	ID_usuarioLastUpdate: 		number | undefined;

	mapR!: L.Map;

	// Iconos personalizados
	selectedIcon: any;
	greenFlagIcon: any;
	yellowFlagIcon: any;
	redFlagIcon: any;

		// El tipo de aviso que se seleccionará, sale del ENUM de la BBDD

	constructor(
		private locationService: SaveLocationService,
		private navCtrl: NavController,
		private alertController: AlertController,
		private marcadoresService: MarcadoresService,
		private databaseService: DatabaseService,
		private route: ActivatedRoute,
		private changeDetectorRef: ChangeDetectorRef,
		private toastController: ToastController
	) { }

	ngOnInit() {

		// Cargar iconos
		this.greenFlagIcon = L.icon({
			iconUrl: 'assets/icons/bandera_verde.png', // Reemplaza esto con la ruta a tu icono
			iconSize: [50, 50], // Tamaño del icono
		});

		this.yellowFlagIcon = L.icon({
			iconUrl: 'assets/icons/bandera_amarilla.png',
			iconSize: [50, 50],
		});

		this.redFlagIcon = L.icon({
			iconUrl: 'assets/icons/bandera_roja.png',
			iconSize: [50, 50],
		});

		this.recursoBanderaID = this.route.snapshot.paramMap.get('id');

		this.databaseService.getRecursosBanderaById(Number(this.recursoBanderaID)).subscribe(recursoBandera => {
			console.log("Recurso: ", recursoBandera);
			this.estadoBandera = recursoBandera.Estado;
			this.comentarioMostrar = recursoBandera.Comentario;
			this.nombreMostrar = recursoBandera.nombre_recurso;
			this.horaMostrar = recursoBandera.HoraLastUpdate;

			this.coordinates = this.locationService.getCoordinates();
			console.log('Coordenadas:', this.coordinates);
			if (this.coordinates) {
				this.updateMap();
			}

			this.databaseService.getUserById(recursoBandera.UsuarioLastUpdate).subscribe(usuario => {
				this.ID_usuarioLastUpdate = usuario[0].id;
				this.usuarioLastUpdateMostrar = usuario[0].name;
			});

			// Formatear la fecha
			const fecha = new Date(recursoBandera.FechaLastUpdate);
			this.fechaMostrar = fecha.toLocaleDateString('es-ES');

			this.databaseService.getPlayaById(recursoBandera.Playa_asociada).subscribe(playa => {
				this.playaAsociadaMostrar = playa[0].name;
			});
		});
	}
/*
let infoIcon = L.icon({
                iconUrl: this.databaseService.getIconoRecursoBandera(recursoBandera.ID) + '?t=' + Date.now(), // Añade un parámetro de consulta que cambia cada vez
                iconSize: [50, 50], // Tamaño del icono
            }); */
	updateMap() {
		try {
			if (this.mapR) {
				this.mapR.remove();
			}
			if (this.coordinates) {
				this.mapR = L.map('mapRecurso', {
					zoomControl: false,
					dragging: false
				}).setView([this.coordinates.lat, this.coordinates.lng], 18);
				L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 18,
					minZoom: 18,
					attribution: '© OpenStreetMap'
				}).addTo(this.mapR);

				switch (this.estadoBandera) {
					case 'Verde':
						this.selectedIcon = this.greenFlagIcon;
						break;
					case 'Amarilla':
						this.selectedIcon = this.yellowFlagIcon;
						break;
					case 'Roja':
						this.selectedIcon = this.redFlagIcon;
						break;
					default:
						//this.selectedIcon = this.databaseService.getIconoRecursoBandera(Number(this.recursoBanderaID)) + '?t=' + Date.now(); // Añade un parámetro de consulta que cambia cada vez; // Icono por defecto
						this.selectedIcon = L.icon({
							iconUrl: this.databaseService.getIconoRecursoBandera(Number(this.recursoBanderaID)) + '?t=' + Date.now(), // Añade un parámetro de consulta que cambia cada vez
							iconSize: [50, 50], // Tamaño del icono
						});
				}

				// Añadir un marcador al mapa en las coordenadas
				L.marker([this.coordinates.lat, this.coordinates.lng], { icon: this.selectedIcon }).addTo(this.mapR);

				// Añadir un breve retraso antes de invalidar el tamaño
				setTimeout(() => {
					this.mapR.invalidateSize();
				}, 100);
			}


		} catch (error) {
			console.log('Error getting location', error);
		}
	}

	onEstadoBanderaChange(){
		this.updateMap();
	}

	async confirmar() {
		if (!this.estadoBandera) {
			console.log('Por favor, selecciona un estado antes de confirmar.');
			return;
		}
		const ID = Number(this.recursoBanderaID);
		const Estado = this.estadoBandera || '';
		const Comentario = this.comentarioMostrar || '';
		const UsuarioLastUpdate = this.ID_usuarioLastUpdate || 0;
		const Icono = this.selectedIcon.options.iconUrl
		this.databaseService.updateRecursoBanderaById(
			ID,
			Estado,
			Comentario,
			UsuarioLastUpdate,
			Icono
		).subscribe(async (response) => { // Marca esta función como async
			console.log(response.message);
			const toast = await this.toastController.create({
				message: 'Actualización realizada',
				duration: 2000,
				color: 'success'
			});
			toast.present();
			// Vuelve a la página anterior
			this.navCtrl.back();
		}, error => {
			console.error(error);
		});
	}

	cancelar() {
		this.navCtrl.back();
	}

}
