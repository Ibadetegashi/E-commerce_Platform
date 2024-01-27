import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, defaultIfEmpty, map, of } from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl+'/product'
  
  getProducts():Observable<Product[]> {
    return this.http.get(`${this.url}`).pipe(
      map((res: any) => res.data),
      catchError((err: any) => {
        console.log(err);
        return of([])
      })
    )
  }


  createProduct(data: FormData) {
  return this.http.post(`${this.url}`, data);
}

  deleteProduct(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }


  getProduct(id: number) : Observable<Product> {
    return this.http.get(`${this.url}/${id}`).pipe(
      map((res: any) => res.data),
      catchError((err: any) => {
        console.log(err);
        return of(null)
      }),
      defaultIfEmpty(null))
  }


  editProduct(id: number, data:FormData) {
    return this.http.put(`${this.url}/${id}`, data)
  }
}
