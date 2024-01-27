import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl

  
  getProduct(id: number) {
    return this.http.get(`${this.url}/product/${id}`)
  }

  makeOrder(data: any) {
    return this.http.post(`${this.url}/order`, data)
  }

}
