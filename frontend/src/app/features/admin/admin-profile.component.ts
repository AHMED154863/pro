import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Profile, RemoteState } from '../../core/models/portfolio.models';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css',
})
export class AdminProfileComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    professionalTitle: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    professionalSummary: new FormControl('', { nonNullable: true }),
    education: new FormControl('', { nonNullable: true }),
    careerJourney: new FormControl('', { nonNullable: true }),
    professionalGoals: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    linkedInUrl: new FormControl('', { nonNullable: true }),
    githubUsername: new FormControl('', { nonNullable: true }),
  });

  profileState: RemoteState<Profile> = { status: 'loading' };
  errorMessage = '';
  successMessage = '';
  saving = false;
  uploading: 'image' | 'cv' | null = null;

  ngOnInit(): void {
    this.loadProfile();
  }

  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.saving = true;
    this.api.updateAdminProfile(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.profileState = { status: 'loaded', data: response.data };
        this.successMessage = 'Profile saved.';
        this.saving = false;
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.api.describeError(error, 'Unable to save the profile.');
        this.saving = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  uploadFile(event: Event, type: 'image' | 'cv'): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.files?.[0]) {
      return;
    }

    const file = target.files[0];
    this.errorMessage = '';
    this.successMessage = '';
    this.uploading = type;
    this.api.uploadAdminFile(type, file).subscribe({
      next: (response) => {
        this.profileState = { status: 'loaded', data: response.data };
        this.successMessage = type === 'image' ? 'Profile image uploaded.' : 'CV uploaded.';
        this.uploading = null;
        target.value = '';
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.api.describeError(error, 'Unable to upload the selected file.');
        this.uploading = null;
        target.value = '';
        this.changeDetector.markForCheck();
      },
    });
  }

  assetUrl(path: string | undefined): string | null {
    return path ? this.api.assetUrl(path) : null;
  }

  private loadProfile(): void {
    this.api.getAdminProfile().subscribe((state) => {
      this.profileState = state;
      if (state.status === 'loaded') {
        this.form.patchValue({
          name: state.data.name,
          professionalTitle: state.data.professionalTitle,
          professionalSummary: state.data.professionalSummary ?? '',
          education: state.data.education ?? '',
          careerJourney: state.data.careerJourney ?? '',
          professionalGoals: state.data.professionalGoals ?? '',
          email: state.data.email ?? '',
          linkedInUrl: state.data.linkedInUrl ?? '',
          githubUsername: state.data.githubUsername ?? '',
        });
      }
      this.changeDetector.markForCheck();
    });
  }
}
