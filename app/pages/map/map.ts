import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, Alert } from 'ionic-angular';
import { Geolocation} from 'ionic-native';

declare var google: any;

@Component({
  templateUrl: 'build/pages/map/map.html',
})

export class MapPage {
  markers: any[];
  constructor(private nav: NavController, private navParams: NavParams, private viewController: ViewController) {
    this.markers = [];
  }
  
  ionViewLoaded(){
    Geolocation.getCurrentPosition().then((resp) => { 
      this.setMap(resp.coords.latitude, resp.coords.longitude);
    });
  }

  setMap(lat, lng){
    let latLng = new google.maps.LatLng(lat, lng);
    let mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    let element = document.getElementById("map");
    let map = new google.maps.Map(element, mapOptions);

    this.addMarker(map, latLng);

    google.maps.event.addListener(map, 'click', (event) => {
      this.addMarker(map, event.latLng);
    });
  }

  addMarker(map: any, latLng: any){
      let marker = new google.maps.Marker({
        position: latLng
      });

      if(this.markers.length == 0){
        this.markers.push(marker);
        this.markers[0].setMap(map);
        
      }

      else{
        let lastMarker = this.markers.length - 1; 
        this.markers[lastMarker].setMap(null);
        this.markers.push(marker);
        this.markers[lastMarker + 1].setMap(map); 
        console.log(this.markers[0].position.lat());
      }    
    }

    backToDenuncia(){
       let lastMarker = this.markers.length - 1;
       let latLng = {
         lat : this.markers[lastMarker].position.lat(),
         lng : this.markers[lastMarker].position.lng()
       }
       this.viewController.dismiss(latLng);
    }
}
