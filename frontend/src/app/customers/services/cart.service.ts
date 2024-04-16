import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
  
export class CartService {

  cart$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  url = environment.apiUrl+'/cart'

  constructor(private messageService: MessageService, private http: HttpClient) {
    this.loadCart()
  }

  loadCart() {
    this.getItemLoggedInUser().subscribe((res: any) => {
      const items = res.data?.items || [];
        this.cart$.next(items);
      },(error) => {
        console.error('Error loading cart:', error);
      }
    );
  }
  addItemToCart(productId: number, quantity: number, fixedQuantity: boolean) {
    return this.http.post(`${this.url}`, { productId, quantity, fixedQuantity })
      .subscribe((res:any) => {
      this.cart$.next(res.items);
        setTimeout(() => {
           this.messageService.add(
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Cart was updated.'
          });
        },500)
      });
  }

  reorder(items: any) {
    return this.http.post(`${this.url}/reorder`, {items})
  }

  getItemLoggedInUser() {
    return this.http.get(`${this.url}`);
  }

  deleteItem(productId: number) {
    return this.http.delete(`${this.url}/${productId}`)
  }

  emptyCart() {
    return this.http.get(`${this.url}/emptyCart`).subscribe((res: any) => {
      this.cart$.next(res.newCart)
      console.log('karta emptpy',this.cart$);
    })
  }

  

}
