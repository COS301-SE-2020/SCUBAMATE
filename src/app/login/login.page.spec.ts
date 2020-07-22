import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginPage } from './login.page';
import { AppModule } from '../app.module';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Succesfully Created Login Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Login Components', () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.loginLabel).toBeDefined();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.loginLabel).toBe("Login");
  });

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Login");
  });

  it('Testing loginClick()', () => {
    component.loginClick();
  });

  it('Testing onSubmit()', () => {
    component.onSubmit("", "", event);
  });

  it('Testing Login Functionality', () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.ionViewWillEnter).toBeDefined();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
  });
});
