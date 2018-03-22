import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { Router } from '@angular/router';

declare var require: any;
// let jsPDF = require('jspdf');
// require('jspdf-autotable');

@Component({
  selector: 'payment-history',
  templateUrl: 'payment-history.component.html',
  styleUrls: ['payment-history.component.css'],
})
export class PaymentHistoryComponent {

  form: FormGroup;
  selectedYear = "";
  selectedMonth = "";
  paymentStatusDetails: any;
  paymentStatusDetail: any;
  paymentStatusDetailsTable = [];
  isLoading: boolean;
  isSessionExpired: boolean;

  constructor(public meetupService: MeetupService, fb: FormBuilder, public router: Router) {
    this.selectedYear = "" + (new Date()).getFullYear();
    this.selectedMonth = "" + ((new Date()).getMonth() + 1);

  }

  ngOnInit() {
    this.getPaymentReport();
  }

  getPaymentReport() {
    this.paymentStatusDetail = [];
    this.paymentStatusDetailsTable = [];
    let isOnline: boolean = navigator.onLine;
    if (isOnline == false) {
      alert("You are offline. Please check your network.");
    } else {
      this.isLoading = true;
      this.meetupService.getPaymentReport(this.selectedMonth, this.selectedYear).subscribe(response => {
        this.isLoading = false;
        let responsecode = response.headers.get('responsecode');

        if (responsecode == "2611") {

          this.paymentStatusDetails = JSON.parse(response.text());
          this.paymentStatusDetail = this.paymentStatusDetails[0];
          for (let index = 1; index < this.paymentStatusDetails.length; index++) {
            this.paymentStatusDetailsTable.push(this.paymentStatusDetails[index]);

          }
        }
        else if (responsecode == "2612") {

          this.meetupService.popupMessage = "Payment read failur.";
          this.meetupService.isWarningPopup = true;
          this.meetupService.isShowPopup = true;
        } else if (responsecode == "9996") {
          this.meetupService.popupMessage = "User is not allowed to perform this action.";
          this.meetupService.isWarningPopup = true;
          this.meetupService.isShowPopup = true;
        } else if (responsecode == "9999") {
          if (!this.meetupService.isInvalidSessionPopupDisplayed) {
            this.meetupService.isInvalidSessionPopupDisplayed = true;
            this.meetupService.popupMessage = "Your session has expired. Please login again.";
            this.meetupService.isWarningPopup = true;
            this.meetupService.isShowPopup = true;
            this.isSessionExpired = true;
          }
        }
      }, (error) => {
        this.isLoading = false;
        if (error.status == 500) {
          this.meetupService.popupMessage = "Internal server error";
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
        } else if (error.status == 400) {
          this.meetupService.isWarningPopup = true;
          this.meetupService.isShowPopup = true;
          this.meetupService.popupMessage = "Bad request";
        } else if (error.status == 401) {
          this.meetupService.isWarningPopup = true;
          this.meetupService.isShowPopup = true;
          this.meetupService.popupMessage = "Unauthorized";
        } else if (error.status == 403) {
          this.meetupService.isWarningPopup = true;
          this.meetupService.isShowPopup = true;
          this.meetupService.popupMessage = "Forbidden";
        } else if (error.status == 404) {
          this.meetupService.isWarningPopup = true;
          this.meetupService.isShowPopup = true;
          this.meetupService.popupMessage = "Not Found";
        } else {
          this.meetupService.isWarningPopup = true;
          this.meetupService.isShowPopup = true;
          this.meetupService.popupMessage = 'Something went wrong in server.';
        }
      })
    }
  }


  // listOfLocalities;
  // form: FormGroup;
  // listOfpaymentHistory = [];
  // pdfData: string;
  // isLoadingData;
  // paymentStatus: number = 1;  //received and refund status
  // noRecordFound: boolean;  // no data available in api result
  // errorMsz: string = '';
  // isSessionExpired: boolean;
  // csvExportOptions = {
  //   showLabels: true,
  //   headers: ['Date,Facility Title,Facility Type,Building Name,City,Locality,Payment,Consumer Name,Service Provider']
  // };
  // constructor(public meetupService: MeetupService, fb: FormBuilder, public router: Router) {
  //   this.form = fb.group({
  //     selectCity: ['0', Validators.required],
  //     selectLocality: ['0', Validators.required],
  //     selectFacility: ['0', Validators.required],
  //     month: ['0', Validators.required]
  //   });
  //   this.getPaymentHistory();
  // }

