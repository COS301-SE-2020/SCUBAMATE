import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePage } from './home.page';
import { AppModule } from '../app.module';

fdescribe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  fit('Successfully Created Home Page', () => {
    expect(component).toBeTruthy();
  });

  fit('Testing Home Components', () => {
    expect(component.siteLst).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
  });

  fit('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.loginLabel).toBe("Login");
  });

  fit('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Login");
  });

  fit('Testing loginClick()', () => {
    component.loginClick();
  });

  fit('Testing sendEmail()', () => {
    component.sendEmail();
  });

  fit('Testing Home Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.sendEmail).toBeTruthy();
  });
});
