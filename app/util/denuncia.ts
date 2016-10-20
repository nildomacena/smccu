
declare var google:any;
export class Denuncia{
    
    constructor(private description?:string, private category?:string, private latitude?, private pntRef?:string, private longitude?){

    }

    setPosition(data, pntRef){
      this.latitude = data.lat;
      this.longitude = data.lng;
      this.pntRef = pntRef;
    }

  getAddress(){
    let latLng = new google.maps.LatLng(this.latitude, this.longitude);
    let geocoder = new google.maps.Geocoder;
    return new Promise ((resolve, reject) => {
      geocoder.geocode({location : latLng}, (results, status) => {
        if(status === google.maps.GeocoderStatus.OK){
          if(results[0]){
            resolve({endereco: results[0], pntRef: this.pntRef});         
          }
        }
      })
    });
  }

  save(denuncia){
    
  }

  setInformation(description: string, category: string, images?: any[]){
    this.description = description;
    this.category = category;
  }


}