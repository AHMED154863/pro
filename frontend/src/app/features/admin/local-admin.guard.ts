import { isDevMode } from '@angular/core';
import { CanMatchFn } from '@angular/router';

export const localAdminGuard: CanMatchFn = () => isDevMode();
