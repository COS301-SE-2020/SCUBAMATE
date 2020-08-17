import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePage } from './home.page';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

var accessToken = "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7";

fdescribe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), AppModule],
      providers: [accountService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = new accountService(http, router);
    router = TestBed.get(Router);
  }));

  fit('Successfully Created Home Page', () => {
    expect(component).toBeTruthy();
  });

  fit('Testing Home Components', () => {
    expect(component.siteLst).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
  });

  fit('Testing ngOnInit()', () => {
    localStorage.setItem("accessToken", accessToken);
    component.ngOnInit();
    expect(component.loginLabel).toBe("Log Out");
  });

  fit('Testing ionViewWillEnter()', () => {
    localStorage.setItem("accessToken", accessToken);
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Log Out");
  });

  fit('Testing loginClick()', () => {
    component.loginClick();
    expect(localStorage.getItem("accessToken")).toBeDefined();
  });

  fit('Testing Home Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.sendEmail).toBeTruthy();
  });
});
