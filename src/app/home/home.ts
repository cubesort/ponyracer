import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../user-service';

@Component({
  selector: 'pr-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  readonly userService = inject(UserService);

  protected readonly user = this.userService.currentUser;
}
