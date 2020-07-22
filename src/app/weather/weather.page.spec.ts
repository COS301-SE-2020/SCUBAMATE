import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { WeatherPage } from './weather.page';
import { AppModule } from '../app.module';

fdescribe('WeatherPage', () => {
  let component: WeatherPage;
  let fixture: ComponentFixture<WeatherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  fit('Successfully Created Weather Page', () => {
    expect(component).toBeTruthy();
  });

  fit('Testing Weather Components', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.Coordinates).toBeDefined();
    expect(component.Key).toBeDefined();
    expect(component.Weather).toBeDefined();
    expect(component.tempList).toBeDefined();
    expect(component.tempDate).toBeUndefined();
    expect(component.weatherDate).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
  });

  fit('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.loginLabel).toBe("Login");
    expect(component.Coordinates).toBeDefined();
    expect(component.Key).toBeDefined();
    expect(component.Weather).toBeDefined();
    expect(component.tempDate).toBeUndefined();
    expect(component.weatherDate).toBeUndefined();
  });

  fit('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Login");
  });

  fit('Testing loginClick()', () => {
    component.loginClick();
  });

  fit('Testing Weather Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
  });
});
