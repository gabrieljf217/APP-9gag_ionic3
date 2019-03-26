import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SubirPage } from "../subir/subir";

//import { AngularFireDatabase } from '@angular/fire/database';
//import { Observable } from 'rxjs';

import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";

import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //posts: Observable<any[]>;
  hayMas:boolean = true;

  constructor(private modalCtrl:ModalController,
              public _cap:CargaArchivoProvider,
              private socialSharing: SocialSharing) {

    //this.posts = afDB.list('post').valueChanges();

  }

  mostrarModal(){
    let modal =this.modalCtrl.create( SubirPage );
    modal.present();
  } 

  doInfinite(infiniteScroll) {
    this._cap.cargarImagenes().then((hayMas:boolean)=>{
      this.hayMas = hayMas;
      infiniteScroll.complete()

    });
  }

  compartir( post:any ){
    console.log(post.img);
    
    this.socialSharing.shareViaWhatsApp( post.titulo, null, post.img)
    .then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

}
