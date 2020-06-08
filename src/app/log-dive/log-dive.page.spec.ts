import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogDivePage } from './log-dive.page';

describe('LogDivePage', () => {
  let component: LogDivePage;
  let fixture: ComponentFixture<LogDivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogDivePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LogDivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
