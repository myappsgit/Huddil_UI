import { Component } from '@angular/core';
import { AdminService } from '../../admin-providers/admin.services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'payments',
  templateUrl: 'admin-payments.component.html',
  styleUrls: ['admin-payments.component.css']
})
export class AdminPaymentsComponent {

  cityArray: any;
  showPaymentStatus: boolean = false;
  showSPListTable: boolean = false;
  showSPDetailsTable: boolean = false;
  errorMessage: string;
  showPaymentErrorMessage: boolean;
  searchResult: any;
  paymentStatusDetails: any;;
  paymentDetailsForAllSPsMathcingSearchText = [];
  paymentDetailsForOneSP = [];
  showPopUp: boolean;

  form: FormGroup;

  selectedMonth: string = "";
  selectedYear: string = "";
  selectedCity: string = "";
  serviceProviderSearchText: string = "";

  rowSpanValue = 3;

  tableHeadingText = "";

  showNoDataMessageContainer: boolean;

  constructor(public adminService: AdminService, fb: FormBuilder, private _router: Router) {
    this.form = fb.group({
      month: ['', Validators.required],
      year: ['', Validators.required],
      locationName: [''],
      serviceProviderSearchText: ['']
    })
  }

  ngOnInit() {
    this.getCitiesList();

    //Gopi: Without these lines, All Cities is not getting selected by default.
    this.form.controls['locationName'].setValue("0");
    this.form.controls['locationName'].valueChanges;
  }

