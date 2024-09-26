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
	selector: 'app-editar-recurso',
	templateUrl: './editar-recurso.page.html',
	styleUrls: ['./editar-recurso.page.scss'],
})
export class EditarRecursoPage implements OnInit {
	recursoID: string | null = '1'; // Asegúrate de tener el ID del recurso
	imagenRecurso: any;
	estadoRecurso: string | undefined;
	comentarioMostrar: string | undefined;
	hora: number | undefined;
	lat_BBDD: number = 0;
	lng_BBDD: number = 0;
	coordinates: L.LatLng | null = null;

	nombreMostrar: string | undefined;
	playaAsociadaMostrar: string | undefined;
	usuarioLastUpdateMostrar: string | undefined;
	horaMostrar: string | undefined;
	fechaMostrar: string | undefined;
	ID_usuarioLastUpdate: number | undefined;

	mapR!: L.Map;
	constructor(
		private locationService: SaveLocationService,
		private navCtrl: NavController,
		private alertController: AlertController,
		private marcadoresService: MarcadoresService,
		private databaseService: DatabaseService,
		private route: ActivatedRoute,
		private camera: Camera,
		private file: File,
		private changeDetectorRef: ChangeDetectorRef,
		private toastController: ToastController
	) { }


	ngOnInit() {
		this.recursoID = this.route.snapshot.paramMap.get('id');

		this.databaseService.getRecursosById(Number(this.recursoID)).subscribe(recurso => {
			console.log("Recurso: ", recurso);
			this.estadoRecurso = recurso.Estado;
			this.comentarioMostrar = recurso.Comentario;
			this.imagenRecurso = this.databaseService.getImagenRecurso(Number(this.recursoID));
			this.nombreMostrar = recurso.nombre_recurso;
			this.horaMostrar = recurso.HoraLastUpdate;

			if (recurso.Coords_lat !== undefined && recurso.Coords_lng !== undefined) {
				this.lat_BBDD = recurso.Coords_lat;
				this.lng_BBDD = recurso.Coords_lng;
				this.coordinates = new L.LatLng(this.lat_BBDD, this.lng_BBDD);
				if (this.coordinates) {
					try {
						if (this.mapR) {
							this.mapR.remove();
						}

						this.mapR = L.map('mapRecurso', {
							zoomControl: false,
							dragging: false
						}).setView([this.coordinates.lat, this.coordinates.lng], 18);
						L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
							maxZoom: 18,
							minZoom: 18,
							attribution: '© OpenStreetMap'
						}).addTo(this.mapR);

						// Añadir un marcador al mapa en las coordenadas
						L.marker([this.coordinates.lat, this.coordinates.lng], { icon: showIcon }).addTo(this.mapR);

						// Añadir un breve retraso antes de invalidar el tamaño
						setTimeout(() => {
							this.mapR.invalidateSize();
						}, 100);

					} catch (error) {
						console.log('Error getting location', error);
					}
				} else {
					console.log("No hay coordenadas");
				}
			}


			this.databaseService.getUserById(recurso.UsuarioLastUpdate).subscribe(usuario => {
				this.ID_usuarioLastUpdate = usuario[0].id;
				this.usuarioLastUpdateMostrar = usuario[0].name;
			});

			// Formatear la fecha
			const fecha = new Date(recurso.FechaLastUpdate);
			this.fechaMostrar = fecha.toLocaleDateString('es-ES');

			this.databaseService.getPlayaById(recurso.Playa_asociada).subscribe(playa => {
				this.playaAsociadaMostrar = playa[0].name;
			});
		});

		const showIcon = L.icon({
			iconUrl: this.databaseService.getIconoRecurso(Number(this.recursoID)), // Reemplaza esto con la ruta a tu icono
			iconSize: [50, 50], // Tamaño del icono
		});

		//this.coordinates = this.locationService.getCoordinates();

	}

	async confirmar() {
		if (!this.estadoRecurso) {
			console.log('Por favor, selecciona un estado antes de confirmar.');
			return;
		}
		const ID = Number(this.recursoID);
		const Estado = this.estadoRecurso || '';
		const Comentario = this.comentarioMostrar || '';
		const UsuarioLastUpdate = this.ID_usuarioLastUpdate || 0;
		const ImagenShow = this.imagenRecurso ? this.imagenRecurso : undefined;

		this.databaseService.updateRecursoById(
			ID,
			Estado,
			Comentario,
			UsuarioLastUpdate,
			ImagenShow
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

	async subirImagen() {
		const alert = await this.alertController.create({
			header: 'Editar imagen',
			buttons: [
				{
					text: 'Subir desde galería',
					handler: () => {
						console.log('Subir desde galería');
						// Aquí puedes manejar la apertura de la cámara
						this.openGallery();
					}
				},
				{
					text: 'Abrir cámara',
					handler: () => {
						console.log('Abrir cámara');
						this.openCamera();
					}
				}
			]
		});

		await alert.present();
	}

	openCamera() {
		const options: CameraOptions = {
			quality: 50,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true  // Añade esta línea
		}

		this.camera.getPicture(options).then((imageData) => {
			this.file.resolveLocalFilesystemUrl(imageData)
				.then((entry: Entry) => {
					const fileEntry = entry as FileEntry;
					fileEntry.file(file => this.readFile(file));
				})
				.catch(err => {
					// Handle error
				});
		}, (err) => {
			// Handle error
		});
	}

	async openGallery() {
		const options: CameraOptions = {
			quality: 50,
			destinationType: this.camera.DestinationType.DATA_URL,
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, // Cambiar a PHOTOLIBRARY
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true
		}

		this.camera.getPicture(options).then((imageData) => {

			console.log('Imagen:', imageData);

			let base64Image = 'data:image/jpeg;base64,' + imageData;
			console.log('Imagen base 64:', base64Image);
			this.imagenRecurso = base64Image;
			this.changeDetectorRef.detectChanges();
		}, (err) => {
			// Handle error
		});
	}

	readFile(file: any) {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (reader.result) {
				const base64Image = reader.result;
				this.imagenRecurso = base64Image;
				console.log('Imagen:', base64Image);
				this.changeDetectorRef.detectChanges();
			}
		};
		reader.readAsDataURL(file);
	}

}
