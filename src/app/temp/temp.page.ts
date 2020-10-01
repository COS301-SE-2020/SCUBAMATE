import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AgeValidator } from '../validators/age';
import { AlertController } from '@ionic/angular';
import { PRIMARY_OUTLET } from '@angular/router';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

//Cropper
import { Crop } from '@ionic-native/crop/ngx';

export interface UserValues{
  firstName: string
}

@Component({
  selector: 'app-temp',
  templateUrl: './temp.page.html',
  styleUrls: ['./temp.page.scss'],
})
export class TempPage implements OnInit {

 ProfilePhoto: string = "" ; 
 base64textString : string;


  constructor(private crop: Crop , private router: Router , public formBuilder: FormBuilder, public alertController : AlertController, private connectionService: ConnectionService, private location: Location) { }

  ngOnInit() {}



 onFileSelected(event) {
    let me = this;
    let file = event.target.files[0];
     let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //console.log(reader.result);
      let s = reader.result ; 
      me.base64textString = reader.result.toString() ;
  

      me.ProfilePhoto = me.base64textString;
      
      //console.log(me.diverObj.ProfilePhoto);s
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }; 
  } 

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, {quality: 75})
  .then(
    newImage => {this.ProfilePhoto = newImage },
    error => console.error('Error cropping image', error)
  );
  }




}

