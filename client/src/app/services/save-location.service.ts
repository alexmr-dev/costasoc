import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';
@Injectable({
	providedIn: 'root'
})

export class SaveLocationService {

	private coordinates: LatLng | null = null;

	setCoordinates(coordinates: LatLng) {
		this.coordinates = coordinates;
	}

	getCoordinates() {
		return this.coordinates;
	}
}
