import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupPage } from './signup.page';

import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, accountService, diveService, weatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
