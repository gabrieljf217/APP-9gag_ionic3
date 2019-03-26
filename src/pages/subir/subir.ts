import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";
import { Camera, CameraOptions } from '@ionic-native/camera/';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";
@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

  titulo:string ="";
  imagenPreview:string="";
  imagen64: string;


  constructor(private viewCtrl:ViewController,
              private camera: Camera,
              private imagePicker: ImagePicker,
              private _cap:CargaArchivoProvider) {
  }


  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  mostarCamara(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.imagenPreview  = "data:image/jpg;base64," + imageData;
      this.imagen64 = imageData;
    }, (err) => {
      console.log("Error en camara", JSON.stringify(err));
    });
  }

  selecFoto(){

    let opciones: ImagePickerOptions = {
      quality: 70,
      outputType: 1,
      maximumImagesCount: 1,
    }

    this.imagePicker.getPictures(opciones).then((results) => {

      for (var i = 0; i < results.length; i++) {
        this.imagenPreview = 'data:image/jpg;base64,' + results[i];
        this.imagen64 = results[i];
      }
    }, (err) => {
      console.log("Error en selector",JSON.stringify(err));
    });
    
  }

  crearPost(){
    let archivo ={
      img: this.imagen64,
      titulo: this.titulo,
    }

    this._cap.cargarImagenfb(archivo)
      .then(()=>this.cerrarModal());
    
  }

}
