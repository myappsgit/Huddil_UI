import { Component,Input } from '@angular/core';

@Component({
    selector:'rating',
    templateUrl:'rating.component.html',
    styleUrls :['rating.component.css']
})

export class RatingComponent
{
   @Input() ratingValue;
 }