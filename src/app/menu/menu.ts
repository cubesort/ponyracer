import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pr-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  readonly navbarCollapsed = signal(true);

  toggleNavbar() {
    this.navbarCollapsed.update(navbarCollapsed => !navbarCollapsed);
  }
}
