import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-site-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-navbar.component.html',
})
export class SiteNavbarComponent {
  menuOpen = false;

  closeMenu(): void {
    this.menuOpen = false;
  }
}
