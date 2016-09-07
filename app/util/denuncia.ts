
declare var google:any;
export class Denuncia{
    
    constructor(private description?:string, private category?:string, private latitude?, private longitude?, private address?, private photos?){

    }

    setLatLng(data){
      this.latitude = data.lat;
      this.longitude = data.lng;
    }

    getAddress(){
    let latLng = new google.maps.LatLng(this.latitude, this.longitude);
    let geocoder = new google.maps.Geocoder;
    return new Promise (function (resolve, reject){
      geocoder.geocode({location : latLng}, (results, status) => {
        if(status === google.maps.GeocoderStatus.OK){
          if(results[0]){
            resolve(results[0]);         
          }
        }
      })
    });
  }
}