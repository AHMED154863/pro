import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer.component';
import { SiteNavbarComponent } from '../../shared/site-navbar/site-navbar.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, SiteNavbarComponent, SiteFooterComponent],
  templateUrl: './public-layout.component.html',
})
export class PublicLayoutComponent {}
