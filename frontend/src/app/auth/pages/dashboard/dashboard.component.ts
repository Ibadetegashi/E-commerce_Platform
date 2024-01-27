import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent {
  constructor( router: Router) {
   router.navigate(['dashboard/products'])
 }
}
