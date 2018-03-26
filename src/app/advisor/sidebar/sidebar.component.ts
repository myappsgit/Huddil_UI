import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'advisor-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css']
})
export class AdvisorSideBarComponent {
 
 constructor(public router:Router)
 {

 } 
 

}
