import { Component, Input } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RatingRateEvent } from 'primeng/rating';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.scss']
})
export class ReviewDetailsComponent {

  @Input() id: any;

  reviews:any
  collapse: any;
  error: any
  message: any
  userId:any
  review = {
    rating: 0,
    comment: '',
    productId: ''
};

   constructor(
     private reviewService: ReviewService,
     private messageService: MessageService,
     private authService: AuthService,
     private confirmationService: ConfirmationService
   ) { }
  
  ngOnInit(): void {
    this.getReviews()
    this.userId = this.authService.getUserIdByToken()
    console.log(this.userId);
  }

   getReviews() {
    this.reviewService.getReviews(this.id).subscribe((res: any) => {
      console.log('reviews', res);
      this.reviews = this.sortReviews(res)
    }, err => {
      console.log(err);
    })
   }
  
  submitReview() {
    this.review.productId = this.id;
    this.message = ''
    this.error = null;
    this.reviewService.addReview(this.review).subscribe((res: any) => {
      console.log(res);
      this.getReviews()
       this.messageService.add(
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Comment added successfully'
          });
    }, err => {
      console.log(err);
      this.message = err.error.message
      this.error = err.error.errors
    })
    console.log(this.review);
  }
  
  setRating(value: number) {
    this.review.rating = value
}

   deleteReview(id: number) {
     this.confirmationService.confirm({
      message: 'Are you sure you want to delete your review for this product?',
      header: 'Delete Review',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reviewService
          .deleteReview(id)
          .subscribe(
            (res:any) => {
              this.getReviews()
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message
              });
            },
            (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Review is not deleted!'
              });
            }
          );
      }
    });
  }
private sortReviews(reviews: any[]): any[] {
  const firstUserReviewIndex = reviews.findIndex(review => review.userId === this.userId);

  if (firstUserReviewIndex !== -1) {
    //the review of the loggedin user
    const userReview = reviews.splice(firstUserReviewIndex, 1)[0];
    reviews.unshift(userReview);
  }

  return reviews;
}
}