  getCitiesList() {
    let isOnline: boolean = navigator.onLine;

    if (isOnline == false) {
      alert("You are offline. Please check your network.");
    } else {
      this.adminService.isLoading = true;
      this.adminService.getListOfCities().subscribe(res => {
        this.adminService.isLoading = false;
        let responsecode = res.headers.get('responsecode');
        if (responsecode == "2231") {

          this.cityArray = JSON.parse(res.text());
        } else if (responsecode == "2232") {

          this.adminService.popupMessage = "City read failur.";
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
        } else if (responsecode == "9996") {
          this.adminService.popupMessage = "User is not allowed to perform this action.";
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
        } else if (responsecode == "9999") {
          if (!this.adminService.isInvalisSessionPopup) {
            this.adminService.isInvalisSessionPopup = true;
            this.adminService.popupMessage = "Your session has expired. Please login again.";
            this.adminService.isWarningPopup = true;
            this.adminService.isShowPopup = true;
          }
        }
      }, (error) => {
        this.adminService.isLoading = false;
        if (error.status == 500) {
          this.adminService.popupMessage = "Internal server error";
          this.adminService.isShowPopup = true;
          this.adminService.isWarningPopup = true;
        } else if (error.status == 400) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Bad request";
        } else if (error.status == 401) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Unauthorized";
        } else if (error.status == 403) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Forbidden";
        } else if (error.status == 404) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Not Found";
        } else {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = 'Something went wrong in server.';
        }
      });
    }
  }

  searchSpPaymentDetails() {
    // if (this.form.controls['month'].value == "" || this.form.controls['year'].value == "" || this.form.controls['locationName'].value == "" || this.form.controls['serviceProviderSearchText'].value == "") {
    // if (this.form.controls['month'].value == "" || this.form.controls['year'].value == "" || this.form.controls['locationName'].value == "") {
    if (this.form.controls['month'].value == "" || this.form.controls['year'].value == "") {
      this.showPaymentErrorMessage = true;
      this.errorMessage = "Please select month & year."
      this.showPaymentStatus = false;
      this.showSPListTable = false;
      this.showSPDetailsTable = false;
    } else {
      this.showPaymentErrorMessage = false;
      this.errorMessage = "";

      this.selectedMonth = this.form.controls['month'].value;// ? this.form.controls['month'].value : 1;
      this.selectedYear = this.form.controls['year'].value;// ? this.form.controls['year'].value : 2018;
      this.selectedCity = this.form.controls['locationName'].value;
      this.serviceProviderSearchText = this.form.controls['serviceProviderSearchText'].value;// ? this.form.controls['serviceProviderSearchText'].value : 0;

      this.getPaymentStatusBySearch();
    }
  }

  getPaymentStatusBySearch() {
    let isOnline: boolean = navigator.onLine;

    if (isOnline == false) {
      alert("You are offline. Please check your network.");
    } else {
      this.adminService.isLoading = true;
      this.paymentDetailsForAllSPsMathcingSearchText = [];
      this.adminService.getPaymentStatusBySearch(this.selectedYear, this.selectedMonth, this.selectedCity, this.serviceProviderSearchText, 0).subscribe(res => {
        this.adminService.isLoading = false;
        let responsecode = res.headers.get('responsecode');
        if (responsecode == "4003") {

          this.searchResult = JSON.parse(res.text());
          this.displayTables();
        } else if (responsecode == "9996") {
          this.adminService.popupMessage = "User is not allowed to perform this action.";
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
        } else if (responsecode == "9999") {
          if (!this.adminService.isInvalisSessionPopup) {
            this.adminService.isInvalisSessionPopup = true;
            this.adminService.popupMessage = "Your session has expired. Please login again.";
            this.adminService.isWarningPopup = true;
            this.adminService.isShowPopup = true;
          }
        }
      }, (error) => {
        this.adminService.isLoading = false;
        if (error.status == 500) {
          this.adminService.popupMessage = "Internal server Error";
          this.adminService.isShowPopup = true;
          this.adminService.isWarningPopup = true;
        } else if (error.status == 400) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Bad request";
        } else if (error.status == 401) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Unauthorized";
        } else if (error.status == 403) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Forbidden";
        } else if (error.status == 404) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Not Found";
        } else {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = 'Something went wrong in server.';
        }
      });
    }
  }

  displayTables() {
    if (this.searchResult.length == 1) {

      this.showNoDataMessageContainer = true;

      this.showPaymentStatus = false;
      this.showSPListTable = false;
      this.showSPDetailsTable = false;

    } else {

      this.showNoDataMessageContainer = false;

      this.paymentStatusDetails = this.searchResult[0];


      for (let index = 1; index < this.searchResult.length; index++) {
        this.paymentDetailsForAllSPsMathcingSearchText.push(this.searchResult[index]);
      }
      this.showPaymentStatus = true;
      this.showSPListTable = true;
      this.showSPDetailsTable = false;
    }
  }

  getPaymentStatusById(spId) {
    let isOnline: boolean = navigator.onLine;

    if (isOnline == false) {
      alert("You are offline. Please check your network.");
    } else {
      this.adminService.isLoading = true;
      this.paymentDetailsForOneSP = [];
      this.adminService.getPaymentStatusBySearch(this.selectedYear, this.selectedMonth, this.selectedCity, this.serviceProviderSearchText, spId).subscribe(res => {
        this.adminService.isLoading = false;
        let responsecode = res.headers.get('responsecode');
        if (responsecode == "4003") {

          this.searchResult = JSON.parse(res.text());
          if (this.searchResult.length == 1) {
            alert("No data for the search.");
          } else {
            this.paymentStatusDetails = this.searchResult[0];


            for (let index = 1; index < this.searchResult.length; index++) {
              this.paymentDetailsForOneSP.push(this.searchResult[index]);
            }
          }
          console.log(this.paymentDetailsForOneSP);
        } else if (responsecode == "9996") {
          this.adminService.popupMessage = "User is not allowed to perform this action.";
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
        } else if (responsecode == "9999") {
          if (!this.adminService.isInvalisSessionPopup) {
            this.adminService.isInvalisSessionPopup = true;
            this.adminService.popupMessage = "Your session has expired. Please login again.";
            this.adminService.isWarningPopup = true;
            this.adminService.isShowPopup = true;
          }
        }
      }, (error) => {
        this.adminService.isLoading = false;
        if (error.status == 500) {
          this.adminService.popupMessage = "Internal server error";
          this.adminService.isShowPopup = true;
          this.adminService.isWarningPopup = true;
        } else if (error.status == 400) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Bad request";
        } else if (error.status == 401) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Unauthorized";
        } else if (error.status == 403) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Forbidden";
        } else if (error.status == 404) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Not Found";
        } else {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = 'Something went wrong in server.';
        }
      });
    }
  }

  getSPDetails(spId, spName) {

    this.tableHeadingText = spName + " - Payment Details";

    this.showSPDetailsTable = true;
    this.showSPListTable = false;
    // let index= this.paymentDetailsForAllSPsMathcingSearchText.findIndex(val=>val.id==id)
    // alert(index);

    this.getPaymentStatusById(spId);
  }

  goToPreviousPage() {
    this.showSPDetailsTable = false;
    this.showSPListTable = true;
  }
}