import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { EditDivePage } from './edit-dive.page';
import { AppModule } from '../app.module';

var accessToken = "";
var diveID = "";

fdescribe('EditDivePage', () => {
  let component: EditDivePage;
  let fixture: ComponentFixture<EditDivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDivePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  fit('should create', () => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("DiveID", diveID);
    expect(component).toBeTruthy();
  });

  fit('Testing Edit-Dive Component', () => {
    expect(component.showLoading).toBeTrue();
    expect(component.showUser).toBeFalse();
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.DiveSiteLst).toBeUndefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
    expect(component.CurrentDive).toBeUndefined();
    expect(component.diveForm).toBeDefined();
    expect(component.diveObj).toBeDefined();
  });

  fit('Testing Edit-Dive Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
    expect(component.buddyListFinder).toBeTruthy();
    expect(component.getDiveInfo).toBeTruthy();
  });
});
