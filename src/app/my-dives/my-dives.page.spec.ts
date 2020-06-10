import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyDivesPage } from './my-dives.page';

describe('MyDivesPage', () => {
  let component: MyDivesPage;
  let fixture: ComponentFixture<MyDivesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDivesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyDivesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
