import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LogDivePage } from './log-dive.page';
import { AppModule } from '../app.module';

describe('LogDivePage', () => {
  let component: LogDivePage;
  let fixture: ComponentFixture<LogDivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogDivePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LogDivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Succesfully Created Log-Dive Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Log-Dive Components', () => {
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

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.cDate).toBeInstanceOf(Date);
    expect(component.currentDate).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.loginLabel).toBe("Login");
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

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Login");
  });

  it('Testing loginClick()', () => {
    component.loginClick();
  });

  it('Testing onSubmit()', () => {
    component.onSubmit(false, "", "", "", "", "", "", "", "", "", 0, 0, 0, event);
    expect(component.uuidValue).toBeDefined();
    expect(component.showLoading).toBeFalse();
  });

  it('Testing buddyListFinder()', () => {
    component.buddyListFinder("");
    expect(component.BuddyLst).toBeUndefined();
    expect(component.showLoading).toBeFalse();
  });

  it('Testing Log-Dive Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
    expect(component.buddyListFinder).toBeTruthy();
  });
});
