import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminSetupComponent } from './admin-setup.component';

describe('AdminSetupComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSetupComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('explains the local-only admin scope without exposing management controls on the setup page', () => {
    const fixture = TestBed.createComponent(AdminSetupComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Admin tools run locally');
    expect(element.textContent).toContain('Do not expose this backend');
    expect(element.querySelector('form, input, button')).toBeNull();
    expect(element.querySelector('a[routerLink="/admin/dashboard"]')).not.toBeNull();
    expect(element.querySelector('a[routerLink="/home"]')).not.toBeNull();
  });
});
