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

  it('Succesfully Created Profile Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Profile Components', () => {
    expect(component.loginLabel).toBeDefined();
    expect(component.AD).toBeUndefined();
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.OptionalList).toBeUndefined();
    expect(component.EquipmentList).toBeUndefined();
    expect(component.viewChecklist).toBeFalse();
    expect(component.viewProfile).toBeDefined();
    expect(component.editProfile).toBeDefined();
    expect(component.showLoading).toBeDefined();
    expect(component.showAD).toBeFalse();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.viewProfile).toBeTrue();
    expect(component.editProfile).toBeFalse();
    expect(component.loginLabel).toBe("Login");
    expect(component.showLoading).toBeTrue();
    expect(component.showAD).toBeFalse();
    expect(component.AD).toBeUndefined();
    expect(component.DiveTypeLst).toBeUndefined();
  });
  
  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.viewProfile).toBeTrue();
    expect(component.editProfile).toBeFalse();
    expect(component.loginLabel).toBe("Login");
    expect(component.AD).toBeUndefined();
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.showLoading).toBeTrue();
  });

  // fit('Testing loginClick()', () => {
  //   component.loginClick();
  // });

  it('Testing onChooseDive()', () => {
    component.onChooseDive("", event);
    expect(component.showLoading).toBeTrue();
    expect(component.viewChecklist).toBeFalse();
    expect(component.OptionalList).toBeUndefined();
    expect(component.EquipmentList).toBeUndefined();
  });

  it('Testing goToEdit()', () => {
    component.goToEdit();
  });

  it('Testing Profile Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onChooseDive).toBeTruthy();
    expect(component.goToEdit).toBeTruthy();
  });
});
