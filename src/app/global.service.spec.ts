import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import {HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';

describe('GlobalService', () => {
  let service: GlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientTestingModule, HttpModule],
    });
    service = TestBed.inject(GlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
