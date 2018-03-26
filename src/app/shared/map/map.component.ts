import { Component, Input } from '@angular/core';
import { getNearBy } from '../../../assets/js/customMap.js';

declare var jQuery: any;

@Component({
  selector: 'map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent {
  @Input() moduleName;
  @Input() mapInfo;


  ngOnInit() {
    getNearBy(this.mapInfo.latitude, this.mapInfo.longtitude, 'none', this.mapInfo.title, this.mapInfo.title);
  }
  changeNearbyOption() {
    let type = jQuery('#details_nearby_select').val();

    getNearBy(this.mapInfo.latitude, this.mapInfo.longtitude, type, this.mapInfo.title, this.mapInfo.title);
  }
}
