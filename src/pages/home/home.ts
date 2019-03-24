import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { SubirPage } from "../subir/subir";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              private modalCtrl:ModalController) {

  }

  mostrarModal(){
    let modal =this.modalCtrl.create( SubirPage );
    modal.present();
  } 

}
