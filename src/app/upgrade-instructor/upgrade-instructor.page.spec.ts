import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpgradeInstructorPage } from './upgrade-instructor.page';

describe('UpgradeInstructorPage', () => {
  let component: UpgradeInstructorPage;
  let fixture: ComponentFixture<UpgradeInstructorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeInstructorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpgradeInstructorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
