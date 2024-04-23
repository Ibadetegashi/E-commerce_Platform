import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl

  getReviews(id:number) {
    return this.http.get(`${this.url}/product/review/${id}`)
  }

  addReview(review: object) {
    return this.http.post(`${this.url}/product/review`, review)
  }



  deleteReview(id: number) { 
    return this.http.delete(`${this.url}/product/review/${id}`);
  }
}
