import { Component } from '@angular/core';

import { Header } from '../../components/header/header';
import { Hero } from '../../components/hero/hero';
import { WhyUs } from '../../components/why-us/why-us';
import { PrivacyTrust } from '../../components/privacy-trust/privacy-trust';
import { Process } from '../../components/process/process';
import { Verification } from '../../components/verification/verification';
import { Faq } from '../../components/faq/faq';
import { FinalCta } from '../../components/final-cta/final-cta';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [
    Header,
    Hero,
    WhyUs,
    PrivacyTrust,
    Process,
    Verification,
    Faq,
    FinalCta,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}