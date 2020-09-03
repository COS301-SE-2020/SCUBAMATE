import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EditProfilePage } from './edit-profile.page';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';

xdescribe('EditProfilePage', () => {
  let component: EditProfilePage;
  let fixture: ComponentFixture<EditProfilePage>;
  let divService: diveService;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProfilePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, accountService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = TestBed.get(diveService);
    accService = TestBed.get(accountService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
  }));

  xit('Successfully Created Edit-Profile Page', () => {
    expect(component).toBeTruthy();
  });

  xit('getUser() test', () => {
    var eventValue = {

    };

    accService.getUser().subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBeDefined();
  });

  xit('editUSer() test', () => {
    var eventValue = {

    };

    accService.editUser(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBeDefined();
  });

  xit('updateNewPassword() test', () => {
    var eventValue = {

    };

    accService.updateNewPassword(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBeDefined();
  });
});
