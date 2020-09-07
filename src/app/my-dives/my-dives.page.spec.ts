import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { MyDivesPage } from './my-dives.page';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { AppModule } from '../app.module';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';

var validData = {
  diveID: "D0e0bc54b-bc03-68ad-1835-8357a51ac815",
  accessToken : "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7"
};

describe('MyDivesPage', () => {
  let component: MyDivesPage;
  let fixture: ComponentFixture<MyDivesPage>;
  let divService: diveService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDivesPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), AppModule],
      providers: [diveService]
    }).compileComponents();

    fixture = TestBed.createComponent(MyDivesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = new diveService(http, router);
    router = TestBed.get(Router);
  }));

  it('Successfully Created My-Dives Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing My-Dives Components', () => {
    expect(component.diveLst).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
    expect(component.showLoading).toBeTrue();
  });

  it('Testing ngOnInit()', () => {
    localStorage.setItem("accessToken", validData.accessToken);
    component.ngOnInit();
    expect(component.showLoading).toBeTrue();
    expect(component.loginLabel).toBe("Log Out");
    let diveSpy = spyOn(divService, 'getPrivateDive').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.diveLst).toBeUndefined();
  });

  it('Testing ionViewWillEnter()', () => {
    localStorage.setItem("accessToken", validData.accessToken);
    component.ngOnInit();
    expect(component.showLoading).toBeTrue();
    expect(component.loginLabel).toBe("Log Out");
    let diveSpy = spyOn(divService, 'getPrivateDive').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.diveLst).toBeUndefined();
  });

  it('Testing loginClick()', () => {
    localStorage.setItem("accessToken", validData.accessToken);
    let navigateSpy = spyOn(router, 'navigate');
    component.loginClick();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('Testing goToEdit()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.goToEdit(validData.diveID);
    expect(navigateSpy).toHaveBeenCalledWith(['/edit-dive']);
  });

  it('Testing My-Dives Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.goToEdit).toBeTruthy();
  });
});
