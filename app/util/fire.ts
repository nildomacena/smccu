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

	saveImages(images: string[], chave: string):Promise<boolean> {
		
		let blob: Blob[] = [];
		let task: any[] = [];
		let promises: any[] = [];
		let imageName:string[] = [];
		let imagePath: string [] = [];
		let completo: boolean = false;
		let metadata = {
			contentType: 'image/jpeg'
		};
		for (let i in images){
			imagePath[i] = images[i].substring(0, images[i].lastIndexOf('/')+1);
			imageName[i] = images[i].substring(images[i].lastIndexOf('/')+1, images[i].length);
			
			promises.push(new Promise((resolve,reject) => {File.readAsArrayBuffer(imagePath[i],imageName[i])
				.then(arrayBuffer => {
					blob.push(new Blob([arrayBuffer], {type: 'image/jpeg'}));
					task[i] = this.storageRef.child('images/'+chave+'/'+imageName[i]).put(blob[i],metadata);
					if (task.length == images.length)
						task[images.length - 1].on('state_changed', snapshot =>  
							console.log((snapshot.bytesTransferred / snapshot.totalBytes) *100),

							error => console.log('Error: ',error),

							() =>  {
									console.log('transferência completada');
									completo = true;
									resolve(true);							
							}
						)
				})
				.catch(error => console.log('Erro: ',error));
				})	
				) 		 		
		}
		return Promise.all(promises).then(dados => true);
		/*
		imagePath[0] = images[0].substring(0, images[0].lastIndexOf('/')+1);
		imageName[0] = images[0].substring(images[0].lastIndexOf('/')+1, images[0].length);
		promise = new Promise((resolve,reject) => {
			File.readAsArrayBuffer(imagePath[0],imageName[0])
			.then(arrayBuffer => {
				blob.push(new Blob([arrayBuffer], {type: 'image/jpeg'}));
				task = this.storageRef.child('images/'+chave+'/'+imageName[0]).put(blob[0],metadata);
				task.on('state_changed', snapshot => 
					console.log((snapshot.bytesTransferred / snapshot.totalBytes) *100,'%'),

					error => console.log('Erro ao fazer upload', error),

					() => {
						console.log('transferência completada');
						completo = true;
						resolve(true);
					}
				)
			})
		});
		return promise;
		/*
		for (let i in images){
			imagePath[i] = images[i].substring(0, images[i].lastIndexOf('/')+1);
			imageName[i] = images[i].substring(images[i].lastIndexOf('/')+1, images[i].length);
			
			File.readAsArrayBuffer(imagePath[i],imageName[i])
				.then(arrayBuffer => {
					blob.push(new Blob([arrayBuffer], {type: 'image/jpeg'}));
					task[i] = this.storageRef.child('images/'+chave+'/'+imageName[i]).put(blob[i],metadata);
					task[images.length - 1].on('state_changed', snapshot =>  
					console.log((snapshot.bytesTransferred / snapshot.totalBytes) *100),

					error => console.log('Error: ',error),

					() =>  {
						console.log('transferência completada');
						completo = true;
						return Promise.resolve(true);
					}
					
				)
				})
				.catch(error => console.log('Erro: ',error)); 		 		
		}
		*/

	}


	saveDenuncia(denuncia: Denuncia, images: string[]):Promise<boolean>{
		let chave = firebase.database().ref().child('denuncias/').push(denuncia).key;
		return this.saveImages(images, chave);
	}


}