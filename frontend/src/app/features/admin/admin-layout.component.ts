import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  readonly navigation = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/profile', label: 'Profile' },
    { path: '/admin/projects', label: 'Projects' },
    { path: '/admin/skills', label: 'Skills' },
    { path: '/admin/experiences', label: 'Experience' },
    { path: '/admin/education', label: 'Education' },
    { path: '/admin/certifications', label: 'Certifications' },
    { path: '/admin/messages', label: 'Messages' },
    { path: '/admin/settings', label: 'Settings' },
  ];
}
