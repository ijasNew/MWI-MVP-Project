import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-refund',
  imports: [
    RouterLink,
    Header,
    Footer
  ],
  templateUrl: './refund.html',
  styleUrl: './refund.css'
})
export class Refund {

}