import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditDivePage } from './edit-dive.page';

describe('EditDivePage', () => {
  let component: EditDivePage;
  let fixture: ComponentFixture<EditDivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDivePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
