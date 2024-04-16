import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { zip } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-history-details',
  templateUrl: './order-history-details.component.html',
  styleUrls: ['./order-history-details.component.scss']
})
export class OrderHistoryDetailsComponent implements OnInit {


  order: any
  orderId!: number
  orderItems: any
  error: any;
  form!: FormGroup
  existingCartItems : any[] = []
  showModal = true;
  orderItemsWithoutStock: any[] = [];

  constructor(
    private routeActive: ActivatedRoute,
    private orderService: OrderService,
    private cartService: CartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.routeActive.params.subscribe((param: any) => {
      console.log("Param", param);
    console.log(this.cartService.cart$.value);

      this.orderId = param.id;
    })
    

    this.getOrderDetails()
    this.getOrderItems()
    this.initAddressForm()
  }

  getOrderDetails() {
    this.orderService.getOrderDetails(this.orderId).subscribe((order:any) => {
      this.order = order.data;  
      console.log(this.order);
      this.form.patchValue({
        shippingAddress: this.order.shippingAddress,
        phoneNumber: this.order.phoneNumber,
        country: this.order.country,
        city: this.order.city,
        zip: this.order.zip
      })
    }, err => {
      console.log(err);
    })
  }

  getOrderItems() {
    this.orderService.getOrderItems(this.orderId).subscribe((item: any) => {
      this.orderItems = item.data
      console.log('oderitems', this.orderItems);
    })
  }

  cancelOrder() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this order?',
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService
          .cancelOrder(this.orderId)
          .subscribe(
            (res:any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message
              });
              setTimeout(() => {
                this.router.navigate(['/order-history']);
               } ,1000);
            },
            (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message
              });
            }
          , );
      }
    });
  }

  initAddressForm() {
    this.form = new FormGroup({
      shippingAddress: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
      zip: new FormControl(''),
      phoneNumber: new FormControl(''),
    })
    console.log(this.form.value);
  }

  editAddress() {
    this.orderService.editAddress(this.order.id, this.form.value).subscribe((res: any) => {
      this.error = null
      console.log(res);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message
            });
      setTimeout(() => {
            this.error = null
            window.location.reload();
            } ,200);
    }, err => {
      console.log(err);
      this.error = null
      if (err.error.errors) {
        this.error = err.error.errors
        return
      }
      this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message
              });
    }, )
  }
mergeOrderItemsWithCart(orderItems: any[]) {
  this.existingCartItems = [...this.cartService.cart$.value];
  this.orderItemsWithoutStock=[]
  console.log('excartItems',this.existingCartItems);
    for (const orderItem of orderItems) {
        const existingCartItemIndex = this.existingCartItems.findIndex(cartItem => cartItem.productId === orderItem.productId);

        if (existingCartItemIndex !== -1) {
            // Product already exists in the cart
            const mergeQuantity = this.existingCartItems[existingCartItemIndex].quantity + orderItem.quantity;
            if (mergeQuantity > orderItem.Product.stock) {
                console.log('Quantity exceeds available stock');
                this.orderItemsWithoutStock.push(orderItem);
            } else {
                this.existingCartItems[existingCartItemIndex].quantity += orderItem.quantity;
            }
        } else {
            // Product doesn't exist in the cart
            if (orderItem.quantity > orderItem.Product.stock) {
                console.log('Quantity exceeds available stock');
                this.orderItemsWithoutStock.push(orderItem);
            } else {
                this.existingCartItems.push(orderItem);
            }
        }
    }
  
}

  // continueAddingToCart() {
  //   this.cartService.reorder(this.existingCartItems).subscribe((res) => {
  //       console.log(res);
  //       this.cartService.cart$.next(this.existingCartItems);
  //   this.router.navigate(['/cart'])
  //   }, err => {
  //       console.log(err);
  //   });
  // }


}
