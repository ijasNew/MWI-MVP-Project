import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Privacy } from './pages/privacy/privacy';
import { Terms } from './pages/terms/terms';
import { Refund } from './pages/refund/refund';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'privacy',
    component: Privacy
  },

  {
    path: 'terms',
    component: Terms
  },

  {
    path: 'refund',
    component: Refund
  }

];