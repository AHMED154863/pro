import { Routes } from '@angular/router';
import { localAdminGuard } from './features/admin/local-admin.guard';

export const routes: Routes = [
  {
    path: 'admin/setup',
    loadComponent: () =>
      import('./features/admin-setup/admin-setup.component').then(
        (module) => module.AdminSetupComponent,
      ),
  },
  {
    path: 'admin',
    canMatch: [localAdminGuard],
    loadComponent: () =>
      import('./features/admin/admin-layout.component').then(
        (module) => module.AdminLayoutComponent,
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/admin-dashboard.component').then(
            (module) => module.AdminDashboardComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/admin/admin-profile.component').then(
            (module) => module.AdminProfileComponent,
          ),
      },
      ...(
        [
          'projects',
          'skills',
          'experiences',
          'education',
          'certifications',
          'messages',
          'settings',
        ] as const
      ).map((collection) => ({
        path: collection,
        data: { collection },
        loadComponent: () =>
          import('./features/admin/admin-resource.component').then(
            (module) => module.AdminResourceComponent,
          ),
      })),
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/public-layout.component').then(
        (module) => module.PublicLayoutComponent,
      ),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then((module) => module.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/about.component').then((module) => module.AboutComponent),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/skills/skills.component').then((module) => module.SkillsComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects.component').then(
            (module) => module.ProjectsComponent,
          ),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./features/project-details/project-details.component').then(
            (module) => module.ProjectDetailsComponent,
          ),
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./features/experience/experience.component').then(
            (module) => module.ExperienceComponent,
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then((module) => module.ContactComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then(
            (module) => module.NotFoundComponent,
          ),
      },
    ],
  },
];
