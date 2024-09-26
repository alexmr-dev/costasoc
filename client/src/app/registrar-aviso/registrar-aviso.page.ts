import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
// Services
import { SaveLocationService } from '../services/save-location.service';
import { MarcadoresService } from '../services/marcadores.service';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
// Leaflet
import * as L from 'leaflet';

// Camara
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File, Entry, FileEntry } from '@ionic-native/file/ngx';
import { ChangeDetectorRef } from '@angular/core';



@Component({
	selector: 'app-registrar-aviso',
	templateUrl: './registrar-aviso.page.html',
	styleUrls: ['./registrar-aviso.page.scss'],
})
export class RegistrarAvisoPage implements OnInit{
	avisoID: string | null = '1'; 					// Asegúrate de tener el ID del aviso
	imagenAviso: any = 'assets/imgs/no_photo.jpg';	// La imagen del aviso que cogeremos de la cámara. Por defecto pone no photo
	tipoAviso: string = 'Incidencia general';		// El tipo de aviso que se seleccionará, sale del ENUM de la BBDD
													// por defecto es Incidencia general
	comentario: string | undefined;					// El comentario que se añadirá al aviso
	hora: number | undefined;						// La hora en la que se añadirá el aviso
	coordinates: L.LatLng | null = null;			// Las coordenadas del aviso

	actualizarBanderas: string = '';

	// Iconos personalizados
	selectedIcon: any;
	warningIcon: any;
	urgenciaIcon: any;
	ahogamientoIcon: any;
	presenciaMedusasIcon: any;
	presenciaCorrientesFuertesIcon: any;
	lesionPersonaIcon: any;
	objetosPeligrososAguaIcon: any;
	calidadAguaInsuficienteIcon: any;
	quemadurasSolaresGravesIcon: any;
	otroIcon: any;

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
		private toastController: ToastController,
		private authService: AuthService
	) 
	{
	}

	ngOnInit() {
		// Iconos personalizados
		this.warningIcon = L.icon({
			iconUrl: 'assets/icons/warning.png', // Reemplaza esto con la ruta a tu icono
			iconSize: [50, 50], // Tamaño del icono
		});

		this.urgenciaIcon = L.icon({
			iconUrl: 'assets/icons/urgencia.png',
			iconSize: [50, 50],
		});

		this.ahogamientoIcon = L.icon({
			iconUrl: 'assets/icons/ahogamiento.png',
			iconSize: [50, 50],
		});

		this.presenciaMedusasIcon = L.icon({
			iconUrl: 'assets/icons/medusa.png',
			iconSize: [50, 50],
		});

		this.presenciaCorrientesFuertesIcon = L.icon({
			iconUrl: 'assets/icons/corriente_fuerte.png',
			iconSize: [50, 50],
		});

		this.lesionPersonaIcon = L.icon({
			iconUrl: 'assets/icons/aviso_PERSONA.png',
			iconSize: [50, 50],
		});

		this.objetosPeligrososAguaIcon = L.icon({
			iconUrl: 'assets/icons/prohibido_nadar.png',
			iconSize: [50, 50],
		});

		this.calidadAguaInsuficienteIcon = L.icon({
			iconUrl: 'assets/icons/low_quality.png',
			iconSize: [50, 50],
		});

		this.quemadurasSolaresGravesIcon = L.icon({
			iconUrl: 'assets/icons/persona_quemada.png',
			iconSize: [50, 50],
		});

		this.otroIcon = L.icon({
			iconUrl: 'assets/icons/otro.png',
			iconSize: [50, 50],
		});

		this.coordinates = this.locationService.getCoordinates();
		console.log('Coordenadas:', this.coordinates);
		if (this.coordinates) {
			this.updateMap();
		}
	}
	

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

				switch (this.tipoAviso) {
					case 'Incidencia general':
						this.selectedIcon = this.warningIcon;
						break;
					case 'Urgencia':
						this.selectedIcon = this.urgenciaIcon;
						break;
					case 'Ahogamiento':
						this.selectedIcon = this.ahogamientoIcon;
						break;
					case 'Presencia de medusas':
						this.selectedIcon = this.presenciaMedusasIcon;
						break;
					case 'Presencia de corrientes fuertes':
						this.selectedIcon = this.presenciaCorrientesFuertesIcon;
						break;
					case 'Lesión de una persona':
						this.selectedIcon = this.lesionPersonaIcon;
						break;
					case 'Objetos peligrosos en el agua':
						this.selectedIcon = this.objetosPeligrososAguaIcon;
						break;
					case 'Calidad del agua insuficiente':
						this.selectedIcon = this.calidadAguaInsuficienteIcon;
						break;
					case 'Quemaduras solares graves':
						this.selectedIcon = this.quemadurasSolaresGravesIcon;
						break;
					case 'Otro':
						this.selectedIcon = this.otroIcon;
						break;
					default:
						this.selectedIcon = this.warningIcon; // Icono por defecto
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

	onTipoAvisoChange(){
		this.updateMap();
	}

	cancelar() {
		this.navCtrl.back();
	}

	async confirmar() {
		console.log('Vamos a confirmar');
	
		if(this.coordinates){
			if(this.comentario == undefined){
				this.comentario = '';
			}
			let aviso = {
				tipo_aviso: this.tipoAviso, 
				Playa_asociada: this.authService.currentUserValue.playa_asociada, 
				Coords_lat: this.coordinates.lat, 
				Coords_lng: this.coordinates.lng,
				Estado: 'Presente',
				Icono: this.selectedIcon.options.iconUrl, 
				Comentario: this.comentario, 
				UsuarioLastUpdate: this.authService.currentUserValue.id,
				ImagenShow: this.imagenAviso 
			};
			console.log('Aviso a subir:', aviso);
	
			this.databaseService.pushAviso(aviso).subscribe(async (response) => {
				console.log('Respuesta del servidor:', response);
			}, error => {
				if (error.status === 201) {
					console.log('Aviso creado correctamente');
				} else {
					console.error('Error al enviar el aviso:', error);
				}
			}).add(async () => {
				const toast = await this.toastController.create({
					message: 'Actualización realizada',
					duration: 2000,
					color: 'success'
				});
				toast.present();
			
				// Navegar a la página de inicio
				this.navCtrl.back();
			});
	
			// Actualizar banderas según la selección del usuario
			switch (this.actualizarBanderas) {
				case 'permitir-banio':
					console.log("Permitir baño");
					this.databaseService.permitirBanio(this.authService.currentUserValue.playa_asociada, this.authService.currentUserValue.id).subscribe();
					break;
				case 'banio-precaucion':
					console.log("Baño con precaución");
					this.databaseService.banioConPrecaucion(this.authService.currentUserValue.playa_asociada, this.authService.currentUserValue.id).subscribe();
					break;
				case 'banio-prohibido':
					console.log("Prohibir baño");
					this.databaseService.prohibirBanio(this.authService.currentUserValue.playa_asociada, this.authService.currentUserValue.id).subscribe();
					break;
				default:
					// No hacer nada si la opción seleccionada es 'No'
					break;
			}
		}
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
			this.imagenAviso = base64Image;
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
				this.imagenAviso = base64Image;
				console.log('Imagen:', base64Image);
				this.changeDetectorRef.detectChanges();
			}
		};
		reader.readAsDataURL(file);
	}

}
