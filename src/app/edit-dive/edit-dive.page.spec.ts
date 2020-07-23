import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { EditDivePage } from './edit-dive.page';
import { AppModule } from '../app.module';

xdescribe('EditDivePage', () => {
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

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('Testing Edit-Dive Component', () => {
    expect(component.showLoading).toBeFalsy();
    expect(component.showUser).toBeFalse();
    expect(component.DiveTypeLst).toBeDefined();
    expect(component.DiveSiteLst).toBeDefined();
    expect(component.BuddyLst).toBeDefined();
    expect(component.loginLabel).toBeDefined();
    expect(component.CurrentDive).toBeDefined();
  });

  xit('Testing Edit-Dive Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
    expect(component.buddyListFinder).toBeTruthy();
    expect(component.getDiveInfo).toBeTruthy();
  });
});
