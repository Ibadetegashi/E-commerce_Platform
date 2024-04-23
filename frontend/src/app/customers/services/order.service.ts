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

  getOrderHistory() {
    return this.http.get(`${this.url}/order/client/orders`,);
  }

getOrderDetails(id:number) {
    return this.http.get(`${this.url}/order/${id}`);
  }
    getOrderItems(orderid: number) {
    return this.http.get(`${this.url}/order/orderItems/${orderid}`)
  }

  cancelOrder(orderid: number) {
    return this.http.get(`${this.url}/order/cancelOrder/${orderid}`)
  }

  editAddress(orderid: number, address: Object) {
    return this.http.patch(`${this.url}/order/client/${orderid}`, address)
  }

    getSuggestedProducts(id: number) { 
    return this.http.get(`${this.url}/category/product/${id}`);
  }
}
