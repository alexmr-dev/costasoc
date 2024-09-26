import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NavController } from '@ionic/angular';
import { ElementRef, ViewChild } from '@angular/core';

// Services
import { SaveLocationService } from '../services/save-location.service';
import { MarcadoresService } from '../services/marcadores.service';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})

export class HomePage{
    @ViewChild('mapId') mapContainer!: ElementRef;

    map!:                           L.Map;
    userMarker:                     L.Marker | undefined;
    userMarkers:                    L.Marker[] = [];
    recursoMarkers:                 L.Marker[] = [];
    recursoBanderaMarkers:          L.Marker[] = [];
    avisosPresentesMarkers:         L.Marker[] = [];
    userLocation:                   [number, number] = [0, 0];

    tituloPlaya:                    string = '';
    coordsPlaya:                    [number, number] = [0, 0];
    ID_playaAsociada:               number = 0;

    temperature:                    number = 0;
    uvIndex:                        number = 0;
    windSpeed:                      number = 0;
    humedad:                        number = 0;
    showContent =                   false;

    private isMapClickListenerAdded = false;
    

    constructor(
        private geolocation: Geolocation,
        private androidPermissions: AndroidPermissions,
        private navCtrl: NavController,
        private saveLocationService: SaveLocationService,
        private marcadoresService: MarcadoresService,
        private databaseService: DatabaseService,
        private authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef
    ) 
    {
    }

    toggleShowContent() {
        this.showContent = !this.showContent; // Cambia el estado al contrario del estado actual
    }

