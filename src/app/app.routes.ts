import { Routes } from '@angular/router';
import { Races } from './races/races';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'races', component: Races }
];
