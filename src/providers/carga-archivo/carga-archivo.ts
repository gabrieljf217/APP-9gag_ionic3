import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase";

import "rxjs/add/operator/map";

@Injectable()
export class CargaArchivoProvider {

  imagenes: ArchivoSubir[] = [];
  lastKey: string= null;

  constructor(public toastCtrl: ToastController,
              public afDB:AngularFireDatabase) {
    
    this.cargarUltimoKey().subscribe(()=>this.cargarImagenes());
  }

  private cargarUltimoKey(){
    return this.afDB.list('/post', ref => ref.orderByKey().limitToLast(1))
      .valueChanges()
      .map( (post:any) =>{
        this.lastKey = post[0].key;

        this.imagenes.push( post[0] );
      });
  }

  cargarImagenes(){
    return new Promise ( (resolve, reject)=>{
      this.afDB.list('/post',
        ref=>ref.limitToLast(3)
          .orderByKey()
          .endAt( this.lastKey )
      ).valueChanges()
        .subscribe((posts:any)=>{
        posts.pop();
          if (posts.length == 0) {
            console.log("No hay mas registros");
            resolve(false);
            return;
          }
          this.lastKey = posts[0].key;
          for (let i = posts.length-1; i >=0; i--) {
            let post = posts[i];
            this.imagenes.push(post);
          }
          resolve(true);
        });
    });
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
