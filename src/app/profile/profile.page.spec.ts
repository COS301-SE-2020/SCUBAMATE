import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfilePage } from './profile.page';
import { AppModule } from '../app.module';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Profile Components', () => {
    expect(component.loginLabel).toBeDefined();
    //expect(component.AD).toBeDefined();
    //expect(component.DiveTypeLst).toBeDefined();
    //expect(component.OptionalList).toBeDefined();
    //expect(component.EquipmentList).toBeDefined();
    expect(component.viewChecklist).toBeFalse();
    expect(component.viewProfile).toBeDefined();
    expect(component.editProfile).toBeDefined();
    expect(component.showLoading).toBeDefined();
    expect(component.showAD).toBeFalse();
  });

  it('Testing Profile Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onChooseDive).toBeTruthy();
    expect(component.goToEdit).toBeTruthy();
  });
});
