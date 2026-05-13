import { Component, signal } from '@angular/core';
import { RaceModel } from '../models/RaceModel';

@Component({
  selector: 'pr-races',
  imports: [],
  templateUrl: './races.html',
  styleUrl: './races.css',
})
export class Races {
  protected readonly races = signal<Array<RaceModel>>([
    { id: 1, name: 'Lyon' },
    { id: 2, name: 'London' },
  ]);
}
