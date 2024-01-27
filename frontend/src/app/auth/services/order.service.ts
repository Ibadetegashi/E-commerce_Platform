import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl+'/order'

  getOrders() {
    return this.http.get(`${this.url}`);
  }

  getOrder(id:number) {
    return this.http.get(`${this.url}/${id}`);
  }

  getOrderItems(orderid: number) {
    return this.http.get(`${this.url}/orderItems/${orderid}`)
  }

  changeOrderStatus(status: string, id:number) {
    return this.http.put(`${this.url}/${id}`, {status})
  }

  deleteOrder(id: number) {
    return this.http.delete(`${this.url}/${id}`)
  }
}
