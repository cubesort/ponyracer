import { Component, input, model, output } from '@angular/core';
import { FormValueControl, transformedValue } from '@angular/forms/signals';

@Component({
  selector: 'pr-birth-year-input',
  imports: [],
  templateUrl: './birth-year-input.html',
  styleUrl: './birth-year-input.css'
})
export class BirthYearInput implements FormValueControl<number | null> {
  readonly value = model.required<number | null>();

  readonly inputId = input.required();
  readonly touched = input.required<boolean>();
  readonly disabled = input.required<boolean>();
  readonly invalid = input.required<boolean>();

  readonly touch = output<void>();

  protected readonly rawValue = transformedValue(this.value, {
    parse: (raw: number | null) => {
      return { value: raw === null || isNaN(raw) ? null : BirthYearInput.computeYear(raw) };
    },
    format: (value: number | null) => value ?? null
  });

  protected onBirthYearChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.rawValue.set(value);
  }

  private static computeYear(value: number) {
    if (value < 0 || value > 100) {
      return value;
    }

    const lastTwoDigitsOfTheCurrentYear = new Date().getFullYear() % 100;
    const firstTwoDigitsOfTheCurrentYear = Math.floor(new Date().getFullYear() / 100);

    if (value > lastTwoDigitsOfTheCurrentYear) {
      return (firstTwoDigitsOfTheCurrentYear - 1) * 100 + value;
    }

    return firstTwoDigitsOfTheCurrentYear * 100 + value;
  }
}
