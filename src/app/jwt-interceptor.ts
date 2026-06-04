import { HttpInterceptorFn } from '@angular/common/http';
import { UserService } from './user-service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const user = inject(UserService).currentUser();

  if (user) {
    const clone = req.clone({ setHeaders: { Authorization: `Bearer ${user.token}` } });
    return next(clone);
  }

  return next(req);
};
