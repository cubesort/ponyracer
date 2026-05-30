import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pr-birth-year-input',
  imports: [],
  templateUrl: './birth-year-input.html',
  styleUrl: './birth-year-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BirthYearInput),
      multi: true
    }
  ]
})
export class BirthYearInput implements ControlValueAccessor {
  readonly inputId = input.required();

  protected readonly value = signal<number | null>(null);
  protected readonly disabled = signal(false);
  protected readonly formattedYear = computed(() => BirthYearInput.computeYear(this.value()));

  protected onChange!: (value: number | null) => void;
  protected onTouched!: () => void;

  writeValue(value: number | null): void {
    this.value.set(value);
  }

  registerOnChange(onChange: (value: number | null) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onBirthYearChange(event: Event) {
    const birthYear = (event.target as HTMLInputElement).valueAsNumber;

    this.value.set(isNaN(birthYear) ? null : birthYear);

    this.onChange(this.formattedYear());
  }

  private static computeYear(value: number | null) {
    if (value === null) {
      return null;
    }

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
