import { Component, computed, input, output } from '@angular/core';
import { PonyModel } from '../models/pony-model';

@Component({
  selector: 'pr-pony',
  imports: [],
  templateUrl: './pony.html',
  styleUrl: './pony.css',
})
export class Pony {
  readonly ponyModel = input.required<PonyModel>();

  readonly ponySelected = output<PonyModel>();

  readonly ponyImageUrl = computed(
    () => `images/pony-${this.ponyModel().color.toLocaleLowerCase()}.gif`,
  );

  protected selectPony() {
    this.ponySelected.emit(this.ponyModel());
  }
}
