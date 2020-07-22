import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { WeatherPage } from './weather.page';
import { AppModule } from '../app.module';

describe('WeatherPage', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Weather Components', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.Coordinates).toBeDefined();
    expect(component.Key).toBeDefined();
    expect(component.Weather).toBeDefined();
    expect(component.tempList).toBeDefined();
    //expect(component.tempDate).toBeDefined();
    //expect(component.weatherDate).toBeInstanceOf(String);
    expect(component.loginLabel).toBeDefined();
  });

  it('Testing Weather Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
  });
});
