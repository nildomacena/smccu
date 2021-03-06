import {Component, ViewChild} from '@angular/core';
import {Modal, Platform, ionicBootstrap, Nav, MenuController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {DenunciaPage} from './pages/denuncia';
import {Fire} from './util/fire';

@Component({
  templateUrl: 'build/app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  raiz: any = HomePage;

  constructor(platform: Platform, private menu: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openDenuncia(){
    let denunciaModal = Modal.create(DenunciaPage, {teste: 'testando denúncia' }, { showBackdrop: true});
    this.menu.close();
    this.nav.present(denunciaModal);
  }
  
}

ionicBootstrap(MyApp, [Fire]);
