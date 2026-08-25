import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  constructor(
    private router: Router
  ) {}

  goToSection(sectionId: string): void {

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
