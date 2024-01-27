import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate{

  constructor(private auth: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
     if (this.auth.isAdmin()) {
      return true; // Allow access for admin
    } else {
       this.router.navigateByUrl('/products');
       console.log('NOT ADMIN');
      return false;
    }
  }
}
