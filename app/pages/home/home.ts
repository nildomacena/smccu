import {Component} from '@angular/core';
import {Modal, NavController, Toast} from 'ionic-angular';
import {MapPage} from '../map/map'
import {DenunciaPage} from '../denuncia';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(private nav: NavController) {

  }
  testePage: any = MapPage;
  login: string;
  password: string;
  goToTest(){
    this.nav.push(this.testePage,{login:this.login, password:this.password});
  }
  
  openDenuncia(){
    let denunciaModal = Modal.create(DenunciaPage);
    this.nav.present(denunciaModal);
    denunciaModal.onDismiss(data => {
      if(data.saved)
        this.presentToast();
    })
  }

  presentToast(){
    let toast = Toast.create({
      message: 'Denúncia registrada com sucesso',
      duration: 3000,
      position: 'top'
    });
    this.nav.present(toast);
  }
}
