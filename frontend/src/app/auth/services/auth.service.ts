import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { Observable, catchError } from 'rxjs';
import { Register } from 'src/app/shared/interfaces/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }
  url = environment.apiUrl + '/user'

  login(email:string,password:string)  {
    return this.http.post(`${this.url}/login`, {email,password});
  }

 isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.decodeToken(token);
      if (decodedToken && decodedToken.exp) {
        return Date.now() <= decodedToken.exp * 1000;
      }
    }
    return false;
 }
  
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }

  register(data: Register): Observable<any> {
    return this.http.post(`${this.url}/register`, data)
  }
  
  isAdmin(): boolean {
    const token =  localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.decodeToken(token);
      return decodedToken && decodedToken.isAdmin;
    }
    return false;
  }

   getUserIdByToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.decodeToken(token);
      const userId = user.userId;
      return userId;
    }
  }


  private decodeToken(token: any): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
