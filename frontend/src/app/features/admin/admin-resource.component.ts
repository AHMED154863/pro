import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AdminFieldValue,
  AdminRecord,
  AdminRecordInput,
  RemoteState,
} from '../../core/models/portfolio.models';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import {
  AdminField,
  AdminResourceConfig,
  adminResources,
  isAdminCollection,
} from './admin-resources';

type FormValue = string | number | boolean;

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-admin-resource',
  templateUrl: './admin-resource.component.html',
  styleUrl: './admin-resource.component.css',
})
export class AdminResourceComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly config: AdminResourceConfig;
  readonly form = new FormRecord<FormControl<FormValue>>({});
  records: AdminRecord[] = [];
  loading = true;
  saving = false;
  editingId: string | null = null;
  errorMessage = '';
  successMessage = '';

  constructor() {
    const collectionValue: unknown = this.route.snapshot.data['collection'];
    if (typeof collectionValue !== 'string' || !isAdminCollection(collectionValue)) {
      throw new Error('An admin collection route is required');
    }
    const collection = collectionValue;
    this.config = adminResources[collection];

    for (const field of this.config.fields) {
      const validators = field.required ? [Validators.required] : [];
      if (field.type === 'number' && field.key === 'proficiency') {
        validators.push(Validators.min(0), Validators.max(100));
      }

      this.form.addControl(
        field.key,
        new FormControl<FormValue>(this.defaultValue(field), {
          nonNullable: true,
          validators,
        }),
      );
    }
  }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.api.getAdminRecords(this.config.collection).subscribe((state) => {
      this.loading = false;
      if (state.status === 'loaded') {
        this.records = state.data;
        this.errorMessage = '';
      } else if (state.status === 'error') {
        this.errorMessage = state.message;
      }
      this.changeDetector.markForCheck();
    });
  }

  editRecord(record: AdminRecord): void {
    this.editingId = record._id;
    for (const field of this.config.fields) {
      this.form.controls[field.key].setValue(
        this.toFormValue(this.getValue(record, field.key), field),
      );
    }
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.resetForm();
  }

  saveRecord(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const payload = this.buildPayload();
    this.errorMessage = '';
    this.successMessage = '';
    this.saving = true;

    const request = this.editingId
      ? this.api.updateAdminRecord(this.config.collection, this.editingId, payload)
      : this.api.createAdminRecord(this.config.collection, payload);

    request.subscribe({
      next: () => {
        this.successMessage = this.editingId ? 'Changes saved.' : 'Item created.';
        this.editingId = null;
        this.saving = false;
        this.resetForm();
        this.loadRecords();
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.api.describeError(error, 'Unable to save this item.');
        this.saving = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  deleteRecord(record: AdminRecord): void {
    if (!window.confirm('Delete this item? This cannot be undone.')) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.api.deleteAdminRecord(this.config.collection, record._id).subscribe({
      next: () => {
        this.successMessage = 'Item deleted.';
        if (this.editingId === record._id) {
          this.cancelEdit();
        }
        this.loadRecords();
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.api.describeError(error, 'Unable to delete this item.');
        this.changeDetector.markForCheck();
      },
    });
  }

  toggleMessageReadState(record: AdminRecord): void {
    if (!('isRead' in record)) {
      return;
    }

    this.api.setAdminMessageReadState(record._id, !record.isRead).subscribe({
      next: () => {
        this.successMessage = record.isRead ? 'Message marked unread.' : 'Message marked read.';
        this.loadRecords();
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.api.describeError(error, 'Unable to update message status.');
        this.changeDetector.markForCheck();
      },
    });
  }

  displayValue(record: AdminRecord, field: AdminField): string {
    const value = this.getValue(record, field.key);
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
      return String(value);
    }
    if (typeof value === 'string' && field.type === 'date' && value) {
      const date = new Date(value);
      return Number.isNaN(date.valueOf()) ? value : date.toLocaleDateString();
    }
    return typeof value === 'string' && value ? value : '—';
  }

  private getValue(record: AdminRecord, key: string): AdminFieldValue | undefined {
    const entry = Object.entries(record).find(([recordKey]) => recordKey === key);
    const value: unknown = entry?.[1];
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null ||
      (Array.isArray(value) && value.every((item) => typeof item === 'string'))
    ) {
      return value as AdminFieldValue;
    }
    return undefined;
  }

  private toFormValue(value: AdminFieldValue | undefined, field: AdminField): FormValue {
    if (field.type === 'checkbox') {
      return value === true;
    }
    if (field.type === 'number') {
      return typeof value === 'number' ? value : '';
    }
    if (field.type === 'list') {
      return Array.isArray(value) ? value.join('\n') : '';
    }
    if (field.type === 'date' && typeof value === 'string') {
      return value.slice(0, 10);
    }
    return typeof value === 'string' ? value : '';
  }

  private defaultValue(field: AdminField): FormValue {
    return field.type === 'checkbox' ? false : '';
  }

  private buildPayload(): AdminRecordInput {
    const payload: AdminRecordInput = {};
    for (const field of this.config.fields) {
      const value = this.form.controls[field.key].value;
      if (field.type === 'list') {
        payload[field.key] =
          typeof value === 'string'
            ? value
                .split(/\r?\n/)
                .map((item) => item.trim())
                .filter(Boolean)
            : [];
      } else if (field.type === 'number' && value === '') {
        payload[field.key] = null;
      } else {
        payload[field.key] = value;
      }
    }
    return payload;
  }

  private resetForm(): void {
    for (const field of this.config.fields) {
      this.form.controls[field.key].setValue(this.defaultValue(field));
    }
  }
}
