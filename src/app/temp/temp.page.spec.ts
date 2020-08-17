import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TempPage } from './temp.page';

xdescribe('TempPage', () => {
  let component: TempPage;
  let fixture: ComponentFixture<TempPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TempPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
