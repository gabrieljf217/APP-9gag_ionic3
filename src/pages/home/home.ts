import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SubirPage } from "../subir/subir";

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  posts: Observable<any[]>;

  constructor(private modalCtrl:ModalController,
              afDB: AngularFireDatabase) {

    this.posts = afDB.list('post').valueChanges();

  }

  mostrarModal(){
    let modal =this.modalCtrl.create( SubirPage );
    modal.present();
  } 
}
