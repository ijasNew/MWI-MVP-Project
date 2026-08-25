import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Privacy } from './pages/privacy/privacy';
import { Terms } from './pages/terms/terms';
import { Refund } from './pages/refund/refund';
import { Register } from './pages/register/register'; 
import { UserHome } from './pages/user-home/user-home';

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
  },
  {
    path: 'register',
    component: Register
  }, 
  {
    path: 'user-home',
    loadComponent: () =>
      import('./pages/user-home/user-home')
        .then(m => m.UserHome)
  },

  {
    path: 'interests',
    loadComponent: () =>
      import('./pages/interests/interests')
        .then(m => m.Interests)
  },

  {
    path: 'shortlisted',
    loadComponent: () =>
      import('./pages/shortlisted/shortlisted')
        .then(m => m.Shortlisted)
  },
  {
    path: 'my-details',
    loadComponent: () =>
      import('./pages/my-details/my-details')
        .then(m => m.MyDetails)
  },
  {
    path: 'help-us-improve',
    loadComponent: () =>
      import('./pages/help-us-improve/help-us-improve')
        .then(m => m.HelpUsImprove)
  },

  
  {
    path: 'complete-profile',
    loadComponent: () =>
      import('./pages/complete-profile/complete-profile')
        .then(m => m.CompleteProfile)
  }, {
    path: 'physical-details',
    loadComponent: () =>
      import('./pages/physical-details/physical-details')
        .then(m => m.PhysicalDetails)
  }, {
    path: 'contact-details',
    loadComponent: () =>
      import('./pages/contact-details/contact-details')
        .then(m => m.ContactDetails)
  }, {
    path: 'work-details',
    loadComponent: () =>
      import('./pages/work-details/work-details')
        .then(m => m.WorkDetails)
  }, {
    path: 'family-details',
    loadComponent: () =>
      import('./pages/family-details/family-details')
        .then(m => m.FamilyDetails)
  },
  {
    path: 'additional-preferences',
    loadComponent: () =>
      import('./pages/additional-preferences/additional-preferences')
        .then(m => m.AdditionalPreferences)
  },
  {
    path: 'expectations',
    loadComponent: () =>
      import('./pages/expectations/expectations')
        .then(m => m.Expectations)
  }, {
    path: 'profile-photos',
    loadComponent: () =>
      import('./pages/profile-photos/profile-photos')
        .then(m => m.ProfilePhotos)
  },
  {
  path: 'profile-view/:memberId',
  loadComponent: () =>
    import('./pages/profile-view/profile-view')
      .then(m => m.ProfileView)
},
{
  path: 'matching-profiles',
  loadComponent: () =>
    import('./pages/matching-profiles/matching-profiles')
      .then(m => m.MatchingProfiles)
},
{
  path: 'upgrade-profile',
  loadComponent: () =>
    import('./pages/upgrade-profile/upgrade-profile')
      .then(m => m.UpgradeProfile)
},
{
  path: 'settings',
  loadComponent: () =>
    import('./pages/settings/settings')
      .then(m => m.Settings)
},
{
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login)
  },
  {
  path: 'forgot-password',
  loadComponent: () =>
    import('./pages/forgot-password/forgot-password')
      .then(m => m.ForgotPassword)
  },
  {
    path: '**',
    redirectTo: ''
  }

];
