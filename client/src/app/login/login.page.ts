import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

interface LoginResult {
	successLogin: boolean;
}
@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	email: string = '';
	password: string = '';

	constructor(
		private navCtrl: NavController,
		private menuCtrl: MenuController,
		private authService: AuthService,
		private alertController: AlertController
	) {

	}

	ngOnInit() {
	}

	async login() {
        const result = await this.authService.login(this.email, this.password) as LoginResult;

        if (result.successLogin) {
            this.navCtrl.navigateForward('/home');
        } else {
            const alert = await this.alertController.create({
                header: 'Error',
                message: 'Los campos introducidos no son correctos',
                buttons: ['OK']
            });

            await alert.present();
        }
    }

	ionViewWillEnter() {
		this.menuCtrl.enable(false);
	}

	ionViewDidLeave() {
		this.menuCtrl.enable(true);
	}

}
