import {Injectable} from '@angular/core';

declare var firebase: any;

@Injectable()
export class Fire {
	database: any;
	ref: any;
	categorias: any;
	constructor(){
		var config = {
		    apiKey: "AIzaSyC9SGdtW-cm43WWHzu1SiLxXeU1d_-KQbE",
		    authDomain: "smccu-1384.firebaseapp.com",
		    databaseURL: "https://smccu-1384.firebaseio.com",
		    storageBucket: "smccu-1384.appspot.com",
  		};
		firebase.initializeApp(config);	
		firebase.database().ref('categorias/').on('value', (snapshot) => {
			console.log("snapshot ", snapshot.val());
			this.categorias = snapshot.val();
		});
	}	
	getCategorias(): any{
		return this.categorias;
	}
}