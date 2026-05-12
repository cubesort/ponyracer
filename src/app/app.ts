import { Component, signal } from '@angular/core';
import { Menu } from './menu/menu';

@Component({
  selector: 'pr-root',
  imports: [Menu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ponyracer');
}
