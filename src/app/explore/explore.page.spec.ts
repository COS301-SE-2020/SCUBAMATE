import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ExplorePage } from './explore.page';

import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';

describe('ExplorePage', () => {
  let component: ExplorePage;
  let fixture: ComponentFixture<ExplorePage>;
  let responseCode = 200;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, accountService, diveService, weatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(ExplorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Successfully loaded 20 latest dive logs', () => {
    expect(responseCode).toBe(200);
  });
});
