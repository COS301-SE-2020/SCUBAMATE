import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AgeValidator } from '../validators/age';
import { AlertController } from '@ionic/angular';
import { PRIMARY_OUTLET } from '@angular/router';

import {MatStepperModule} from '@angular/material/stepper';


export interface UserValues{
  firstName: string
}

@Component({
  selector: 'app-temp',
  templateUrl: './temp.page.html',
  styleUrls: ['./temp.page.scss'],
})
export class TempPage implements OnInit {

  ngOnInit(){

  }
 


}

