import {Injectable} from '@angular/core';

declare var firebase: any;

@Injectable()
export class Fire {
	database: any;
	ref: any;
	constructor(){
		var config = {
		    apiKey: "AIzaSyC9SGdtW-cm43WWHzu1SiLxXeU1d_-KQbE",
		    authDomain: "smccu-1384.firebaseapp.com",
		    databaseURL: "https://smccu-1384.firebaseio.com",
		    storageBucket: "smccu-1384.appspot.com",
  		};
	  firebase.initializeApp(config);	
	  this.database = firebase.database();
	  this.ref = this.database.ref("categorias/");
	}	
	getCategorias(){
		let categorias;
		this.ref.on('value', snapshot => categorias = snapshot.val());
		return categorias;
	}
}