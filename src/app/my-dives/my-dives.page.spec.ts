import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { MyDivesPage } from './my-dives.page';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { AppModule } from '../app.module';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';

var validData = {
  diveID: "D0e0bc54b-bc03-68ad-1835-8357a51ac815"
};
let divService: diveService;
let http: HttpClient;
let router; Router;

describe('MyDivesPage', () => {
  let component: MyDivesPage;
  let fixture: ComponentFixture<MyDivesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDivesPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule],
      providers: [diveService]
    }).compileComponents();

    fixture = TestBed.createComponent(MyDivesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = new diveService(http, router);
  }));

  it('Successfully Created My-Dives Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing My-Dives Components', () => {
    expect(component.diveLst).toBeDefined();
    expect(component.loginLabel).toBeInstanceOf(String);
    expect(component.showLoading).toBeInstanceOf(Boolean);
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.loginLabel).toBe("Login");
    let diveSpy = spyOn(divService, 'getPrivateDive').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.diveLst).toBeDefined();
    expect(component.showLoading).toBeFalse();
  });

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Login");
    let diveSpy = spyOn(divService, 'getPrivateDive').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.diveLst).toBeDefined();
    expect(component.showLoading).toBeFalse();
  });

  it('Testing loginClick()', () => {
    component.loginClick();
  });

  it('Testing goToEdit()', () => {
    component.goToEdit(validData.diveID);
  });

  it('Testing My-Dives Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.goToEdit).toBeTruthy();
  });
});
