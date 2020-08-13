import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiveCenterInformationPage } from './dive-center-information.page';

describe('DiveCenterInformationPage', () => {
  let component: DiveCenterInformationPage;
  let fixture: ComponentFixture<DiveCenterInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiveCenterInformationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiveCenterInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
