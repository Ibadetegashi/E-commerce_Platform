import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, defaultIfEmpty, map, of } from 'rxjs';
import { Category } from 'src/app/shared/interfaces/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl+'/category'
  
  getCategories(): Observable<Category[]> {
    return this.http.get(`${this.url}`).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        console.log(error);
        return []
      })
    )
  }

  setCategory(category: Category) {
    return this.http.post(`${this.url}`, category)
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }


getCategory(id: number): Observable<Category> {
  return this.http.get(`${this.url}/${id}`).pipe(
    map((res: any) => res.data),
    catchError((error: any) => {
      console.log(error);
      return of(null);
    }),
    defaultIfEmpty(null)
  );
}


  editCategory(category:Category) {
    return this.http.put(`${this.url}/${category.id}`, category)
  }
}
