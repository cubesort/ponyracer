import { Component } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'pr-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  readonly navbarCollapsed = signal(true);

  toggleNavbar() {
    this.navbarCollapsed.update((navbarCollapsed) => !navbarCollapsed);
  }
}
