import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { MyDivesPage } from './my-dives.page';

import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';

describe('MyDivesPage', () => {
  let component: MyDivesPage;
  let fixture: ComponentFixture<MyDivesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDivesPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, accountService, diveService, weatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(MyDivesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
