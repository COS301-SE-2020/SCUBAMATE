import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { EditDivePage } from './edit-dive.page';

import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';

describe('EditDivePage', () => {
  let component: EditDivePage;
  let fixture: ComponentFixture<EditDivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDivePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, accountService, diveService, weatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