  // getlocalityDataBasedOnSelectedCity() {
  //   let cityId = this.form.controls['selectCity'].value;
  //   this.meetupService.getLocalities(cityId).subscribe(res => {
  //     this.listOfLocalities = res;
  //   });

  // }

  // getPaymentHistory() {
  //   this.errorMsz = '';
  //   let isOnline: boolean = navigator.onLine;
  //   if (isOnline == false) {
  //     this.errorMsz = 'You are offline. Please check your network';
  //   } else {
  //     this.isLoadingData = true;
  //     this.noRecordFound = false;
  //     let cityId = this.form.controls['selectCity'].value != '' ? this.form.controls['selectCity'].value : 0;
  //     let localityId = this.form.controls['selectLocality'].value != '' ? this.form.controls['selectLocality'].value : 0;
  //     let facilityType = this.form.controls['selectFacility'].value != '' ? this.form.controls['selectFacility'].value : 0;
  //     let month = this.form.controls['month'].value != '' ? this.form.controls['month'].value : 0;
  //     this.meetupService.getPaymentHistory(cityId, localityId, facilityType, month, this.paymentStatus).subscribe(response => {
  //       let responseCode = response.headers.get('ResponseCode');
  //       this.isLoadingData = false;
  //       let result = JSON.parse(response.text());
  //       switch (responseCode) {
  //         case '2611':
  //           this.listOfpaymentHistory = result;
  //           this.pdfData = result.toString();
  //           if (this.listOfpaymentHistory.length == 0) {
  //             this.noRecordFound = true;
  //           }
  //           break;
  //         case '2612':
  //           this.errorMsz = 'There is some technical problem. Please contact administrator.';
  //           break;

  //         case ('9999'):
  //           if (!this.meetupService.isInvalidSessionPopupDisplayed) {

  //             this.meetupService.isShowPopup = true;
  //             this.meetupService.isWarningPopup = true;
  //             this.meetupService.popupMessage = 'Your session has expired. Please login again.';
  //             this.isSessionExpired = true;
  //             this.meetupService.isInvalidSessionPopupDisplayed = true;
  //           }
  //           break;
  //         default:
  //           if (!this.meetupService.isInvalidSessionPopupDisplayed) {

  //             this.meetupService.isShowPopup = true;
  //             this.meetupService.isWarningPopup = true;
  //             this.meetupService.popupMessage = 'Unknown Error Code' + responseCode;
  //             this.isSessionExpired = false;
  //           }
  //           break;
  //       }




  //     },
  //       (error) => {
  //         this.isLoadingData = false;
  //         if (error.status == 500) {
  //           this.errorMsz = 'Internal Server Error';


  //         } else {
  //           this.errorMsz = 'Something went wrong in server.';

  //         }
  //       });
  //   }
  // }
  // exportToCSV() {
  //   new Angular2Csv(this.listOfpaymentHistory, 'Payment Report', this.csvExportOptions);
  // }
  // exportToPDF() {
  //   let columns = ["Date", "Facility Type", "Facility Title", "Building Name", "Consumer Name", "City", "Locality", "Payment"];
  //   let arrayData: any = [];
  //   let finalPDfData: any = []

  //   this.listOfpaymentHistory.forEach(function (key, value) {
  //     arrayData.push([key.date, key.facilityType, key.title, key.buildingName, key.consumerName, key.city, key.locality, key.payment]);


  //   });

  //   let doc = new jsPDF();
  //   doc.autoTable(columns, arrayData);
  //   doc.save('Payment Report.pdf');
  // }
  // refundSelected() {
  //   this.paymentStatus = 0;
  //   this.getPaymentHistory();
  // }
  // receivedSelected() {
  //   this.paymentStatus = 1;
  //   this.getPaymentHistory();
  // }
  closePopup(type) {
    if (type == "1") {
      this.meetupService.isShowPopup = false;
      this.meetupService.forceLogoutWithoutSessionId();
      this.router.navigate(['']);
    }
    else if (type == "0") {
      this.meetupService.isShowPopup = false;

    }

  }
}