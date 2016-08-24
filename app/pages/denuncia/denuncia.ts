import { Component, ElementRef, Renderer } from '@angular/core';
import { NavController, ViewController, Alert, Modal } from 'ionic-angular';
import {Camera, Geolocation } from 'ionic-native';
import {MapPage} from '../map/map';

declare var google: any;

@Component({
  templateUrl: 'build/pages/denuncia/denuncia.html',
})
export class DenunciaPage {

  title: string;
  description: string;
  address: string = "";
  options:any = { };
  element:any;
  btnAtualiza: boolean = false;
  constructor(private nav:NavController, private viewController: ViewController) {

  }

  dismiss(){
    this.viewController.dismiss();
  }


  goToMap(){
    let mapModal = Modal.create(MapPage);
    this.nav.present(mapModal);    
    mapModal.onDismiss(data => {
      if(data)
        this.getAdress(data);
   });
  }

  getAdress(data){
    let latLng = new google.maps.LatLng(data.lat, data.lng);
    let geocoder = new google.maps.Geocoder;
    geocoder.geocode({location : latLng}, (results, status) => {
      if(status === google.maps.GeocoderStatus.OK){
        if(results[0]){
          this.address = results[0].formatted_address;
          setTimeout(()=>{ 
            this.atualiza();
            console.log(results[0].formatted_address);
          }, 200);
          
        }
      }
    });
  }

  atualiza(){
    document.getElementById("button").click();


  }
  setAdress(address: string){
    this.address = address;
    console.log(this.address);
  }

  takePicture(){
    Camera.getPicture(this.options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
    let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    // Handle error
    });
  }

  save(){
    if(!this.address || !this.description || !this.title){
      let alert = Alert.create({
        title: 'Dados incompletos',
        subTitle: 'Por favor, complete o formulário com os dados obrigatórios',
        buttons: [
        {
          text: 'OK',
          handler: () => {
            this.goToMap();
          } 
        }]
      });
      this.nav.present(alert);
    }
    else{
     let confirm = Alert.create({
      title: 'Confirmar denúncia',
      message: 'Deseja confirmar a denúncia com os seguintes dados?<br>Título: '+this.title+'<br>Descrição: '+this.description
       +'<br>Endereço: '+this.address,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            setTimeout(() => this.alertSuccess(), 2000); 
          }
        }
      ]
    });
      this.nav.present(confirm);     
    }
  }
  alertSuccess(){
    let alert = Alert.create({
      title: 'Denúncia Registrada com sucesso',
      subTitle: 'Caso deseje receber o comprovante por email, digite-o no campo abaixo',
      inputs: [{
        type: 'email',
        name: 'email',
        placeholder: 'Email'  
      }],
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('Agree clicked');
          } 
        }]
     })
    this.nav.present(alert);
  }
}
