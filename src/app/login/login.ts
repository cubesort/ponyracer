import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'pr-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  protected readonly authenticationFailed = signal(false);

  protected readonly loginControl = this.fb.control('', [Validators.required]);
  protected readonly passwordControl = this.fb.control('', [Validators.required]);

  protected readonly loginForm = this.fb.group({
    login: this.loginControl,
    password: this.passwordControl
  });

  protected authenticate(): void {
    this.authenticationFailed.set(false);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.userService.authenticate(this.loginControl.value, this.passwordControl.value).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: () => {
        this.authenticationFailed.set(true);
      }
    });
  }
}
