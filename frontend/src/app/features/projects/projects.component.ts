import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Project, RemoteState } from '../../core/models/portfolio.models';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { ProjectCardComponent } from '../../shared/project-card/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ProjectCardComponent],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly router = inject(Router);

  readonly projects$ = this.api.projects$;
  searchTerm = '';
  selectedCategory = '';
  selectedTechnology = '';

  ngOnInit(): void {
    this.api.loadProjects();
  }

  categories(projects: Project[]): string[] {
    return [
      ...new Set(
        projects
          .map((project) => project.category)
          .filter((category): category is string => Boolean(category)),
      ),
    ].sort();
  }

  technologies(projects: Project[]): string[] {
    return [...new Set(projects.flatMap((project) => project.technologies))].sort();
  }

  visibleProjects(state: RemoteState<Project[]>): Project[] {
    if (state.status !== 'loaded') {
      return [];
    }

    const search = this.searchTerm.trim().toLowerCase();
    return state.data.filter((project) => {
      const matchesSearch =
        !search ||
        `${project.title} ${project.summary} ${project.technologies.join(' ')}`
          .toLowerCase()
          .includes(search);
      const matchesCategory = !this.selectedCategory || project.category === this.selectedCategory;
      const matchesTechnology =
        !this.selectedTechnology || project.technologies.includes(this.selectedTechnology);

      return matchesSearch && matchesCategory && matchesTechnology;
    });
  }

  openProject(id: string): void {
    this.router.navigate(['/projects', id]);
  }

  retry(): void {
    this.api.loadProjects(true);
  }
}
