import { Component, inject } from '@angular/core';
import { signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user-service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'pr-menu',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  readonly userService = inject(UserService);
  readonly router = inject(Router);

  protected readonly navbarCollapsed = signal(true);
  protected readonly user = this.userService.currentUser;

  toggleNavbar() {
    this.navbarCollapsed.update(navbarCollapsed => !navbarCollapsed);
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl('/');
  }
}
