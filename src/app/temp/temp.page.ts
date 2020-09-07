import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AgeValidator } from '../validators/age';
import { AlertController } from '@ionic/angular';
import { PRIMARY_OUTLET } from '@angular/router';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

export interface UserValues{
  firstName: string
}

@Component({
  selector: 'app-temp',
  templateUrl: './temp.page.html',
  styleUrls: ['./temp.page.scss'],
})
export class TempPage implements OnInit {

  pages = [
    {
      title: "First Page",
      url: "/register",
      ionicIcon: 'log-in-outline'
    },{
      title: "Second Page",
      url: "/register",
      ionicIcon: 'log-in-outline'
    }
  ];

  selectedPath ="";


  constructor(private router: Router , public formBuilder: FormBuilder, public alertController : AlertController, private connectionService: ConnectionService, private location: Location) { }

  ngOnInit() {}



}

