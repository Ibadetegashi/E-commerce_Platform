import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { zip } from 'rxjs';

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

  constructor(
    private routeActive: ActivatedRoute,
    private orderService: OrderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.routeActive.params.subscribe((param: any) => {
      console.log("Param", param);
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
    this.orderService.editAddress(this.order.id, this.form.value).subscribe((res:any) => {
      console.log(res);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message
            });
          setTimeout(() => {
            window.location.reload();
          
               } ,100);
     
      
    }, err => {
      console.log(err);
      if (err.error.errors) {
      this.error = err.error.errors
        return
      }
      this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message
              });
    })
  }

  
  
}
