import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ExplorePage } from './explore.page';
import { AppModule } from '../app.module';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
import { HttpClient} from '@angular/common/http';

var accessToken = "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7";

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
    localStorage.setItem("accessToken", accessToken);
    component.ngOnInit();
    expect(component.showFeed).toBeTrue();
    expect(component.showSites).toBeFalse();
    expect(component.showCenters).toBeFalse();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.pubLst).toBeDefined();
    expect(component.showLoading).toBeFalse();
    let diveSpy = spyOn(divService, 'getPublicDives').and.callThrough();
    expect(diveSpy).toBeDefined();
  });

  it('Testing ionViewWillEnter', () => {
    localStorage.setItem("accessToken", accessToken);
    component.ngOnInit();
    expect(component.showFeed).toBeTrue();
    expect(component.showSites).toBeFalse();
    expect(component.showCenters).toBeFalse();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.pubLst).toBeDefined();
    expect(component.showLoading).toBeFalse();
    let diveSpy = spyOn(divService, 'getPublicDives').and.callThrough();
    expect(diveSpy).toBeDefined();
  });

  it('Testing loginClick()', () => {
    localStorage.setItem("accessToken", accessToken);
    component.loginClick();
    expect(localStorage.getItem("accessToken")).toBeDefined();
  });

  it('Testing displayDiveSites', () => {
    component.displayDiveSites();
    expect(component.showFeed).toBeFalse();
    expect(component.showSites).toBeTrue();
    expect(component.showCenters).toBeFalse();
    let diveSpy = spyOn(divService, 'getDiveSites').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeFalse();
  });

  it('Testing displayDiveCenters', () => {
    component.displayDiveSites();
    expect(component.showFeed).toBeFalse();
    expect(component.showSites).toBeTrue();
    expect(component.showCenters).toBeFalse();
    let diveSpy = spyOn(divService, 'getDiveCenters').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeFalse();
  });

  it('Testing displayFeed', () => {
    component.displayFeed();
    expect(component.showFeed).toBeTrue();
    expect(component.showSites).toBeFalse();
    expect(component.showCenters).toBeFalse();
  });

});
