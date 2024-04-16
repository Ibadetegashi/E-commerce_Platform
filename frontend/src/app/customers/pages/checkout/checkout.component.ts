import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/auth/services/users.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['../cart/cart.component.scss']
})
export class CheckoutComponent implements OnInit {
  form!: FormGroup 
  userId!: number 
  user:any
  orderItems: any[] = []
  error:any
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private userService: UsersService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  
    this.formInit()
    this.getLoggedInUser()
    this.getCart()
  }

  formInit() {
    this.form = new FormGroup({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl(''),
      shippingAddress: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
      zip: new FormControl(''),
      phoneNumber: new FormControl(),
      status: new FormControl('Pending'),
    })
  }

  getCart() {
    this.cartService.getItemLoggedInUser().subscribe((res: any) => {
      this.orderItems = res.data.items.map((item: any) => {
        return {
          productId: item.productId,
          quantity: item.quantity
        }
      })
    console.log(this.orderItems);
    });
  }
  makeOrder() {
    const getProductObservables = this.orderItems.map(item => 
  this.orderService.getProduct(item.productId)
);

// Use forkJoin to wait for all getProduct requests to complete
forkJoin(getProductObservables).subscribe((products: any[]) => {
  let insufficientStockProducts: string[] = []; // Array to hold names of products with insufficient stock

  // Iterate through the products obtained from getProduct requests
  for (let i = 0; i < products.length; i++) {
    const product = products[i].data; // Assuming product data is in the 'data' property
    const orderItem = this.orderItems[i];

    // Check if quantity exceeds stock for the current product
    if (orderItem.quantity > product.stock) {
      insufficientStockProducts.push(product.name); // Add product name to the array
    }
  }

  if (insufficientStockProducts.length > 0) {
    // Inform the user about the products with insufficient stock
    alert(`Sorry, the following products do not have enough stock: ${insufficientStockProducts.join(', ')}`);
  } else {
    // If all products have enough stock, proceed with placing the order
    const order = {
      shippingAddress: this.form.value.shippingAddress,
      city: this.form.value.city,
      country: this.form.value.country,
      zip: this.form.value.zip,
      phoneNumber: this.form.value.phoneNumber,
      items: this.orderItems,
      status: this.form.value.status,
      userId: this.userId
    };

    this.orderService.makeOrder(order).subscribe((res: any) => {
      this.cartService.emptyCart();
      alert("Your order has been placed successfully!");
      this.router.navigate(['/products']);
    }, (err: any) => {
      console.log(err);
      this.error = err.error.errors;
    });
  }
});

  }

 
  getLoggedInUser() {
    this.userService.getUser(this.authService.getUserIdByToken()).subscribe((res: any) => {
      this.user = res.data
      this.userId  = res.data.id
      this.form.patchValue({
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email
      })
      console.log(this.user);
    })
  }
  
}
