import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { STATUSES } from 'src/app/auth/components/order/orderStatuses';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit{
  orderHistory = [];
  message = '';
  statuses: { [key: string]: { severity: string; text: string } }= STATUSES


  constructor(private orderHistoryService: OrderService) { }
  ngOnInit(): void {
    this.orderHistoryService.getOrderHistory().subscribe((res:any) => {
      this.orderHistory = res.data
      console.log('orderHistory',this.orderHistory);
    }, err => {
      console.log(err);
      this.message = err.error.message
    })
  }
  








}
