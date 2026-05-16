import { Component, inject, signal } from '@angular/core';
import { Race } from '../race/race';
import { RaceService } from '../race-service';

@Component({
  selector: 'pr-races',
  imports: [Race],
  templateUrl: './races.html',
  styleUrl: './races.css',
})
export class Races {
  private readonly raceService = inject(RaceService);

  protected readonly races = signal(this.raceService.list());
}
