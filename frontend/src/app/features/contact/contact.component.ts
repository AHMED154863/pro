import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { nonWhitespaceValidator } from '../../core/validators/non-whitespace.validator';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private readonly api = inject(PortfolioApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly profile$ = this.api.getProfile();

  readonly contactForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        nonWhitespaceValidator(),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    subject: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150),
        nonWhitespaceValidator(),
      ],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5000),
        nonWhitespaceValidator(),
      ],
    }),
  });

  submitting = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.api
      .submitContactMessage(this.contactForm.getRawValue())
      .pipe(
        finalize(() => {
          this.submitting = false;
          this.changeDetector.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          this.successMessage = response.message ?? 'Your message was sent.';
          this.contactForm.reset();
          this.changeDetector.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.api.describeError(
            error,
            'Your message could not be sent. Please try again later.',
          );
          this.changeDetector.markForCheck();
        },
      });
  }
}
