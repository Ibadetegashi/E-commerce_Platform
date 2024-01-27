import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl+'/user'

  getUsers(): Observable<User[]> {
    return this.http.get(`${this.url}`).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        console.log(error);
        return of([])
      })
    )
  }
  getUser(id: number) {
    return this.http.get(`${this.url}/${id}`);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

   makeUserAdmin(id: number, isAdmin: boolean){
    return this.http.put(`${this.url}/${id}/status`, {isAdmin});
   }
  
  updateUser(data:object, id:number) {
    return this.http.put(`${this.url}/${id}`, data)
  }

  changeEmail(email: string, id: number) {
    return this.http.put(`${this.url}/updateEmail/${id}`, {email})
  }

}
