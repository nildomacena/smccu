import { Component } from '@angular/core';
import { NavController, ViewController, Alert, Modal } from 'ionic-angular';
import {Camera, Geolocation } from 'ionic-native';
import {MapPage} from '../map/map';


@Component({
  templateUrl: 'build/pages/denuncia/denuncia.html',
})
export class DenunciaPage {

  title: string;
  description: string;
  address: string;
  options:any = { };
  constructor(private nav:NavController, private viewController: ViewController) {

  }

  dismiss(){
    this.viewController.dismiss();
  }


  goToMap(){
    let mapModal = Modal.create(MapPage);
    this.nav.present(mapModal);    
    mapModal.onDismiss(data => {
     this.address = "lat: " + data.lat + "\nlng: "+data.lng;
   });
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
