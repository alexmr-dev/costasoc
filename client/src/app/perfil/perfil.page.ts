import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File, Entry, FileEntry } from '@ionic-native/file/ngx';
import { ChangeDetectorRef } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';

@Component({
	selector: 'app-perfil',
	templateUrl: './perfil.page.html',
	styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
	imagen: 						any;
	currentUserValue: 				any;
	currentUserPerfil: 				any;
	ID_playaAsociada:               number = 0;
	playaAsociadaMostrar: 			string = "";

	constructor(
		private databaseService: DatabaseService,
		private authService: AuthService,
		private alertController: AlertController,
		private camera: Camera,
		private file: File,
		private changeDetectorRef: ChangeDetectorRef,
		private toastController: ToastController,
		private navCtrl: NavController
	) { }

	ngOnInit() {
		this.authService.currentUserSubject.subscribe(user => {
			this.currentUserValue = user;
			this.currentUserPerfil = { ...user };
	
			// Comprueba si this.authService.currentUserValue.imagen es un objeto
			if (user.imagen && typeof user.imagen !== 'object') {
				console.log('No lo sacamos de la BBDD');
				this.currentUserPerfil.imagen = user.imagen;
			} else {
				console.log('Lo sacamos de la BBDD');
				this.currentUserPerfil.imagen = this.databaseService.getUserImageUrl(user.email);
			}
			this.cargarTituloPlaya();
		});
	}

	async editImage() {
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



	async editField(field: string) {
		const alert = await this.alertController.create({
			header: `Editar ${field}`,
			inputs: [
				{
					name: field,
					type: 'text',
					placeholder: `Nuevo ${field}`,
					value: this.currentUserPerfil[field] // Establece el valor inicial con el valor actual
				}
			],
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel'
				},
				{
					text: 'Guardar',
					handler: (data) => {
						this.currentUserPerfil[field] = data[field]; // Actualiza currentUserPerfil
					}
				}
			]
		});

		await alert.present();
	}

	async editFieldPlaya() {
		this.navCtrl.navigateForward('/lista-playas');
	}

	cargarTituloPlaya(){
        // TODO hablar de esto en la memoria
        this.ID_playaAsociada = Number(this.authService.currentUserValue.playa_asociada);
		console.log("ID de la playa asociada: ", this.ID_playaAsociada);
        this.databaseService.getPlayaById(this.authService.currentUserValue.playa_asociada).subscribe(playa => {
            this.playaAsociadaMostrar = playa[0].name;
        });
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
			let base64Image = 'data:image/jpeg;base64,' + imageData;
			this.currentUserPerfil.imagen = base64Image;
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
				this.currentUserPerfil.imagen = base64Image;
				console.log('Imagen:', base64Image);
				this.changeDetectorRef.detectChanges();
			}
		};
		reader.readAsDataURL(file);
	}

	async confirmar() {
		console.log('Confirmar cambios en', this.currentUserPerfil);
		const ID = Number(this.currentUserPerfil.id); // Asegúrate de tener el ID del usuario
		const name = this.currentUserPerfil.name || ''; // Asegúrate de tener el nombre del usuario
		const surname = this.currentUserPerfil.surname || ''; // Asegúrate de tener el apellido del usuario
		const email = this.currentUserPerfil.email || ''; // Asegúrate de tener el email del usuario
		const playa_asociada = this.currentUserPerfil.playa_asociada; // Asegúrate de tener el ID de la playa asociada
		const imagen = this.currentUserPerfil.imagen ? this.currentUserPerfil.imagen : undefined; // Asegúrate de tener la imagen del usuario
		
		this.authService.updateUserById(
			ID,
			name, 
			surname, 
			email, 
			playa_asociada,
			imagen
		).subscribe(async (response: any) => {
			console.log(response.message);
		
			// Actualiza los datos del usuario en la memoria
			this.authService.currentUserValue.name = name;
			this.authService.currentUserValue.surname = surname;
			this.authService.currentUserValue.email = email;
			this.authService.currentUserValue.playa_asociada = playa_asociada;
			if (imagen) {
				console.log("Hay imagen nueva");
				this.authService.currentUserValue.imagen = imagen;
			}
		
			// Actualiza el usuario en localStorage
			localStorage.setItem('currentUser', JSON.stringify(this.authService.currentUserValue));
		
			// Crea y muestra el toast
			const toast = await this.toastController.create({
				message: 'Actualización realizada',
				duration: 2000,
				color: 'success'
			});
			toast.present();
		
			// Vuelve a la página anterior
			this.navCtrl.navigateRoot('/home').then(() => {
				// Ajusta este tiempo según sea necesario
			});
		}, error => {
			console.error(error);
		});
	}
}