    getWeatherData() {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${this.coordsPlaya[0]}&longitude=${this.coordsPlaya[1]}&current=temperature_2m,relative_humidity_2m,is_day,pressure_msl,wind_speed_10m&hourly=relative_humidity_2m,wind_speed_10m&daily=uv_index_max`)
            .then(response => response.json())
            .then(data => {
                this.temperature = data.current.temperature_2m;
                this.uvIndex = data.daily.uv_index_max[0];
                this.windSpeed = data.current.wind_speed_10m;
                this.humedad = data.current.relative_humidity_2m;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    

    cargarRecursos() {
        for (let marker of this.recursoMarkers) {
            this.map.removeLayer(marker);
        }
        this.recursoMarkers = [];
        
        this.databaseService.getRecursosByPlayaID(this.ID_playaAsociada).subscribe(recursos => {
            for (let recurso of recursos) {
                const infoIcon = L.icon({
                    iconUrl: this.databaseService.getIconoRecurso(recurso.ID), // Reemplaza esto con la ruta a tu icono
                    iconSize: [50, 50], // Tamaño del icono
                });
                const recursoMarker = L.marker([recurso.Coords_lat, recurso.Coords_lng], { icon: infoIcon });
                recursoMarker.on('click', () => {
                    this.saveLocationService.setCoordinates(L.latLng(recurso.Coords_lat, recurso.Coords_lng)); 
                    this.navCtrl.navigateForward(`/editar-recurso/${recurso.ID}`); 
                });
                recursoMarker.addTo(this.map);
                this.recursoMarkers.push(recursoMarker);
            }
        });
    }

    
    async cargarRecursosBanderas() {
        for (let marker of this.recursoBanderaMarkers) {
            this.map.removeLayer(marker);
        }
        
        this.recursoBanderaMarkers = [];
        
        const recursosBanderas = await this.databaseService.getRecursosBanderasByPlayaID(this.ID_playaAsociada).toPromise();
        
        for (let recursoBandera of recursosBanderas) {
            let infoIcon = L.icon({
                iconUrl: this.databaseService.getIconoRecursoBandera(recursoBandera.ID) + '?t=' + Date.now(), // Añade un parámetro de consulta que cambia cada vez
                iconSize: [50, 50], // Tamaño del icono
            });
            const recursoMarker = L.marker([recursoBandera.Coords_lat, recursoBandera.Coords_lng], { icon: infoIcon });
            recursoMarker.on('click', () => {
                this.saveLocationService.setCoordinates(L.latLng(recursoBandera.Coords_lat, recursoBandera.Coords_lng)); // Crea un nuevo objeto LatLng// Usa las coordenadas del recurso
                this.navCtrl.navigateForward(`/editar-recurso-banderas/${recursoBandera.ID}`); // Navega a la página editar-recurso cuando se hace clic en el marcador
            });
            recursoMarker.addTo(this.map);
            this.recursoBanderaMarkers.push(recursoMarker);
        }
    }
    

    cargarAvisosPresentes() {
        for (let marker of this.avisosPresentesMarkers) {
            this.map.removeLayer(marker);
        }
        this.avisosPresentesMarkers = [];
    
        this.databaseService.getAvisosPresentesByPlayaID(this.ID_playaAsociada).subscribe(avisos => {
            for (let aviso of avisos) {
                const infoIcon = L.icon({
                    iconUrl: this.databaseService.getIconoAvisoByID(aviso.ID),
                    iconSize: [50, 50],
                });
                const avisoMarker = L.marker([aviso.Coords_lat, aviso.Coords_lng], { icon: infoIcon });
                avisoMarker.on('click', () => {
                    this.saveLocationService.setCoordinates(L.latLng(aviso.Coords_lat, aviso.Coords_lng));
                    this.navCtrl.navigateForward(`/editar-aviso/${aviso.ID}`);
                });
                avisoMarker.addTo(this.map);
                this.avisosPresentesMarkers.push(avisoMarker);
            }
        });
    }

    cargarUsuariosOnline(){
        for (let marker of this.userMarkers) {
            this.map.removeLayer(marker);
        }
        this.userMarkers = [];
    
        this.databaseService.getOnlineUsers().subscribe(users => {
            // Para cada usuario online
            for (let user of users) {
                if (user.email === this.authService.currentUserValue.email) {  // Asume que tienes el email del usuario actual en this.currentUserEmail                 
                    continue;
                }
                // Crear un nuevo icono con la imagen del usuario
                const userIcon = L.divIcon({
                    className: 'custom-icon', // Añade una clase personalizada
                    html: `<img src="${this.databaseService.getUserImageUrl(user.email)}" style="width: 55px; height: 55px; border-radius: 50%; border: 1px solid black;">`, // Aplica el tamaño directamente a la imagen
                });
                //console.log(userIcon);
                // Crear un nuevo marcador con la ubicación del usuario y el icono del usuario
                const userMarker = L.marker([user.coords_lat, user.coords_lng], { icon: userIcon })
                    .on('click', () => this.navCtrl.navigateForward(`/perfil-usuario-mostrar/${user.id}`)); // Navega a la página de perfil del usuario // Navega a la página de perfil del usuario

                // Añadir el marcador al mapa y al array de marcadores
                userMarker.addTo(this.map);
                this.userMarkers.push(userMarker);
            }
        });
    }

    actualizarUbicacionUsuario() {
        if (this.userLocation) {
            this.databaseService.updateUserCoords(this.authService.currentUserValue.id, this.userLocation[0], this.userLocation[1]).subscribe(() => {
            });
        }
    }

    cargarTituloPlaya(){
        // TODO hablar de esto en la memoria
        this.ID_playaAsociada = Number(this.authService.currentUserValue.playa_asociada);
        this.databaseService.getPlayaById(this.authService.currentUserValue.playa_asociada).subscribe(playa => {
            this.tituloPlaya = playa[0].name;
            this.coordsPlaya = [playa[0].latitude, playa[0].longitude];
            this.getWeatherData();
        });
    }

    navegarAMostrarPlaya() {
        const id = this.authService.currentUserValue.playa_asociada;
        this.navCtrl.navigateForward(`/mostrar-playa/${id}`);
    }

    async ionViewDidEnter() {
        this.cargarTituloPlaya();
        // Cargar recursos banderas en el mapa
        
        try {
            /*const permission = this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION;
            const check = await this.androidPermissions.checkPermission(permission);
            if (!check.hasPermission) {
                const result = await this.androidPermissions.requestPermission(permission);
                if (!result.hasPermission) {
                    throw new Error('Permissions required');
                }
            }*/


            // Obtener usuarios online
            this.cargarUsuariosOnline();

            // Cargar recursos en el mapa
            this.cargarRecursos();

            this.cargarRecursosBanderas();
            
            // Cargar avisos presentes en el mapa
            this.cargarAvisosPresentes();

            if (!this.map) {
                this.map = L.map('mapId', 
                    { zoomControl: false, 
                        attributionControl: false}).fitWorld();
            } 

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(this.map);
            // Añadir un breve retraso antes de invalidar el tamaño
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);

            this.map.locate({ setView: true, maxZoom: 18 });
            setTimeout(() => {
                this.map.invalidateSize();
            }, 1000); 

            if (!this.isMapClickListenerAdded) {
                this.map.on('click', (e) => {
                    this.saveLocationService.setCoordinates(e.latlng);
                    this.navCtrl.navigateForward('/registrar-aviso');
                });
                this.isMapClickListenerAdded = true;
            }
            
            console.log('Usuario iniciado: ' + this.authService.currentUserValue.email);
            // Observar la ubicación en tiempo real
            this.geolocation.watchPosition().subscribe((resp) => {

                // Comprobar si resp es una Geoposition
                if ('coords' in resp) {
                    // Si ya existe un marcador, eliminarlo del mapa
                    if (this.userMarker) {
                        this.map.removeLayer(this.userMarker);
                    }

                    let imageUrl = this.databaseService.getUserImageUrl(this.authService.currentUserValue.email);
                    if (this.authService.currentUserValue.imagen && typeof this.authService.currentUserValue.imagen !== 'object') {
                        imageUrl = this.authService.currentUserValue.imagen;
                    } 

                    const userIcon = L.divIcon({
                        className: 'custom-icon', // Añade una clase personalizada
                        html: `<img src="${imageUrl}" style="width: 55px; height: 55px; border-radius: 50%; border: 1px solid black;">`, // Aplica el tamaño directamente a la imagen
                    });

                    // Crear un nuevo marcador y añadirlo al mapa
                    this.userMarker = L.marker([resp.coords.latitude, resp.coords.longitude], { icon: userIcon })
                        .on('click', () => this.navCtrl.navigateForward('/perfil')) // Navega a la página de perfil
                        .addTo(this.map);
                    this.userLocation = [resp.coords.latitude, resp.coords.longitude];

                    //this.actualizarUbicacionUsuario();
                } else {
                    // resp es un PositionError, manejar el error
                    console.error('Error watching position', resp.message);
                }
            });

            
        } catch (error) {
            console.log('Error getting location', error);
        }
    }

    centerMapOnUser() {
        if (this.userLocation) {
            this.map.setView(this.userLocation, 18);
        }
    }

}

