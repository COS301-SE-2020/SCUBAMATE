import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiveSiteInformationPage } from './dive-site-information.page';

describe('DiveSiteInformationPage', () => {
  let component: DiveSiteInformationPage;
  let fixture: ComponentFixture<DiveSiteInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiveSiteInformationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiveSiteInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
