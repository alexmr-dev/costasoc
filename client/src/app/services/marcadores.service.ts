import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';

@Injectable({
	providedIn: 'root'
})

export class MarcadoresService {

	private marcadoresRecurso: LatLng[] = [];
	private marcadoresAviso: LatLng[] = [];
	private marcadoresIncidencia: LatLng[] = [];

	crearMarcador(coordenadas: LatLng, tipo: string) {
		switch (tipo) {
			case 'Recurso':
				this.marcadoresRecurso.push(coordenadas);
				break;
			case 'Aviso':
				this.marcadoresAviso.push(coordenadas);
				break;
			case 'Incidencia':
				this.marcadoresIncidencia.push(coordenadas);
				break;
			default:
				console.error(`Tipo desconocido: ${tipo}`);
				break;
		}
	}

	getMarcadores(tipo: string) {
		switch (tipo) {
			case 'Recurso':
				return this.marcadoresRecurso;
			case 'Aviso':
				return this.marcadoresAviso;
			case 'Incidencia':
				return this.marcadoresIncidencia;
			default:
				console.error(`Tipo desconocido: ${tipo}`);
				return [];
		}
	}
}