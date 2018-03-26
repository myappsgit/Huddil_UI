import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Output() refreshPageWithFacilityType_Output = new EventEmitter();
  @Output() refreshPageWithCity_Output = new EventEmitter();
  @Input() listingPage = false;

  isListingPage;

  constructor(public router: Router, public meetupService: MeetupService) {

  }

  ngOnInit() {
    if (this.listingPage == true) {
      this.isListingPage = true;
    }
    else {
      this.isListingPage = false;
    }
  }
  goToListingpage(typeId) {

    this.refreshPageWithFacilityType_Output.emit(typeId);
  }

  goToListingWithCity(cityId) {
    this.refreshPageWithCity_Output.emit(cityId);

  }

  goToListingpage_route(typeId) {
    this.router.navigate(['/consumer/facility-listing/0/0/' + typeId]);
  }
  goToListingWithCity_route(cityId) {
    this.router.navigate(['/consumer/facility-listing/' + cityId + '/0/0']);
  }
  showHowItWorksPopUp() {
    this.meetupService.isShowHowItWorksPopup = true;
  }
}
