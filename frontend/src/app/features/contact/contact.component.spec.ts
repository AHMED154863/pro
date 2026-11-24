import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContactComponent } from './contact.component';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';

describe('ContactComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        {
          provide: PortfolioApiService,
          useValue: {
            getProfile: () =>
              of({
                status: 'loaded',
                data: { name: 'Portfolio owner', professionalTitle: 'Developer' },
              }),
            submitContactMessage: () => throwError(() => new HttpErrorResponse({ status: 0 })),
            describeError: () => 'The portfolio API is unavailable. Please try again later.',
          },
        },
      ],
    }).compileComponents();
  });

  it('shows the API error and re-enables submission after a failed request', async () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    fixture.componentInstance.contactForm.setValue({
      name: 'Visitor',
      email: 'visitor@example.com',
      subject: 'Project inquiry',
      message: 'Please contact me about a project.',
    });

    fixture.componentInstance.submit();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'The portfolio API is unavailable',
    );
    expect((element.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(
      false,
    );
  });
});
