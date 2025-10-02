import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestService {
    private serverUrl = '/api';
    
    constructor(private http: HttpClient) { }

    getUsers() {
        return this.http.get<any[]>(`${this.serverUrl}/users`);
    }

    createUser(data: any) {
        // Generate a unique username and email with timestamp to avoid conflicts
        const timestamp = Date.now();
        return this.http.post<any>(`${this.serverUrl}/users`, {
            "username": `user_${timestamp}`,
            "email": `user_${timestamp}@example.com`,
            "password": "12345"
        });
    }

    // Authentication methods
    login(email: string, password: string) {
        return this.http.post<any>(`${this.serverUrl}/auth/login`, {
            email,
            password
        });
    }

    logout() {
        return this.http.post<any>(`${this.serverUrl}/auth/logout`, {}, this.getAuthHeaders());
    }

    register(username: string, email: string, password: string) {
        return this.http.post<any>(`${this.serverUrl}/auth/register`, {
            username,
            email,
            password
        });
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
    getProtectedData() {
        return this.http.get<any>(`${this.serverUrl}/protected`, this.getAuthHeaders());
    }
}