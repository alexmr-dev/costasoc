import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-perfil-usuario-mostrar',
	templateUrl: './perfil-usuario-mostrar.page.html',
	styleUrls: ['./perfil-usuario-mostrar.page.scss'],
})
export class PerfilUsuarioMostrarPage implements OnInit {

	public userAMostrar: any;
	public nombrePlayaAsociada: string = '';

	constructor(
		private databaseService: DatabaseService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		const userId = this.route.snapshot.paramMap.get('id');
		if (userId) {
			this.databaseService.getUserById(Number(userId)).subscribe(user => {
				this.userAMostrar = user[0];
				this.userAMostrar.imagen = this.databaseService.getUserImageUrl(this.userAMostrar.email);
				
				this.databaseService.getPlayaById(this.userAMostrar.playa_asociada).subscribe(playa => {
					this.nombrePlayaAsociada = playa[0].name;
				});
				/*console.log("Nombre: " + this.userAMostrar.name); // Ahora this.userAMostrar está definido
				console.log("Apellidos: " + this.userAMostrar.surname); 
				console.log("Email: " + this.userAMostrar.email); 
				console.log("Estado: " + this.userAMostrar.estado);
				console.log("Imagen: " + this.userAMostrar.imagen);*/
			});
		}
	}

}
