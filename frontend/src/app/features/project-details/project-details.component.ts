import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { Project } from '../../core/models/portfolio.models';
import { ProjectCardComponent } from '../../shared/project-card/project-card.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [AsyncPipe, RouterLink, ProjectCardComponent],
  templateUrl: './project-details.component.html',
})
export class ProjectDetailsComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly projectState$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) =>
      id
        ? this.api.getProject(id)
        : of({ status: 'error', message: 'Project identifier is missing.' } as const),
    ),
  );
  readonly projects$ = this.api.projects$;

  ngOnInit(): void {
    this.api.loadProjects();
  }

  relatedProjects(project: Project, projects: Project[]): Project[] {
    const projectTechnologies = new Set(project.technologies);
    return projects
      .filter(
        (candidate) =>
          candidate._id !== project._id &&
          candidate.technologies.some((technology) => projectTechnologies.has(technology)),
      )
      .slice(0, 3);
  }

  openProject(id: string): void {
    this.router.navigate(['/projects', id]);
  }

  assetUrl(path: string): string {
    return this.api.assetUrl(path);
  }
}
