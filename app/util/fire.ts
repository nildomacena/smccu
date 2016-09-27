import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Denuncia } from './';

declare var firebase: any;

@Injectable()
export class Fire {
	database: any;
	ref: any;
	categorias: any;
	categoriasObserver: any;

	constructor(){
		var config = {
		    apiKey: "AIzaSyC9SGdtW-cm43WWHzu1SiLxXeU1d_-KQbE",
		    authDomain: "smccu-1384.firebaseapp.com",
		    databaseURL: "https://smccu-1384.firebaseio.com",
		    storageBucket: "smccu-1384.appspot.com",
  		};
		  firebase.initializeApp(config);	
	}	

	getCategorias(){
		return firebase.database().ref('categorias/');		
	}

	saveDenuncia(denuncia: Denuncia){
		firebase.database().ref().child('denuncias/').push(denuncia);
	}
}