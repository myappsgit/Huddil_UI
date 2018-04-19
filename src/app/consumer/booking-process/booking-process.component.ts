import { Component } from '@angular/core';


import { MeetupService } from '../../provider/meetup.service';
import { CanActivate, Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'booking-process',
  templateUrl: 'booking-process.component.html',
  styleUrls: ['booking-process.component.css']
})
export class BookingProcessComponent {
  payment_id;
  payment_request_id;
  successStatus: string = '';
  errorStatus: string = '';
  loading;
  bookingTiming;
  bookingDetails;
  bookingId;
  invalidresponse: boolean;
  successresponse: boolean;
  constructor(public activatedRoute: ActivatedRoute, public meetUpService: MeetupService, public router: Router) {
    this.payment_id = this.activatedRoute.snapshot.queryParams["payment_id"];
    this.payment_request_id = this.activatedRoute.snapshot.queryParams["payment_request_id"];

    if (this.payment_id == '' || this.payment_id == undefined || this.payment_id == null) {
      this.router.navigate(['']);
    }
  }
  ngOnInit() {
    this.bookingDetails = JSON.parse(sessionStorage.getItem('bookingDetails'));
    this.bookingTiming = JSON.parse(sessionStorage.getItem('bookingTiming'));
    this.bookingId = sessionStorage.getItem('bookingId');
    this.detailsSubmitToServer();
  }
  detailsSubmitToServer() {
    this.loading = true;
    this.meetUpService.confirmBooking(this.bookingTiming[0].startTime, this.bookingTiming[0].endTime, this.bookingDetails.capacity, this.bookingDetails.id, this.payment_id, this.bookingId).subscribe(response => {

      switch (response.responseCode) {
        case '3000':
          this.errorStatus = 'From time is after to time';
          break;
        case '3003':
          this.errorStatus = 'Invalid facility id';
          break;
        case '3004':
          this.errorStatus = 'Facility not available for booking';
          break;
        case '3005':
          this.errorStatus = 'Facility is under maintenance';
          break;
        case '3006':
          this.errorStatus = 'Booking start time is before facility opening time';
          break;
        case '3007':
          this.errorStatus = 'Booking end time is after facility closing time';
          break;
        case '3008':
          this.errorStatus = 'Facility does not have enough seats';
          break;
        case '3009':
          //this.bookingErrorMessage = 'Facility have enough seats'; for coworking
          this.successStatus = 'Booking is confirmed';

          break;
        case '3010':
          this.errorStatus = 'Already booking exist for the time specified';
          break;
        case '3012':
          this.errorStatus = 'Booking id is invalid';
          break;
        case '3013':
          this.errorStatus = 'User id does not match';
          break;
        case '3014':
          this.successStatus = 'Booking is confirmed';
          break;
        case '3015':
          this.errorStatus = 'Duplicate payment id';

          break;
        case '3016':
          this.errorStatus = 'Booking entry is created';

          break;
        case '3017':
          this.invalidresponse = true;
          this.errorStatus = 'Payment failed';

          break;
        case '3018':
          this.errorStatus = 'Facility closed on the selected date(s)';

          break;
        case '9996':
          this.errorStatus = 'User is not allowed to perform this action';
          break;
        case '9999':
          this.errorStatus = 'Session invalid/ does not exist';
          break;

      }
      setTimeout(() => {
        if (this.invalidresponse) {
          this.router.navigate(['/consumer/booking-summary']);
        }
        else {

          this.router.navigate(['/consumer/order-confirmation/' + this.bookingId]);
        }

      }, 5000);
    })
  }
}