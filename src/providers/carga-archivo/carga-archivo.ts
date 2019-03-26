import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase";

@Injectable()
export class CargaArchivoProvider {

  imagenes: ArchivoSubir[] = [];

  constructor(public toastCtrl: ToastController,
              public afDB:AngularFireDatabase) {
    console.log('Hello CargaArchivoProvider Provider');
  }

  cargarImagenfb( archivo: ArchivoSubir ){
    let promesa = new Promise((resolve, reject)=>{
    this.mostrarToast('Cargando...');

    let storeRef = firebase.storage().ref();
    let nombreArchivo:string = new Date().valueOf().toString();

    let uploadTask: firebase.storage.UploadTask = 
      storeRef.child(`img/${ nombreArchivo }`)
        .putString( archivo.img, 'base64', {contentType: 'image/jpg'} );
    
    uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
      ()=>{}, // saber % cuantos mb se han subido   
      ( error )=>{
        //manejo error
        console.log("Error en la carga");
        console.log(JSON.stringify( error ));
        this.mostrarToast(JSON.stringify( error ));
        reject();
      },
      ()=>{
        // Todo bien
        console.log("Archivo subido");
        this.mostrarToast('Imagen cargada correctamente');
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        this.crearPost( archivo.titulo, downloadURL, nombreArchivo);
        });
        resolve();
      }
    )

    });
    return promesa;
  }

  private crearPost( titulo: string, url: string, nombreArchivo: string ){
    let post: ArchivoSubir={
      img: url,
      titulo:titulo,
      key: nombreArchivo
    };

    console.log(JSON.stringify(post));

    //this.afDB.list('/post').push(post);
    this.afDB.object(`/post/${nombreArchivo}`).update(post);
    
    this.imagenes.push(post);

  }


  mostrarToast( mensaje:string ){
    this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    }).present();
  }


}


interface ArchivoSubir{
  titulo: string;
  img: string;
  key?: string;
}
