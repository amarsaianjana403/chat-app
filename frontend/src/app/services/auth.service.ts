import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";



@Injectable({  providedIn: 'root' })
export class AuthService {
    private serverUrl = '/api/auth'; // Base URL for auth endpoints
    constructor(private http: HttpClient) { }

    login(data:any): Observable<any> {
        return this.http.post<any>(`${this.serverUrl}/login`, data);
    }

    register(data:any): Observable<any> {
        return this.http.post<any>(`${this.serverUrl}/register`, data);
    }

    logout(): void {
        const token = localStorage.getItem('token');
        if (token) {
            this.http.post(`${this.serverUrl}/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            }).subscribe();
        }
        localStorage.removeItem('token');
    }

    // Method to make authenticated requests
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        };
    }

    // Example of protected endpoint call
    getProtectedData(): Observable<any> {
        return this.http.get<any>(`${this.serverUrl}/protected`, this.getAuthHeaders());
    }

}