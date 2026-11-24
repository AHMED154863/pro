import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { ScrollRevealDirective } from '../../core/directives/scroll-reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [AsyncPipe, RouterLink, ScrollRevealDirective],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  private readonly api = inject(PortfolioApiService);
  readonly profile$ = this.api.getProfile();
  readonly education$ = this.api.getEducation();
}
