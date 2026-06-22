import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, max, min, minLength, required, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BirthYearInput } from '../birth-year-input/birth-year-input';
import { UserService } from '../user-service';

@Component({
  selector: 'pr-register',
  imports: [FormRoot, FormField, BirthYearInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  protected readonly registrationFailed = signal(false);

  protected readonly userForm = form(
    signal({
      login: '',
      password: '',
      confirmPassword: '',
      birthYear: null as number | null
    }),
    path => {
      required(path.login);
      minLength(path.login, 3);
      required(path.password);
      required(path.confirmPassword);
      validate(path.confirmPassword, context => {
        const password = context.valueOf(path.password);
        const confirmPassword = context.value();
        return password === confirmPassword ? undefined : { kind: 'matchingError' };
      });
      required(path.birthYear);
      min(path.birthYear, 1900);
      max(path.birthYear, new Date().getFullYear());
    },
    { submission: { action: () => this.register() } }
  );

  private async register() {
    this.registrationFailed.set(false);
    const { login, password, birthYear } = this.userForm().value();

    try {
      await firstValueFrom(this.userService.register(login, password, birthYear!));
      this.router.navigateByUrl('/');
    } catch {
      this.registrationFailed.set(true);
    }
  }
}
