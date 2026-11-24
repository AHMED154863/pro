import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminDashboard, RemoteState } from '../../core/models/portfolio.models';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  state: RemoteState<AdminDashboard> = { status: 'loading' };

  ngOnInit(): void {
    this.api.getAdminDashboard().subscribe((state) => {
      this.state = state;
      this.changeDetector.markForCheck();
    });
  }
}
