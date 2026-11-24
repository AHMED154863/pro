import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { ScrollRevealDirective } from '../../core/directives/scroll-reveal.directive';
import { ProjectCardComponent } from '../../shared/project-card/project-card.component';
import { Project } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, RouterLink, ScrollRevealDirective, ProjectCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly router = inject(Router);

  readonly profile$ = this.api.getProfile();
  readonly skills$ = this.api.getSkills();
  readonly experiences$ = this.api.getExperiences();
  readonly projects$ = this.api.projects$;

  featuredProjects(projects: Project[]): Project[] {
    return projects.filter((project) => project.featured);
  }

  assetUrl(path: string): string {
    return this.api.assetUrl(path);
  }

  ngOnInit(): void {
    this.api.loadProjects();
  }

  openProject(id: string): void {
    this.router.navigate(['/projects', id]);
  }

  retryProjects(): void {
    this.api.loadProjects(true);
  }
}
