import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { MyDivesPage } from './my-dives.page';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { AppModule } from '../app.module';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';

const diveServiceSpy = jasmine.createSpyObj('diveService', ['dive']);

fdescribe('MyDivesPage', () => {
  let component: MyDivesPage;
  let fixture: ComponentFixture<MyDivesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDivesPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule],
      providers: [{provide: diveService, useValue: diveServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyDivesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  fit('Successfully Created My-Dives Page', () => {
    expect(component).toBeTruthy();
  });

  fit('Testing My-Dives Components', () => {
    expect(component.diveLst).toBeDefined();
    expect(component.loginLabel).toBeInstanceOf(String);
    expect(component.showLoading).toBeInstanceOf(Boolean);
  });

  fit('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.loginLabel).toBe("Login");
    expect(component.diveLst).toBeDefined();
    expect(component.showLoading).toBeFalse();
  });

  fit('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Login");
    expect(component.diveLst).toBeDefined();
    expect(component.showLoading).toBeFalse();
  });

  fit('Testing loginClick()', () => {
    component.loginClick();
  });

  fit('Testing goToEdit()', () => {
    component.goToEdit("");
  });

  fit('Testing My-Dives Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.goToEdit).toBeTruthy();
  });
});
