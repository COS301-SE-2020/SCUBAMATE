import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LogDivePage } from './log-dive.page';
import { AppModule } from '../app.module';

fdescribe('LogDivePage', () => {
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

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('Testing Log-Dive Components', () => {
    //expect(component.uuidValue).toBeInstanceOf(String);
    expect(component.showLoading).toBeFalse();
    expect(component.DiveTypeLst).toBeDefined();
    expect(component.DiveSiteLst).toBeDefined();
    //expect(component.BuddyLst).toBeDefined();
    expect(component.cDate).toBeDefined();
    expect(component.currentDate).toBeDefined();
    //expect(component.MaxTempAPI).toBeDefined();
    //expect(component.MinTempAPI).toBeDefined();
    //expect(component.MoonPhase).toBeDefined();
    //expect(component.WeatherDescription).toBeDefined();
    //expect(component.WindSpeed).toBeDefined();
    expect(component.Key).toBeDefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.loginLabel).toBeDefined();
  });

  fit('Testing Log-Dive Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
    expect(component.buddyListFinder).toBeTruthy();
  });
});
