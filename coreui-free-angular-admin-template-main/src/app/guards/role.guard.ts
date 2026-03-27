import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

type UserRole = 'DIVISION_HEAD' | 'HR' | 'USER';

export const divisionHeadGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userRole: UserRole = 'HR'; 

  const allowedRoles: UserRole[] = ['DIVISION_HEAD', 'HR'];

  if (allowedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};