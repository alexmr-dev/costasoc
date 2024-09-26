import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { DatabaseService } from './services/database.service';
@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	public appPages: { title: string, url: string, icon: string }[] = [];
	playaAsociadaMostrar = '';

	constructor(
		private navCtrl: NavController,
		private menuCtrl: MenuController,
		private authService: AuthService,
		private databaseService: DatabaseService
	) 
	{
		const id = this.authService.currentUserValue.playa_asociada;
		
		this.appPages = [
			{ title: 'Página principal', url: '/home/', icon: 'home' },
			{ title: 'Mi perfil', url: '/perfil', icon: 'person-circle' },
			{ title: 'Lista de recursos', url: `/lista-recursos/${id}`, icon: 'information-circle' },
			{ title: 'Incidencias por resolver', url: `/lista-avisos/${id}`, icon: 'warning' }
			// { title: `Socorristas en ${this.playaAsociadaMostrar}`, url: `/lista-socorristas/${id}`, icon: 'people' }
		];
	}

	logout() {
		// Obtén el id del usuario actual
		const id = this.authService.currentUserValue.id;
	
		// Actualiza el estado del usuario a 'offline'
		this.authService.updateUserStatusById(id, 'offline').subscribe(() => {
			// Después de que el estado se haya actualizado, cierra la sesión
			this.menuCtrl.close().then(() => {
				this.navCtrl.navigateRoot('/login');
			});
		});
	}
}
