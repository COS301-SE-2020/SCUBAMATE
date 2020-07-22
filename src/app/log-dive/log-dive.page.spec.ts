import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LogDivePage } from './log-dive.page';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

var validData = {
  pub: false,
  desc: "Saw Sharks",
  site: "Shark Alley",
  date: "2018-01-04",
  timeIn: "12:00",
  timeOut: "13:00",
  diveType: "Training Dive",
  buddy: "John Cena",
  vis: "13m",
  dep: "12m",
  aT: 12,
  surfaceT: 13,
  bottomT: 7, 
};

fdescribe('LogDivePage', () => {
  let component: LogDivePage;
  let fixture: ComponentFixture<LogDivePage>;
  let accService: accountService;
  let divService: diveService;
  let weatService: weatherService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogDivePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule],
      providers: [accountService, diveService, weatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(LogDivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = new accountService(http, router);
    divService = new diveService(http, router);
    weatService = new weatherService(http, router);
  }));

  fit('Succesfully Created Log-Dive Page', () => {
    expect(component).toBeTruthy();
  });

  fit('Testing Log-Dive Components', () => {
    expect(component.uuidValue).toBeUndefined();
    expect(component.showLoading).toBeFalse();
    expect(component.DiveTypeLst).toBeDefined();
    expect(component.DiveSiteLst).toBeDefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.cDate).toBeDefined();
    expect(component.currentDate).toBeDefined();
    expect(component.MaxTempAPI).toBeUndefined();
    expect(component.MinTempAPI).toBeUndefined();
    expect(component.MoonPhase).toBeUndefined();
    expect(component.WeatherDescription).toBeUndefined();
    expect(component.WindSpeed).toBeUndefined();
    expect(component.Key).toBeDefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.loginLabel).toBeDefined();
  });

  fit('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.cDate).toBeInstanceOf(Date);
    expect(component.currentDate).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.loginLabel).toBe("Login");
    let diveSpy = spyOn(divService, 'getDiveSites').and.callThrough();
    expect(diveSpy).toBeDefined();
    diveSpy = spyOn(divService, 'getDiveTypes').and.callThrough();
    expect(diveSpy).toBeDefined();
    let weatherSpy = spyOn(weatService, 'getLocationKey').and.callThrough();
    expect(weatherSpy).toBeDefined();
    weatherSpy = spyOn(weatService, 'getLogWeather').and.callThrough();
    expect(weatherSpy).toBeDefined();
    expect(component.DiveSiteLst).toBeDefined();
    expect(component.DiveTypeLst).toBeDefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.Key).toBeDefined();
    expect(component.MaxTempAPI).toBeUndefined();
    expect(component.MinTempAPI).toBeUndefined();
    expect(component.MoonPhase).toBeUndefined();
    expect(component.WeatherDescription).toBeUndefined();
    expect(component.WindSpeed).toBeUndefined();
    
  });

  fit('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Login");
  });

  fit('Testing loginClick()', () => {
    component.loginClick();
  });

  fit('Testing onSubmit()', () => {
    //component.onSubmit(validData.pub, validData.desc, validData.site, validData.date, validData.timeIn, validData.timeOut, validData.diveType, validData.buddy, validData.vis, validData.dep, validData.aT, validData.surfaceT, validData.bottomT, event);
    expect(component.uuidValue).toBeUndefined();
    let weatherSpy = spyOn(weatService, 'getLogWeather').and.callThrough();
    expect(weatherSpy).toBeDefined();
    let diveSpy = spyOn(divService, 'logDive').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeFalse();
  });

  fit('Testing buddyListFinder()', () => {
    component.buddyListFinder("John Cena");
    let accountSpy = spyOn(accService, 'lookAheadBuddy').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.showLoading).toBeTrue();
  });

  fit('Testing Log-Dive Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
    expect(component.buddyListFinder).toBeTruthy();
  });
});
