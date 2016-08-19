import {Component} from '@angular/core';
import {Modal, NavController} from 'ionic-angular';
import {MapPage} from '../map/map'
import {DenunciaPage} from '../denuncia/denuncia'

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
  }
}
