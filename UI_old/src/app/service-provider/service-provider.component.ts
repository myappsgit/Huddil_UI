import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.css']
})
export class ServiceProviderComponent {
  constructor(public router: Router) {
    //this.router.navigate(['/service-provider/dashboard']);
  }
}
