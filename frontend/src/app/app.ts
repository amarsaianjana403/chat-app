import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TestService } from './test.service';
// import { NxWelcome } from './nx-welcome';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'frontend';
}
