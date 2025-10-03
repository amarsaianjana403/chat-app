import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppQrComponent } from './app-qr.component';

describe('AppQrComponent', () => {
  let component: AppQrComponent;
  let fixture: ComponentFixture<AppQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppQrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
