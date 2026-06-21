import { Component, inject, signal } from '@angular/core';
import { UserService } from '../user-service';
import { Router } from '@angular/router';
import { form, required, FormRoot, FormField } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'pr-login',
  imports: [FormRoot, FormField],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly credentials = signal({
    login: '',
    password: ''
  });

  protected readonly authenticationFailed = signal(false);

  protected readonly loginForm = form(
    this.credentials,
    path => {
      required(path.login);
      required(path.password);
    },
    { submission: { action: () => this.authenticate() } }
  );

  private async authenticate() {
    this.authenticationFailed.set(false);
    const { login, password } = this.loginForm().value();
    try {
      await firstValueFrom(this.userService.authenticate(login, password));
      this.router.navigateByUrl('/');
    } catch {
      this.authenticationFailed.set(true);
    }
  }
}
