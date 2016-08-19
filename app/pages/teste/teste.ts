import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MapPage} from '../map/map'

@Component({
  templateUrl: 'build/pages/teste/teste.html'
})
export class TestePage {
  constructor(private nav: NavController) {

  }
  testePage = MapPage;
  conteudo: string = "Testandooo"
  goToTeste(){
    this.nav.push(this.testePage, {conteudo: this.conteudo});
  }
}
