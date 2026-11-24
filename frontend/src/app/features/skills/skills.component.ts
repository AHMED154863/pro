import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Skill, SkillCategory } from '../../core/models/portfolio.models';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { ScrollRevealDirective } from '../../core/directives/scroll-reveal.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [AsyncPipe, ScrollRevealDirective],
  templateUrl: './skills.component.html',
})
export class SkillsComponent {
  readonly skills$ = inject(PortfolioApiService).getSkills();
  readonly categories: SkillCategory[] = [
    'Frontend',
    'Backend',
    'Database',
    'Programming Languages',
    'Tools & Technologies',
  ];

  skillsForCategory(skills: Skill[], category: SkillCategory): Skill[] {
    return skills.filter((skill) => skill.category === category);
  }
}
