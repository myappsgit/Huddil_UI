import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdminService } from '../../../admin-providers/admin.services';

@Component({
  selector: 'user-info-component',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  @Input() userInfoObject_Input;
  @Input() spCommissionObject_Input;
  @Output() activateOrBlockUser_Output = new EventEmitter;
  @Output() updateSpCommission_Output = new EventEmitter;

  isUserActive: boolean;
  message: string;

  activeStatus: string;
  forActive: boolean;

  buttonText = "";
  buttonTitleText = "";

  displayHuddilCommission: boolean = false;

  currentMonthCommission = "-";
  nextMonthCommission = "-";

  newSpCommissionNgModel: any;

  huddilCommissionErrorMessage = "";

  constructor(public adminService: AdminService) { }

  ngOnInit() {
    //console.log(this.userInfoObject_Input);

    // console.log(this.spCommissionObject_Input);

    // if (this.userInfoObject_Input.userType == 7 && this.spCommissionObject_Input != null && this.spCommissionObject_Input.length != 0) {
    //   this.spCommissionObject_Input.forEach(element => {
    //     if (element.spUserId == this.userInfoObject_Input.id) {
    //       // console.log("Commission->>>" + element.currentMonthCommission);
    //       this.currentMonthCommission = element.currentMonthCommission;
    //       this.nextMonthCommission = element.nextMonthCommission;
    //       this.newSpCommissionNgModel = this.nextMonthCommission;

    //       console.log("nextMonthCommission:" + this.nextMonthCommission);
    //     }
    //   });

  }

  ngOnChanges() {

    if (this.userInfoObject_Input.userType == 7 && this.spCommissionObject_Input != null && this.spCommissionObject_Input.length != 0) {
      this.spCommissionObject_Input.forEach(element => {
        if (element.spUserId == this.userInfoObject_Input.id) {
          // console.log("Commission->>>" + element.currentMonthCommission);
          this.currentMonthCommission = element.currentMonthCommission;
          this.nextMonthCommission = element.nextMonthCommission;
          this.newSpCommissionNgModel = this.nextMonthCommission;

          //console.log("nextMonthCommission:" + this.nextMonthCommission);
        }
      });
    }

    //User Status-Changed on-2.2.2018 Tuesday
    //-1 => Account not activated
    //0 => Account active. Email verifided. Mobile number not verified
    //1 => Account active. Email and Mobile both verified
    //2 => Account blocked. Mobile not verified
    //3 => Account blocked. Email and Mobile both verified

    if (this.userInfoObject_Input.active == 0 || this.userInfoObject_Input.active == 1) {
      this.isUserActive = true;//The user is active
      this.buttonText = "Active";
      this.buttonTitleText = "Click to block the user";

    } else if (this.userInfoObject_Input.active == 2 || this.userInfoObject_Input.active == 3) {
      this.isUserActive = false;//The user is blocked
      this.buttonText = "Blocked";
      this.buttonTitleText = "Click to activate the user";
    }

    if (this.userInfoObject_Input.userType == 7) { //Service Provider
      this.displayHuddilCommission = true;
    } else { // Consumer or Advisor
      this.displayHuddilCommission = false;
    }

    if (this.userInfoObject_Input.currentMonthCommission) {
      this.currentMonthCommission = this.userInfoObject_Input.currentMonthCommission;
    }
  }

  activateOrBlockUser(userId, status) {

    if (status == 0 || status == 1) {//User is active. So, block the user.

      this.deActivateUser(userId, true, "Blocked by the admin.");

    } else if (status == 2 || status == 3) {//User is blocked. So, activate the user.

      this.deActivateUser(userId, false, "Activated by the admin.");

    }

  }

  deActivateUser(userId, blockUser: boolean, comments) {

    let data = {
      "userId": userId,
      "blockUser": blockUser,
      "comments": comments
    };

    this.activateOrBlockUser_Output.emit(data);

  }

  updateSpCommission(userId) {

    console.log("From updateSpCommission()userId:" + userId + "newSpCommission:" + this.newSpCommissionNgModel);

    if (this.newSpCommissionNgModel == null) {
      // alert("Please enter valid number.");
      this.huddilCommissionErrorMessage = "Please enter valid number.";
    }
    //else if (this.newSpCommissionNgModel == this.nextMonthCommission) {
    // alert("No change in the commission.");
    //this.huddilCommissionErrorMessage = "No change in the commission.";
    //} 
    else if (this.newSpCommissionNgModel < 0) { //Gopi: I think, we can allow 0 % commission.(As a special offer to sp.)
      // alert("Commission should not be a negative number.");
      this.huddilCommissionErrorMessage = "Should not be a negative no.";
    } else if (this.newSpCommissionNgModel >= 100) {
      // alert("Commission should not be less than 100%.");
      this.huddilCommissionErrorMessage = "Should not be less than 100%.";
    } else {
      this.huddilCommissionErrorMessage = "";
      let data = {
        "userId": userId,
        "commission": this.newSpCommissionNgModel
      };

      this.updateSpCommission_Output.emit(data);
    }

  }

}
