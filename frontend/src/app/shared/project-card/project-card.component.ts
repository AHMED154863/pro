import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Project } from '../../core/models/portfolio.models';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  templateUrl: './project-card.component.html',
})
export class ProjectCardComponent {
  private readonly api = inject(PortfolioApiService);

  @Input({ required: true }) project!: Project;
  @Output() projectSelected = new EventEmitter<string>();

  assetUrl(path: string): string {
    return this.api.assetUrl(path);
  }
}
