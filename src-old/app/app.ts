import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileCompletionPopup } from './components/profile-completion-popup/profile-completion-popup';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ProfileCompletionPopup
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
