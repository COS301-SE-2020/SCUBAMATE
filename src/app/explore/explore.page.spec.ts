import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ExplorePage } from './explore.page';
import { AppModule } from '../app.module';

fdescribe('ExplorePage', () => {
  let component: ExplorePage;
  let fixture: ComponentFixture<ExplorePage>;
  let responseCode = 200;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ExplorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('Testing Explore Components', () => {
    //expect(component.siteLst).toBeDefined();
    //expect(component.centerLst).toBeDefined();
    expect(component.showSites).toBeFalse();
    expect(component.showCenters).toBeFalse();
    expect(component.showFeed).toBeTrue();
    expect(component.showLoading).toBeTrue();
    //expect(component.pubLst).toBeDefined();
    expect(component.loginLabel).toBeDefined();
  });

  fit('Testing Explore Functionlity', () => {
    //expect(component.ngOnInit).toBeDefined();
    //expect(component.ionViewWillEnter).toBeDefined();
    expect(component.loginClick).toBeDefined();
    expect(component.displayDiveSites).toBeDefined();
    expect(component.displayDiveCenters).toBeDefined();
    expect(component.displayFeed).toBeDefined();
  });
});
