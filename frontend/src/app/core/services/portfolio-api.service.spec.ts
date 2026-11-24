import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PortfolioApiService } from './portfolio-api.service';
import { AdminDashboard, RemoteState } from '../models/portfolio.models';
import { Project } from '../models/portfolio.models';

describe('PortfolioApiService', () => {
  let service: PortfolioApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PortfolioApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('shares loaded projects through its BehaviorSubject without refetching', () => {
    const states: RemoteState<Project[]>[] = [];
    service.projects$.subscribe((state) => states.push(state));

    service.loadProjects();
    expect(states.at(-1)?.status).toBe('loading');

    const request = httpTesting.expectOne('http://localhost:3001/api/v1/projects');
    request.flush({ success: true, data: [] });

    expect(states.at(-1)).toEqual({ status: 'loaded', data: [] });

    service.loadProjects();
    httpTesting.expectNone('http://localhost:3001/api/v1/projects');
  });

  it('loads dashboard statistics from the local admin API', () => {
    const states: RemoteState<AdminDashboard>[] = [];
    service.getAdminDashboard().subscribe((state) => states.push(state));

    const request = httpTesting.expectOne('http://localhost:3001/api/v1/admin/dashboard');
    request.flush({
      success: true,
      data: {
        totalProjects: 1,
        totalSkills: 2,
        totalMessages: 3,
        unreadMessages: 1,
        recentActivities: [],
      },
    });

    expect(states.at(-1)).toEqual({
      status: 'loaded',
      data: {
        totalProjects: 1,
        totalSkills: 2,
        totalMessages: 3,
        unreadMessages: 1,
        recentActivities: [],
      },
    });
  });

  it('sends admin resource creation to the local admin collection endpoint', () => {
    service
      .createAdminRecord('projects', {
        title: 'Local test project',
        slug: 'local-test-project',
        summary: 'A temporary service test',
        features: [],
        technologies: [],
        screenshots: [],
        featured: false,
      })
      .subscribe();

    const request = httpTesting.expectOne('http://localhost:3001/api/v1/admin/projects');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.title).toBe('Local test project');
    request.flush({
      success: true,
      data: {
        _id: 'test-id',
        title: 'Local test project',
        slug: 'local-test-project',
        summary: 'A temporary service test',
        features: [],
        technologies: [],
        screenshots: [],
        featured: false,
      },
    });
  });
});
