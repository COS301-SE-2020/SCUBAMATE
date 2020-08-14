import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ExplorePage } from './explore.page';
import { AppModule } from '../app.module';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
import { HttpClient} from '@angular/common/http';

describe('ExplorePage', () => {
  let component: ExplorePage;
  let fixture: ComponentFixture<ExplorePage>;
  let responseCode = 200;
  let router; Router;
  let divService: diveService;
  let http: HttpClient;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), AppModule],
      providers: [diveService]
    }).compileComponents();

    fixture = TestBed.createComponent(ExplorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = new diveService(http, router);
    router = TestBed.get(Router);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Explore Components', () => {
    expect(component.siteLst).toBeUndefined();
    expect(component.centerLst).toBeUndefined();
    expect(component.showSites).toBeFalse();
    expect(component.showCenters).toBeFalse();
    expect(component.showFeed).toBeTrue();
    expect(component.showLoading).toBeTrue();
    expect(component.pubLst).toBeDefined();
    expect(component.loginLabel).toBe("Log Out");
  });

  it('Testing Explore Functionlity', () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.ionViewWillEnter).toBeDefined();
    expect(component.loginClick).toBeDefined();
    expect(component.displayDiveSites).toBeDefined();
    expect(component.displayDiveCenters).toBeDefined();
    expect(component.displayFeed).toBeDefined();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.showFeed).toBeTrue();
    expect(component.showSites).toBeFalse();
    expect(component.showCenters).toBeFalse();
    expect(component.showLoading).toBeTrue();
    expect(component.pubLst).toBeDefined();
    expect(component.loginLabel).toBe("Log Out");
  });

  it('Testing ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(component.showFeed).toBeTrue();
    expect(component.showSites).toBeFalse();
    expect(component.showCenters).toBeFalse();
    expect(component.showLoading).toBeTrue();
    expect(component.pubLst).toBeDefined();
    expect(component.loginLabel).toBe("Log Out");
  });

  it('Testing loginClick()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.loginClick();
    expect(navigateSpy).toHaveBeenCalledWith(['login']);
  });

  it('Testing displayDiveSites', () => {
    component.displayDiveSites();
    expect(component.showLoading).toBeTrue();
    expect(component.showFeed).toBeFalse();
    expect(component.showSites).toBeTrue();
    expect(component.showCenters).toBeFalse();
    // let diveSpy = spyOn(diveService, '').and.callThrough();
    // expect(diveSpy).toBeDefined();
  });

  it('Testing displayDiveCenters', () => {
    component.displayDiveCenters();
    expect(component.showLoading).toBeTrue();
    expect(component.showFeed).toBeFalse();
    expect(component.showSites).toBeTrue();
    expect(component.showCenters).toBeFalse();
  });

  it('Testing displayFeed', () => {
    component.displayFeed();
    expect(component.showFeed).toBeTrue();
    expect(component.showSites).toBeFalse();
    expect(component.showCenters).toBeFalse();
  });

});
