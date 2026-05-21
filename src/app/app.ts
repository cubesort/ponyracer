import { Component } from '@angular/core';
import { Menu } from './menu/menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'pr-root',
  imports: [Menu, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
