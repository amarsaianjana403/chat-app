
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class FriendService {
    private baseUrl = '/api/friend'; // Base URL for friend endpoints
    constructor(private http: HttpClient) { }
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            }),
        };
    } 

    // users

    getAllUsers(): Observable<any> {
        return this.http.get(`/api/user`, this.getAuthHeaders());
    }

    sendFriendRequest(receiverId: number) {
        return this.http.post(`${this.baseUrl}/send/${receiverId}`, {}, this.getAuthHeaders());
    }

    acceptFriendRequest(requestId: number) {
        return this.http.post(`${this.baseUrl}/accept/${requestId}`, {}, this.getAuthHeaders());
    }

    rejectFriendRequest(requestId: number) {
        return this.http.post(`${this.baseUrl}/reject/${requestId}`, {}, this.getAuthHeaders());
    }

    getPendingRequests() {
        return this.http.get(`${this.baseUrl}/pending`, this.getAuthHeaders());
    }

    getFriends() {
        return this.http.get(`${this.baseUrl}/friends`, this.getAuthHeaders());
    }

    getSentRequests() {
        return this.http.get(`${this.baseUrl}/sent`, this.getAuthHeaders());
    }

    getUndoRequest(requestId: number) {
        return this.http.post(`${this.baseUrl}/undo/${requestId}`, {}, this.getAuthHeaders());
    }

    getUnfriendRequest(friendId:number){
        return this .http.post(`${this.baseUrl}/unfriend/${friendId}`, {}, this.getAuthHeaders())
    }

}