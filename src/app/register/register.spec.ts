import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Mocked } from 'vitest';
import { Locator, page, userEvent } from 'vitest/browser';
import { UserModel } from '../models/user-model';
import { UserService } from '../user-service';
import { Register } from './register';

class RegisterTester {
  readonly fixture: ComponentFixture<unknown>;
  readonly root: Locator;
  constructor(readonly harness: RouterTestingHarness) {
    this.fixture = harness.fixture;
    this.root = page.elementLocator(this.fixture.nativeElement);
  }

  readonly title = page.getByRole('heading', { level: 1 });
  readonly loginInput = page.getByLabelText('Login');
  readonly passwordInput = page.getByLabelText('Password', { exact: true });
  readonly passwordConfirmationInput = page.getByLabelText('Confirm password');
  readonly birthYearInput = page.getByLabelText('Birth year');
  readonly submitButton = page.getByRole('button', { name: "Let's go!" });
  readonly alert = page.getByRole('alert');
}

describe('Register', () => {
  let userService: Pick<Mocked<UserService>, 'register'>;

  beforeEach(() => {
    userService = { register: vi.fn().mockName('UserService.register') };
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'register', component: Register }]), { provide: UserService, useValue: userService }]
    });
  });

  it('should validate the login input', async () => {
    const tester = new RegisterTester(await RouterTestingHarness.create('/register'));

    await expect.element(tester.loginInput).toBeVisible();

    await tester.loginInput.fill('');
    await userEvent.tab();

    await expect.element(tester.root).toHaveTextContent('Login is required');

    await tester.loginInput.fill('Cé');
    await userEvent.tab();

    await expect.element(tester.root).toHaveTextContent('Your login should be at least 3 characters');

    await tester.loginInput.fill('Cédric');
    await userEvent.tab();
  });

  it('should validate the password input', async () => {
    const tester = new RegisterTester(await RouterTestingHarness.create('/register'));

    await expect.element(tester.passwordInput).toBeVisible();
    await expect.element(tester.passwordInput).toHaveAttribute('type', 'password');

    await tester.passwordInput.fill('');
    await userEvent.tab();

    await expect.element(tester.root).toHaveTextContent('Password is required');
  });

  it('should validate the password confirmation input', async () => {
    const tester = new RegisterTester(await RouterTestingHarness.create('/register'));

    await expect.element(tester.passwordConfirmationInput).toBeVisible();
    await expect.element(tester.passwordInput).toHaveAttribute('type', 'password');

    await tester.passwordConfirmationInput.fill('');
    await userEvent.tab();

    await expect.element(tester.root).toHaveTextContent('Password confirmation is required');
  });

  it('should validate that passwords match', async () => {
    const tester = new RegisterTester(await RouterTestingHarness.create('/register'));

    await tester.passwordInput.fill('password');
    await tester.passwordConfirmationInput.fill('passwor');
    await userEvent.tab();

    await expect.element(tester.root).toHaveTextContent('Your password does not match');

    await tester.passwordConfirmationInput.fill('password');

    await expect.element(tester.root).not.toHaveTextContent('Your password does not match');
  });

  it('should validate the birth year', async () => {
    const tester = new RegisterTester(await RouterTestingHarness.create('/register'));

    await expect.element(tester.birthYearInput).toBeVisible();
    await expect.element(tester.birthYearInput).toHaveAttribute('type', 'number');

    await tester.birthYearInput.fill('');
    await userEvent.tab();

    await expect.element(tester.root).toHaveTextContent('Birth year is required');

    // given an invalid value before 1900
    await tester.birthYearInput.fill('1899');
    await userEvent.tab();

    await expect.element(tester.root).toHaveTextContent('This is not a valid year');

    // given an invalid value in the future
    await tester.birthYearInput.fill(`${new Date().getFullYear() + 1}`);
    await userEvent.tab();

    await expect.element(tester.root).toHaveTextContent('This is not a valid year');

    // given a valid value
    await tester.birthYearInput.fill('1982');
    await userEvent.tab();

    await expect.element(tester.root).not.toHaveTextContent('This is not a valid year');
  });

  it('should displays errors on submit if the form is invalid', async () => {
    const tester = new RegisterTester(await RouterTestingHarness.create('/register'));

    await tester.submitButton.click();

    await expect.element(tester.root).toHaveTextContent('Login is required');
    await expect.element(tester.root).toHaveTextContent('Password is required');
    await expect.element(tester.root).toHaveTextContent('Password confirmation is required');
    await expect.element(tester.root).toHaveTextContent('Birth year is required');

    expect(userService.register, 'The user service should not be called if the form is invalid').not.toHaveBeenCalled();
  });

  it('should call the user service to register', async () => {
    const tester = new RegisterTester(await RouterTestingHarness.create('/register'));

    userService.register.mockReturnValue(of({ id: 1 } as UserModel));

    // fill the form
    await tester.loginInput.fill('Cédric');
    await tester.passwordInput.fill('password');
    await tester.passwordConfirmationInput.fill('password');
    await tester.birthYearInput.fill('1986');
    await tester.submitButton.click();

    // then we should have called the user service
    expect(userService.register).toHaveBeenCalledWith('Cédric', 'password', 1986);

    // and navigated to the home
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/');
  });

  it('should display an error message if registration fails', async () => {
    const tester = new RegisterTester(await RouterTestingHarness.create('/register'));

    userService.register.mockImplementation(() => throwError(() => new Error('Oops')));

    // fill the form
    await tester.loginInput.fill('Cédric');
    await tester.passwordInput.fill('password');
    await tester.passwordConfirmationInput.fill('password');
    await tester.birthYearInput.fill('1986');
    await tester.submitButton.click();

    // then we should have called the user service
    expect(userService.register).toHaveBeenCalledWith('Cédric', 'password', 1986);

    // and not navigate
    const router = TestBed.inject(Router);

    expect(router.url).not.toBe('/');
    // and display the error message
    await expect.element(tester.alert).toHaveTextContent('Try again with another login.');
    await expect.element(tester.alert).toHaveClass('alert-danger');
  });
});
