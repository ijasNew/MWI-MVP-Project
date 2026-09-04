import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  menuOpen = false;

  constructor(
    private router: Router
  ) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  goToSection(sectionId: string): void {

    this.closeMenu();

    if (this.router.url === '/' || this.router.url.startsWith('/#')) {

      document
        .getElementById(sectionId)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      return;
    }

    this.router.navigate(['/']).then(() => {

      setTimeout(() => {

        document
          .getElementById(sectionId)
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

      }, 50);

    });

  }

}