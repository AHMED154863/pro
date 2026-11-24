import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay } from 'rxjs';
import {
  ApiResponse,
  AdminCollection,
  AdminDashboard,
  AdminRecord,
  AdminRecordInput,
  Certification,
  ContactMessage,
  Education,
  Experience,
  Profile,
  Project,
  RemoteState,
  Skill,
  SubmittedContactMessage,
} from '../models/portfolio.models';

const API_BASE_URL = 'http://localhost:3001/api/v1';
const API_ORIGIN = 'http://localhost:3001';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private readonly http = inject(HttpClient);
  private readonly projectsState = new BehaviorSubject<RemoteState<Project[]>>({
    status: 'idle',
  });

  readonly projects$ = this.projectsState.asObservable();

  getProfile(): Observable<RemoteState<Profile>> {
    return this.getResource<Profile>('profile');
  }

  getSkills(): Observable<RemoteState<Skill[]>> {
    return this.getResource<Skill[]>('skills');
  }

  getExperiences(): Observable<RemoteState<Experience[]>> {
    return this.getResource<Experience[]>('experiences');
  }

  getEducation(): Observable<RemoteState<Education[]>> {
    return this.getResource<Education[]>('education');
  }

  getCertifications(): Observable<RemoteState<Certification[]>> {
    return this.getResource<Certification[]>('certifications');
  }

  getAdminDashboard(): Observable<RemoteState<AdminDashboard>> {
    return this.getResource<AdminDashboard>('admin/dashboard');
  }

  getAdminProfile(): Observable<RemoteState<Profile>> {
    return this.getResource<Profile>('admin/profile');
  }

  getAdminRecords(collection: AdminCollection): Observable<RemoteState<AdminRecord[]>> {
    return this.getResource<AdminRecord[]>(`admin/${collection}`);
  }

  updateAdminProfile(profile: Partial<Profile>): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(`${API_BASE_URL}/admin/profile`, profile);
  }

  createAdminRecord(
    collection: AdminCollection,
    record: AdminRecordInput,
  ): Observable<ApiResponse<AdminRecord>> {
    return this.http.post<ApiResponse<AdminRecord>>(`${API_BASE_URL}/admin/${collection}`, record);
  }

  updateAdminRecord(
    collection: AdminCollection,
    id: string,
    record: AdminRecordInput,
  ): Observable<ApiResponse<AdminRecord>> {
    return this.http.put<ApiResponse<AdminRecord>>(
      `${API_BASE_URL}/admin/${collection}/${encodeURIComponent(id)}`,
      record,
    );
  }

  deleteAdminRecord(collection: AdminCollection, id: string): Observable<ApiResponse<AdminRecord>> {
    return this.http.delete<ApiResponse<AdminRecord>>(
      `${API_BASE_URL}/admin/${collection}/${encodeURIComponent(id)}`,
    );
  }

  setAdminMessageReadState(
    id: string,
    isRead: boolean,
  ): Observable<ApiResponse<SubmittedContactMessage>> {
    return this.http.put<ApiResponse<SubmittedContactMessage>>(
      `${API_BASE_URL}/admin/messages/${encodeURIComponent(id)}`,
      { isRead },
    );
  }

  uploadAdminFile(type: 'image' | 'cv', file: File): Observable<ApiResponse<Profile>> {
    const formData = new FormData();
    formData.append(type, file);
    return this.http.post<ApiResponse<Profile>>(`${API_BASE_URL}/admin/profile/${type}`, formData);
  }

  getProject(id: string): Observable<RemoteState<Project>> {
    return this.getResource<Project>(`projects/${encodeURIComponent(id)}`);
  }

  loadProjects(force = false): void {
    const currentStatus = this.projectsState.value.status;
    if (!force && (currentStatus === 'loading' || currentStatus === 'loaded')) {
      return;
    }

    this.projectsState.next({ status: 'loading' });
    this.http.get<ApiResponse<Project[]>>(`${API_BASE_URL}/projects`).subscribe({
      next: (response) => {
        this.projectsState.next({ status: 'loaded', data: response.data });
      },
      error: (error: HttpErrorResponse) => {
        this.projectsState.next({
          status: 'error',
          message: this.getErrorMessage(error),
        });
      },
    });
  }

  submitContactMessage(message: ContactMessage): Observable<ApiResponse<SubmittedContactMessage>> {
    return this.http.post<ApiResponse<SubmittedContactMessage>>(
      `${API_BASE_URL}/messages`,
      message,
    );
  }

  assetUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
  }

  describeError(
    error: HttpErrorResponse,
    fallback = 'Unable to load portfolio information.',
  ): string {
    return this.getErrorMessage(error, fallback);
  }

  private getResource<T>(path: string): Observable<RemoteState<T>> {
    return this.http.get<ApiResponse<T>>(`${API_BASE_URL}/${path}`).pipe(
      map((response) => ({ status: 'loaded', data: response.data }) as const),
      catchError((error: HttpErrorResponse) =>
        of({
          status: 'error',
          message: this.getErrorMessage(error),
        } as const),
      ),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  private getErrorMessage(
    error: HttpErrorResponse,
    fallback = 'Unable to load portfolio information.',
  ): string {
    if (error.status === 0) {
      return 'The portfolio API is unavailable. Please try again later.';
    }
    if (error.status === 404) {
      return 'This portfolio information has not been added yet.';
    }

    const body: unknown = error.error;
    if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
      return body.message;
    }

    return fallback;
  }
}
