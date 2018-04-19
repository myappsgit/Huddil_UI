import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(public router: Router) {

    //this.router.navigate(['/admin', { outlets: { 'admin': 'admin-dashboard' } }]);
    this.router.navigate(['/admin/admin-dashboard']);
  }

}
