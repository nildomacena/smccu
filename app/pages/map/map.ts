import { Component } from '@angular/core';
import { NavController, NavParams, Alert } from 'ionic-angular';
import { Geolocation} from 'ionic-native';

declare var google: any;

@Component({
  templateUrl: 'build/pages/map/map.html',
})

export class MapPage {

  constructor(private nav: NavController, private navParams: NavParams) {

  }
  
  ionViewLoaded(){
    Geolocation.getCurrentPosition().then((resp) => { 
      this.setMap(resp.coords.latitude, resp.coords.longitude);
    });
  }
/*
  função para obter o endereço formatado
  getAddress(){
    let geocoder = new google.maps.Geocoder();
  }*/
  setMap(lat, lng){
    let latLng = new google.maps.LatLng(lat, lng);
    let mapOptions = {
      center: latLng,
      zoom: 18
    }
    let element = document.getElementById("map");
    let map = new google.maps.Map(element, mapOptions);
  }
}
