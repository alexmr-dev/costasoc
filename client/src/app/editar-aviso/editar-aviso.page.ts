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
	selector: 'app-editar-aviso',
	templateUrl: './editar-aviso.page.html',
	styleUrls: ['./editar-aviso.page.scss'],
})
export class EditarAvisoPage implements OnInit {
	avisoID: string | null = '1'; // Asegúrate de tener el ID del recurso
	imagenAviso: any;
	estadoRecurso: string | undefined;
	comentarioMostrar: string | undefined;
	hora: number | undefined;
	lat_BBDD: number = 0;
	lng_BBDD: number = 0;
	coordinates: L.LatLng | null = null;
	avisoSolucionado: boolean = false;
	avisoSolucionadoString: string | undefined;

	actualizarBanderas: string = '';

	nombreMostrar: string | undefined;
	playaAsociadaMostrar: string | undefined;
	usuarioLastUpdateMostrar: string | undefined;
	horaMostrar: string | undefined;
	fechaMostrar: string | undefined;
	ID_usuarioLastUpdate: number | undefined;

	mapR!: L.Map;
	constructor(
		private navCtrl: NavController,
		private alertController: AlertController,
		private databaseService: DatabaseService,
		private route: ActivatedRoute,
		private camera: Camera,
		private file: File,
		private changeDetectorRef: ChangeDetectorRef,
		private toastController: ToastController,
		private authService: AuthService
	) { }

	ngOnInit() {
		this.avisoID = this.route.snapshot.paramMap.get('id');

		this.databaseService.getAvisoById(Number(this.avisoID)).subscribe(aviso => {
			console.log("Aviso: ", aviso);
			this.comentarioMostrar = aviso[0].Comentario;
			this.imagenAviso = this.databaseService.getImagenAviso(Number(this.avisoID));
			this.nombreMostrar = aviso[0].tipo_aviso;
			this.horaMostrar = aviso[0].HoraLastUpdate;
			this.lat_BBDD = aviso[0].Coords_lat;
			this.lng_BBDD = aviso[0].Coords_lng;
			this.coordinates = new L.LatLng(this.lat_BBDD, this.lng_BBDD);

			if (this.coordinates) {
				try {
					if(this.mapR){
						this.mapR.remove();
					}
	
					this.mapR = L.map('mapAviso', {
						zoomControl: false,
						dragging: false
					}).setView([this.coordinates.lat, this.coordinates.lng], 18);
					L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
						maxZoom: 18,
						minZoom: 18,
						attribution: '© OpenStreetMap'
					}).addTo(this.mapR);
					
					// Añadir un marcador al mapa en las coordenadas
					L.marker([this.coordinates.lat, this.coordinates.lng], {icon: showIcon}).addTo(this.mapR);
	
					// Añadir un breve retraso antes de invalidar el tamaño
					setTimeout(() => {
						this.mapR.invalidateSize();
					}, 100);
		
				} catch (error) {
					console.log('Error getting location', error);
				}
			}

			this.databaseService.getUserById(aviso[0].UsuarioLastUpdate).subscribe(usuario => {
				this.ID_usuarioLastUpdate = usuario[0].id;
				this.usuarioLastUpdateMostrar = usuario[0].name;
			});

			// Formatear la fecha
			const fecha = new Date(aviso[0].FechaLastUpdate);
			this.fechaMostrar = fecha.toLocaleDateString('es-ES');
	
			this.databaseService.getPlayaById(aviso[0].Playa_asociada).subscribe(playa => {
				this.playaAsociadaMostrar = playa[0].name;
			});
		});

		const showIcon = L.icon({
			iconUrl: this.databaseService.getIconoAvisoByID(Number(this.avisoID)), // Reemplaza esto con la ruta a tu icono
			iconSize: [50, 50], // Tamaño del icono
		});
		
	}

	async confirmar() {
		console.log('Confirmar');
		const ID = Number(this.avisoID);
		const Comentario = this.comentarioMostrar || '';
		const UsuarioLastUpdate = this.ID_usuarioLastUpdate || 0;
		const ImagenShow = this.imagenAviso ? this.imagenAviso : undefined;
		const AvisoSolucionado = this.avisoSolucionado || false;

		if(AvisoSolucionado == true){
        this.avisoSolucionadoString = 'Solucionado';
        // Utilizar el método deleteAvisoById
        this.databaseService.deleteAvisoById(ID).subscribe(async (response) => {
            console.log(response);
            const toast = await this.toastController.create({
                message: 'Aviso eliminado',
                duration: 2000,
                color: 'success'
            });
            toast.present();
        
            // Vuelve a la página anterior
            this.navCtrl.back();
        }, error => {
            console.error(error);
        });
    }else{
        this.avisoSolucionadoString = 'Presente';
        // Utilizar el método updateAvisoById
        this.databaseService.updateAvisoById(
            ID, 
            this.avisoSolucionadoString, 
            Comentario, 
            UsuarioLastUpdate, 
            ImagenShow
        ).subscribe(async (response) => {
            console.log(response);
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

	cancelar(){
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
