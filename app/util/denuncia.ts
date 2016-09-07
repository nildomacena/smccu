
var google:any;
export class Denuncia{
    
    constructor(private description:string, private category:string, private latitude, private longitude, private address, private photos?){

    }

    setLatLng(data){

    }

    getAdress(data){
    let latLng = new google.maps.LatLng(data.lat, data.lng);
    let geocoder = new google.maps.Geocoder;
    geocoder.geocode({location : latLng}, (results, status) => {
      if(status === google.maps.GeocoderStatus.OK){
        if(results[0]){
          this.address.numero = results[0].address_components[0].long_name;
          this.address.logradouro = results[0].address_components[1].short_name;
          this.address.bairro = results[0].address_components[2].long_name;
          this.address.cep = results[0].address_components[7].long_name;
          this.address.enderecoFormatado = results[0].formatted_address;
          console.log(this.address);
          setTimeout(()=>{ 
            document.getElementById("button").click();
            console.log(results[0].formatted_address);
          }, 200);         
        }
      }
    });
  }
}