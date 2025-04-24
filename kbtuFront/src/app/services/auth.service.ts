import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000'; 
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/api/login/`, { username, password });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/registration/`, userData);
  }
  
  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.router.navigate(['/']);
  }

  saveToken(token: string, refresh: string) {
    localStorage.setItem('access', token);
    localStorage.setItem('refresh', refresh);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access');
  }

  getToken(): string | null {
    return localStorage.getItem('access');
  }
  getUserProfile() {
    const token = localStorage.getItem('access');
    return this.http.get('http://localhost:8000/api/profile/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  updateUserProfile(updatedData: any) {
    const token = localStorage.getItem('access');
    return this.http.patch(`${this.baseUrl}/api/profile/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
  deleteUserAccount() {
    const token = localStorage.getItem('access');
    return this.http.delete('http://localhost:8000/api/profile/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
