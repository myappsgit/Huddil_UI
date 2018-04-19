import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { FacebookService } from '../../social-authentication/facebook.service';
import { GoogleService } from '../../social-authentication/google.service';
import { MeetupService } from '../../provider/meetup.service';

@Component({
  selector: 'partner-signup-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class ServiceProviderSignupHeaderComponent {

  form: FormGroup;

  IsShowAddIpBox: boolean;

  constructor(public fb: FormBuilder, public meetUpService: MeetupService) {
    this.form = fb.group({
      wrapper: [''
        , Validators.required],
      huddil: [''
        , Validators.required]
    })
  }

  showAddIpBox() {
    this.IsShowAddIpBox = true;


  }
  addAPI() {
    let wrapperAPI = this.form.controls['wrapper'].value;
    let huddilAPI = this.form.controls['huddil'].value;
    this.meetUpService.huddil_baseUrl = huddilAPI;
    this.meetUpService.wrapper_baseUrl = wrapperAPI;
    if (typeof (Storage) !== 'undefined') {
      sessionStorage.setItem('huddilAPI', huddilAPI);
      sessionStorage.setItem('wrapperAPI', wrapperAPI);

      this.meetUpService.wrapper_baseUrl = wrapperAPI;
      this.meetUpService.huddil_baseUrl = huddilAPI;

    }
    this.IsShowAddIpBox = false;
  }
  closeAddIpBox() {
    this.IsShowAddIpBox = false;
  }

}