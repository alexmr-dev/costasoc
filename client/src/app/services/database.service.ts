import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class DatabaseService {

	constructor(
		private http: HttpClient
	) { }

	private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token || ''
        });
    }

	// Obtener imagen de usuario por email
	getUserImageUrl(email: string): string {
		return `${environment.api}/api/user/imagen?email=${email}`;
	}

	// Obtener usuario por ID
	getUserById(id: number): Observable<any> {
		return this.http.get(`${environment.api}/api/users/${id}`, { headers: this.getAuthHeaders() });
	}

	// Obtener todos los usuarios online
	getOnlineUsers(): Observable<any> {
		return this.http.get(`${environment.api}/api/users/online`, { headers: this.getAuthHeaders() });
	}

	// Obtener todos los usuarios online por ID de playa
	getOnlineUsersByPlayaID(ID: number): Observable<any> {
		return this.http.get(`${environment.api}/api/beach/users/online/${ID}`, { headers: this.getAuthHeaders() });
	}

	// Actualizar coordenadas de un usuario
	updateUserCoords(ID: number, coords_lat: number, coords_lng: number): Observable<any> {
		return this.http.put(`${environment.api}/api/users/coords/${ID}`, 
			{ lat: coords_lat.toString(), lng: coords_lng.toString() },
			{ headers: this.getAuthHeaders() });
	}

	// Obtener recurso por ID
	getRecursosById(ID: number): Observable<any> {
		return this.http.get(`${environment.api}/api/recursos/${ID}`, { headers: this.getAuthHeaders() });
	}

	// Obtener recurso bandera por ID
	getRecursosBanderaById(ID: number): Observable<any> {
		return this.http.get(`${environment.api}/api/recursos_banderas/${ID}`, { headers: this.getAuthHeaders() });
	}

	// Obtener icono de recurso por ID
	getIconoRecurso(ID: number): string {
		return `${environment.api}/api/recursos/icono?ID=${ID}`;
	}

	// Obtener icono de recurso bandera por ID
	getIconoRecursoBandera(ID: number): string {
		return `${environment.api}/api/recursos_banderas/icono?ID=${ID}`;
	}

	// Obtener imagen de recurso por ID
	getImagenRecurso(ID: number): string {
		return `${environment.api}/api/recursos/imagen?ID=${ID}`;
	}

	// Obtener todos los recursos por ID de playa
	getRecursosByPlayaID(ID: number): Observable<any> {
		return this.http.get(`${environment.api}/api/beach/recursos/todos/${ID}`, { headers: this.getAuthHeaders() });
	}

	// Obtener todos los recursos bandera por ID de playa
	getRecursosBanderasByPlayaID(ID: number): Observable<any> {
		return this.http.get(`${environment.api}/api/beach/recursos_banderas/${ID}`, { headers: this.getAuthHeaders() });
	}

	// Obtener recursos rotos por ID de playa
	getRecursosRotosByPlayaID(ID: number): Observable<any> {
		return this.http.get(`${environment.api}/api/beach/recursos/rotos/${ID}`, { headers: this.getAuthHeaders() });
	}

	// Obtener recursos robados por ID de playa
	getRecursosRobadosByPlayaID(ID: number): Observable<any> {
		return this.http.get(`${environment.api}/api/beach/recursos/robados/${ID}`, { headers: this.getAuthHeaders() });
	}

	// Actualizar recurso por ID
	updateRecursoById(ID: number, Estado: string, Comentario: string, UsuarioLastUpdate: number, ImagenShow?: string): Observable<any> {
		const body: any = { Estado, Comentario, UsuarioLastUpdate };
		if (ImagenShow) {
			body['ImagenShow'] = ImagenShow;
		}
		return this.http.put(`${environment.api}/api/recursos/${ID}`, body, { headers: this.getAuthHeaders() });
	}

	// Actualizar recurso bandera por ID
	updateRecursoBanderaById(ID: number, Estado: string, Comentario: string, UsuarioLastUpdate: number, Icono: any): Observable<any> {
		const body: any = { Estado, Comentario, UsuarioLastUpdate, Icono};
		return this.http.put(`${environment.api}/api/recursos_banderas/${ID}`, body, { headers: this.getAuthHeaders() });
	}

	// Permitir baño
	permitirBanio(ID: number, UsuarioLastUpdate: number): Observable<any> {
		const iconPath = '/assets/icons/bandera_verde.png';
		return this.updateRecursoBanderaById(ID, 'Permitido', 'Baño permitido', UsuarioLastUpdate, iconPath);
	}

	// Baño con precaucion
	banioConPrecaucion(ID: number, UsuarioLastUpdate: number): Observable<any> {
		const iconPath = '/assets/icons/bandera_amarilla.png';
		return this.updateRecursoBanderaById(ID, 'Precaución', 'Baño con precaución', UsuarioLastUpdate, iconPath);
	}

	// Prohibir baño
	prohibirBanio(ID: number, UsuarioLastUpdate: number): Observable<any> {
		const iconPath = '/assets/icons/bandera_roja.png';
		return this.updateRecursoBanderaById(ID, 'Prohibido', 'Baño prohibido', UsuarioLastUpdate, iconPath);
	}

	// Obtener todas las regiones
	getRegiones(): Observable<any> {
		return this.http.get(`${environment.api}/api/regiones`, { headers: this.getAuthHeaders() });
	}

	// Obtener todas las playas
	getPlayas(): Observable<any> {
		return this.http.get(`${environment.api}/api/beach`, { headers: this.getAuthHeaders() });
	}

	// Obtener playas por región
	getPlayasByRegion(regionId: number): Observable<any> {
		return this.http.get(`${environment.api}/api/beach/region/${regionId}`, { headers: this.getAuthHeaders() });
	}

	// Obtener playa por ID
	getPlayaById(ID: number): Observable<any> {
		return this.http.get(`${environment.api}/api/beach/${ID}`, { headers: this.getAuthHeaders() });
	}

	// Obtener imagen de recurso por ID
	getImagenPlayaByID(ID: number): string {
		return `${environment.api}/api/beach/imagen?ID=${ID}`;
	}

	// Obtener todos los avisos
	getAvisos(): Observable<any> {
		return this.http.get(`${environment.api}/api/avisos`, { headers: this.getAuthHeaders() });
	}

	// Obtener aviso por ID
	getAvisoById(ID: number): Observable<any> {
		return this.http.get(`${environment.api}/api/avisos/${ID}`, { headers: this.getAuthHeaders() });
	}

	// Obtener icono de aviso por ID
	getIconoAvisoByID(ID: number): string {
		return `${environment.api}/api/avisos/icono?ID=${ID}`;
	}

	// Obtener imagen de recurso por ID
	getImagenAviso(ID: number): string {
		return `${environment.api}/api/avisos/imagen?ID=${ID}`;
	}

	// Obtener avisos presentes por ID de playa
	getAvisosPresentesByPlayaID(ID: number): Observable<any> {
		return this.http.get(`${environment.api}/api/beach/incidencias/${ID}`, { headers: this.getAuthHeaders() });
	}

	// Subir aviso
	pushAviso(aviso: any): Observable<any> {
		return this.http.post(`${environment.api}/api/avisos`, aviso, { headers: this.getAuthHeaders() });
	}

	// Actualizar aviso por ID
	updateAvisoById(ID: number, AvisoSolucionadoString: string, Comentario: string, UsuarioLastUpdate: number, ImagenShow?: string): Observable<any> {
		const body: any = { AvisoSolucionadoString, Comentario, UsuarioLastUpdate };
		if (ImagenShow) {
			body['ImagenShow'] = ImagenShow;
		}
		return this.http.put(`${environment.api}/api/avisos/${ID}`, body, { headers: this.getAuthHeaders() });
	}

	// Eliminar aviso por ID
	deleteAvisoById(ID: number): Observable<any> {
		return this.http.delete(`${environment.api}/api/avisos/${ID}`, { headers: this.getAuthHeaders() });
	}
	
}