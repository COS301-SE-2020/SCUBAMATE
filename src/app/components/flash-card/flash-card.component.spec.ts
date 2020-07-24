import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlashCardComponent } from './flash-card.component';

describe('FlashCardComponent', () => {
  let component: FlashCardComponent;
  let fixture: ComponentFixture<FlashCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlashCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Successfully Created Flas-Card Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing flip()', () => {
    component.flip();
    expect(component.flipped).toBe(true);
  }); 
});
