import { Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../user-service';
import { Router } from '@angular/router';
import { BirthYearInput } from '../birth-year-input/birth-year-input';

@Component({
  selector: 'pr-register',
  imports: [ReactiveFormsModule, BirthYearInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  protected readonly registrationFailed = signal(false);

  protected readonly loginCtrl = this.fb.control('', [Validators.required, Validators.minLength(3)]);
  protected readonly passwordCtrl = this.fb.control('', [Validators.required]);
  protected readonly confirmPasswordCtrl = this.fb.control('', [Validators.required]);
  protected readonly birthYearCtrl = this.fb.control<number | null>(null, [
    Validators.required,
    Validators.min(1900),
    Validators.max(new Date().getFullYear())
  ]);

  protected readonly passwordGroup = this.fb.group(
    {
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    },
    { validators: [Register.passwordMatch] }
  );

  protected readonly userForm = this.fb.group({
    login: this.loginCtrl,
    passwordGroup: this.passwordGroup,
    birthYear: this.birthYearCtrl
  });

  protected register() {
    this.registrationFailed.set(false);

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const {
      login,
      passwordGroup: { password },
      birthYear
    } = this.userForm.getRawValue();

    this.userService.register(login, password, birthYear!).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.registrationFailed.set(true);
      }
    });
  }

  private static passwordMatch(group: AbstractControl<{ password: string; confirmPassword: string }>): ValidationErrors | null {
    return group.value.password === group.value.confirmPassword ? null : { matchingError: true };
  }
}
