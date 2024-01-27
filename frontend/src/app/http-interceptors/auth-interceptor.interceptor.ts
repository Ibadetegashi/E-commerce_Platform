import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const url = environment.apiUrl
    const token = localStorage.getItem('token')
    const myapi = request.url.startsWith(url)
    const cloneReq = request.clone(
      {
        setHeaders: (token && myapi) ? { 'Authorization': `Bearer ${token}` } : { 'Auth': "No token " }
      },

    )
    console.log(cloneReq);
    return next.handle(cloneReq);
  }
}
