import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { RatingComponent } from './rating/rating.component';
import { PaginationComponent } from './pagination/pagination.component';
import { HuddilCalendarComponent } from './huddil-calendar-component/huddil-calendar.component';

import { HuddilCalendarService } from './huddil-calendar-component/huddil-calendar.service';
import { MapComponent } from './map/map.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { HuddilDropdownComponent } from './huddil-dropdown-component/huddil-dropdown.component';

@NgModule({
  declarations: [
    RatingComponent, PaginationComponent, HuddilCalendarComponent, MapComponent, ImageSliderComponent,
    ReviewsComponent, HuddilDropdownComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RatingComponent, PaginationComponent, HuddilCalendarComponent, MapComponent, ImageSliderComponent,
    ReviewsComponent, HuddilDropdownComponent
  ],
  providers: [HuddilCalendarService],
  bootstrap: []
})
export class SharedModule { }
