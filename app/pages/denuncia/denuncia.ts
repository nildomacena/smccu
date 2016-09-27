import { Component, ElementRef, Renderer } from '@angular/core';
import { NavController, ViewController, Alert, AlertInputOptions ,  Modal, Platform } from 'ionic-angular';
import { Camera, Geolocation, Diagnostic} from 'ionic-native';
import { MapPage } from '../map/map';
import { Fire, Denuncia } from '../../util';

declare var google:  any;
declare var cordova: any;
@Component({
  templateUrl: 'build/pages/denuncia/denuncia.html',
})

export class DenunciaPage {

  denuncia: Denuncia = new Denuncia();
  description: string;
  options:any = { };
  element:any;
  categorias: any;
  catSelected:any;
  //endereco:any;
  images: string[];
  address = {
    numero: "",
    logradouro: "",
    bairro: "",
    cep: "",
    enderecoFormatado: "",
    pntRef: ""
  }

  constructor(private platform: Platform, private nav:NavController, private viewController: ViewController, private fire: Fire) {
    this.images = [];
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

goToMap(){
    let mapModal = Modal.create(MapPage);
    Diagnostic.isGpsLocationEnabled()
      .then(result => {  //Primeiro argumento é para o caso do GPS está habilitado
        if(result){      // Result pode ser True ou False
          this.nav.present(mapModal);    
          mapModal.onDismiss(data => {
            let alertPtRef = Alert.create({
              title: 'Ponto de referência',
              subTitle: 'Digite o ponto de referência',
              inputs:[{
                type: 'text',
                name: 'referencia'
              }],
              buttons: [{
                text: 'Ok',
                handler: () => {
                  alertPtRef.dismiss().then(value => {
                    if(data){
                      this.denuncia.setPosition(data, alertPtRef.data.inputs[0].value);
                      this.getAddress();
                    }
                  })
                }
              }]
            });
            this.nav.present(alertPtRef);
          });
          
        }

        else{
          let alert = Alert.create({
          title: 'O sinal de GPS está desabilitado',
          subTitle: 'Deseja habilitar o GPS?',
          buttons: [
            {
              text: 'Habilitar GPS',
              handler: () => {
                cordova.plugins.locationAccuracy.request(
                  () => {
                    this.nav.present(mapModal);    
                    mapModal.onDismiss(data => {
                      if(data){
                        let alertPtRef = Alert.create({
                          title: 'Ponto de referência',
                          subTitle: 'Digite o ponto de referência da ocorrência',
                          inputs:[{
                            type: 'text',
                            name: 'referencia' 
                          }],
                          buttons: [{
                            text: 'Ok',
                            handler: () => {
                              alertPtRef.dismiss().then(value => {
                                if(data){
                                  this.denuncia.setPosition(data, alertPtRef.data.inputs[0].value);
                                  this.getAddress();
                                }
                              })
                            }
                          }]
                        });
                        this.nav.present(alertPtRef);
                      }
                    });  
                  },
                  (error) => console.log("Something went wrong",error),
                  cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
                );
              } 
            },
            {
              text: 'Cancelar',
              handler: () => {
                this.viewController.dismiss();
              } 
            }
            ]
          })
          this.nav.present(alert);
       }  
      })
      .catch(error => console.log(error))
  }

goToMapCore(){
    let mapModal = Modal.create(MapPage);
    this.nav.present(mapModal);    
    mapModal.onDismiss(data => {

      let alert = Alert.create({
        title: 'Ponto de referência',
        subTitle: 'Digite o ponto de referência',
        inputs:[{
          type: 'text',
          name: 'referencia'
        }],
        buttons: [{
          text: 'Ok',
          handler: () => {
            alert.dismiss().then(value => {
              if(data){
                this.denuncia.setPosition(data, alert.data.inputs[0].value);
                this.getAddress();
              }
            })
          }
        }]
      });
      this.nav.present(alert);
    });
}
   
  getAddress(){
    this.denuncia.getAddress().then( result => {
        this.formatAddress(result);
        //this.endereco = result; Se tudo funcionar normal, apagar essa linha
      }
    );

  }

  formatAddress(endereco){  //Esse parâmetro é um objeto contendo um json com os dados do Geocoder e o ponto de referência
    if(endereco.endereco.address_components[4].long_name =! "Maceió"){
      let alert = Alert.create({
          title: 'Localização não permitida',
          subTitle: 'Apenas serão recebidas denúncias para a área de Maceió',
          buttons:[
            {
              text: 'OK',
              handler: () => {
                alert.dismiss();
              }
            }
          ]
      });
      this.nav.present(alert);
    }
    else{ 
      this.address.numero = endereco.endereco.address_components[0].long_name;
      this.address.logradouro = endereco.endereco.address_components[1].short_name;
      this.address.bairro = endereco.endereco.address_components[2].long_name;
      this.address.cep = endereco.endereco.address_components[7].long_name;
      this.address.pntRef = endereco.pntRef;
      this.address.enderecoFormatado = endereco.endereco.address_components[1].short_name + ", "+endereco.endereco.address_components[2].long_name+".\nPonto de referência: "+this.address.pntRef;
    }    
  }

  //tira as fotos do local
  takePicture(){
    
    if(this.images.length >= 4){
      let alert = Alert.create({
          title: 'Número máximo de fotos atinginda',
          subTitle: 'Limite de 4 fotos por denúncia',
          buttons:[
            {
              text: 'OK',
              handler: () => {
                alert.dismiss();
              }
            }
          ]
      });
      this.nav.present(alert);
    }

    else{
      Camera.getPicture({
        sourceType: Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.JPEG,
      }).then((imageData) => {
      this.images.push('data:image/jpeg;base64,' + imageData);
      }, (err) => {
        console.log(err);
      });
    }
  }


  //Chamada quando o botão de salvar é clicado
  save(){
    if(!this.address || !this.description){
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
      message: 'Deseja confirmar a denúncia com os seguintes dados?<br>Descrição: '+this.description
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
     console.log(alert.data);
    this.nav.present(alert);
  }
  onRemoveImage(i:number){
    this.images.splice(i,1);
  }
}
