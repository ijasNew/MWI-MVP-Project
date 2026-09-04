import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-terms',
  imports: [
    RouterLink,
    Header,
    Footer
  ],
  templateUrl: './terms.html',
  styleUrl: './terms.css'
})
export class Terms {

}