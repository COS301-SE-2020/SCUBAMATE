import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { EditProfilePage } from './edit-profile.page';
import { AppModule } from '../app.module';

describe('EditProfilePage', () => {
  let component: EditProfilePage;
  let fixture: ComponentFixture<EditProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProfilePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Successfully Created Edit-Profile Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Edit-Page Components', () => {
    expect(component.AD).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
    expect(component.showData).toBeFalse();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.loginLabel).toBe("Login");
    expect(component.showData).toBeFalse();
    expect(component.AD).toBeUndefined();
  });

  it('Testing loginClick()', () => {
    component.loginClick();
  });

  it('Testing onSubmit()', () => {
    component.onSubmit("", "", "", false, event);
  });

  it('Testing Edit-Page Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
  });
});
