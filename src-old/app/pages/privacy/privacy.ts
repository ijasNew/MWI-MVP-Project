import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-privacy',
  imports: [
    RouterLink,
    Header,
    Footer
  ],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css'
})
export class Privacy {

}