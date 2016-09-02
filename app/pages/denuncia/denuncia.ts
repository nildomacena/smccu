import { Component, ElementRef, Renderer } from '@angular/core';
import { NavController, ViewController, Alert, Modal } from 'ionic-angular';
import {Camera, Geolocation } from 'ionic-native';
import {MapPage} from '../map/map';
import {Fire} from '../../util/fire';

declare var google: any;

@Component({
  templateUrl: 'build/pages/denuncia/denuncia.html',
})
export class DenunciaPage {

  title: string;
  description: string;
  options:any = { };
  element:any;
  categorias: any;
  catSelected:any;

  address = {
    numero: "",
    logradouro: "",
    bairro: "",
    cep: "",
    enderecoFormatado: ""
  };
  constructor(private nav:NavController, private viewController: ViewController, private fire: Fire) {  
  }

  ionViewLoaded(){
    this.fire.getCategorias().on('value', snapshot => {
      this.categorias = snapshot.val();
    });
  }

  //Fecha o modal
  dismiss(){
    this.viewController.dismiss();
  }


  //Cria um modal para o mapa e ao fechar esse modal traz os dados para a páginad de denúncia
  goToMap(){
    let mapModal = Modal.create(MapPage);
    this.nav.present(mapModal);    
    mapModal.onDismiss(data => {
      if(data)
        this.getAdress(data);
   });
  }


  //Recebe os dados da localização (lat, lng) do usuário e formata o endereço
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


  //tira as fotos do local
  takePicture(){
    Camera.getPicture(this.options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
    let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    // Handle error
    });
  }


  //Chamada quando o botão de salvar é clicado
  save(){
    if(!this.address || !this.description || !this.title){
      let alert = Alert.create({
        title: 'Dados incompletos',
        subTitle: 'Por favor, complete o formulário com os dados obrigatórios',
        buttons: [
        {
          text: 'OK',
          handler: () => {
            alert.dismiss();
          } 
        }]
      });
      this.nav.present(alert);
    }
    else{
     let confirm = Alert.create({
      title: 'Confirmar denúncia',
      message: 'Deseja confirmar a denúncia com os seguintes dados?<br>Título: '+this.title+'<br>Descrição: '+this.description
       +'<br>Endereço: '+this.address.enderecoFormatado+'<br>Categoria da denúncia: '+this.catSelected,
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

  //Caso todas as informações sejam preechidas corretamente essa função abre um alerta 
  //onde será possível para o usuário colocar seu email e receber alguma informação sobre a denúncia
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
            this.viewController.dismiss();
          } 
        }]
     })
    this.nav.present(alert);
  }
}
