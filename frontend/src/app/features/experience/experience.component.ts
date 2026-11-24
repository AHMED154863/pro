import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './experience.component.html',
})
export class ExperienceComponent {
  private readonly api = inject(PortfolioApiService);
  readonly experiences$ = this.api.getExperiences();
  readonly education$ = this.api.getEducation();
  readonly certifications$ = this.api.getCertifications();
}
