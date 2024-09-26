import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface LoginResponse {
	auth: boolean;
	user?: User;
	token?: string;
}

interface User {
	id: number;
	email: string;
	password: string;
	name: string;
	surname: string;
	role: number;
	imagen: any;
	estado: string;
	playa_asociada: number;
}






@Injectable({
	providedIn: 'root'
})
export class AuthService {
	public currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;

	constructor(private http: HttpClient) {
		const storedUser = localStorage.getItem('currentUser');
		this.currentUserSubject = new BehaviorSubject<User>(storedUser ? JSON.parse(storedUser) : null);
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

	login(email: string, password: string): Promise<any> {
		console.log("LLgea al login");
        return this.http.post<LoginResponse>(`${environment.api}/api/login`, { email, password })
            .pipe(
                switchMap(response => {
                    if (response.auth && response.user && response.token) {
                        // Almacenar el token en localStorage
                        localStorage.setItem('token', response.token);
						console.log("Token: ", response.token);
                        localStorage.setItem('currentUser', JSON.stringify(response.user));
                        this.currentUserSubject.next(response.user);

                        // Actualiza el estado del usuario a 'online'
                        return this.updateUserStatusById(response.user.id, 'online').pipe(
                            map(() => ({ successLogin: response.auth }))
                        );
                    } else {
                        return of({ successLogin: response.auth });
                    }
                })
            )
            .toPromise();
    }

	private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token || ''
        });
    }

	updateUserById(id: number, name: string, surname: string, email: string, playa_asociada: number, imagen?: string): Observable<any> {
        const body: any = { name, surname, email, playa_asociada };
        if (imagen) {
            body['imagen'] = imagen;
        }
        return this.http.put(`${environment.api}/api/users/${id}`, body, { headers: this.getAuthHeaders() });
    }

    updateUserStatusById(id: number, estado: string): Observable<any> {
        const body: any = { estado };
        return this.http.put(`${environment.api}/api/users/estado/${id}`, body, { headers: this.getAuthHeaders() });
    }
}