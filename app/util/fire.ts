import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Denuncia } from './';
import { File } from 'ionic-native';

declare var firebase: any;
declare var cordova: any;

@Injectable()
export class Fire {
	database: any;
	ref: any;
	categorias: any;
	categoriasObserver: any;
	storageRef: any;
	de: any;
	constructor(){
		var config = {
		    apiKey: "AIzaSyC9SGdtW-cm43WWHzu1SiLxXeU1d_-KQbE",
		    authDomain: "smccu-1384.firebaseapp.com",
		    databaseURL: "https://smccu-1384.firebaseio.com",
		    storageBucket: "smccu-1384.appspot.com",
  		};
		firebase.initializeApp(config);
		this.storageRef = firebase.storage().ref();
	}	

	getCategorias(){
		return firebase.database().ref('categorias/');		
	}

	saveImages(images: string[]){
		const fs:string = cordova.file.cacheDirectory;
		console.log('fs: ',fs);
		let regex = /([0-9])\w+\.jpg/g;
		let imageName = images[0].substring(images[0].lastIndexOf('/')+1, images[0].length);
		let imagePath = images[0].substring(0, images[0].lastIndexOf('/')+1);
		let metadata = {
			contentType: 'image/jpeg'
		};
		console.log('imageName: ', imageName);
		console.log('imagePath: ', imagePath);
		File.readAsArrayBuffer(imagePath,imageName)
			.then(arrayBuffer => {
				let blob = new Blob([arrayBuffer], {type: 'image/jpeg'});
				let task = this.storageRef.child('images/'+imageName).put(blob,metadata);
			})
			.catch(reason => console.log('reason', reason));
		
		/*File.copyFile(images[0],'', File.readAsDataURL ,'image1').then(
			fileEntry => {
				console.log("FileEntry: ",fileEntry)
				let task = this.storageRef.child('images/0').put(fileEntry,metadata);
			},
			reason => console.log("Error: ", reason)
		)*/
	}

	saveDenuncia(denuncia: Denuncia){
		console.log(denuncia);
		firebase.database().ref().child('denuncias/').push(denuncia);
	}


}