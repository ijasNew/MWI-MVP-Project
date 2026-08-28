import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Privacy } from './pages/privacy/privacy';
import { Terms } from './pages/terms/terms';
import { Refund } from './pages/refund/refund';
import { Register } from './pages/register/register';

import { AuthGuard } from './guards/auth-guard';
import { AdminAuthGuard } from './guards/admin-auth-guard';

export const routes: Routes = [

  // =====================================================
  // PUBLIC ROUTES
  // =====================================================

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


  // =====================================================
  // USER PROTECTED ROUTES
  // =====================================================

  {
    path: 'user-home',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/user-home/user-home')
        .then(m => m.UserHome)
  },

  {
    path: 'interests',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/interests/interests')
        .then(m => m.Interests)
  },

  {
    path: 'shortlisted',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/shortlisted/shortlisted')
        .then(m => m.Shortlisted)
  },

  {
    path: 'my-details',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/my-details/my-details')
        .then(m => m.MyDetails)
  },

  {
    path: 'help-us-improve',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/help-us-improve/help-us-improve')
        .then(m => m.HelpUsImprove)
  },

  {
    path: 'complete-profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/complete-profile/complete-profile')
        .then(m => m.CompleteProfile)
  },

  {
    path: 'physical-details',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/physical-details/physical-details')
        .then(m => m.PhysicalDetails)
  },

  {
    path: 'contact-details',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/contact-details/contact-details')
        .then(m => m.ContactDetails)
  },

  {
    path: 'work-details',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/work-details/work-details')
        .then(m => m.WorkDetails)
  },

  {
    path: 'family-details',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/family-details/family-details')
        .then(m => m.FamilyDetails)
  },

  {
    path: 'additional-preferences',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/additional-preferences/additional-preferences')
        .then(m => m.AdditionalPreferences)
  },

  {
    path: 'expectations',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/expectations/expectations')
        .then(m => m.Expectations)
  },

  {
    path: 'profile-photos',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/profile-photos/profile-photos')
        .then(m => m.ProfilePhotos)
  },

  {
    path: 'profile-view/:memberId',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/profile-view/profile-view')
        .then(m => m.ProfileView)
  },

  {
    path: 'matching-profiles',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/matching-profiles/matching-profiles')
        .then(m => m.MatchingProfiles)
  },

  {
    path: 'upgrade-profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/upgrade-profile/upgrade-profile')
        .then(m => m.UpgradeProfile)
  },

  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/settings/settings')
        .then(m => m.Settings)
  },


  // =====================================================
  // ADMIN LOGIN - PUBLIC
  // =====================================================

  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/admin-login/admin-login')
        .then(m => m.AdminLogin)
  },


  // =====================================================
  // ADMIN PROTECTED ROUTES
  // =====================================================

  {
    path: 'admin/dashboard',
    canActivate: [AdminAuthGuard],
    loadComponent: () =>
      import('./admin/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboard)
  },

  {
    path: 'admin/plans',
    canActivate: [AdminAuthGuard],
    loadComponent: () =>
      import('./admin/admin-plans/admin-plans')
        .then(m => m.AdminPlans)
  },

  {
    path: 'admin/profile-search',
    canActivate: [AdminAuthGuard],
    loadComponent: () =>
      import('./admin/admin-profile-search/admin-profile-search')
        .then(m => m.AdminProfileSearch)
  },

  {
    path: 'admin/find-match',
    canActivate: [AdminAuthGuard],
    loadComponent: () =>
      import('./admin/admin-find-match/admin-find-match')
        .then(m => m.AdminFindMatch)
  },

  {
    path: 'admin/profiles',
    canActivate: [AdminAuthGuard],
    loadComponent: () =>
      import('./admin/profiles/profiles')
        .then(m => m.Profiles)
  },

  {
    path: 'admin/profile-view/:memberId',
    canActivate: [AdminAuthGuard],
    loadComponent: () =>
      import('./admin/profile-view/profile-view')
        .then(m => m.ProfileView)
  },

  {
    path: 'admin/profile-edit/:memberId',
    canActivate: [AdminAuthGuard],
    loadComponent: () =>
      import('./admin/profile-edit/profile-edit')
        .then(m => m.ProfileEdit)
  },

  {
    path: 'admin/verification',
    canActivate: [AdminAuthGuard],
    loadComponent: () =>
      import('./admin/verification/verification')
        .then(m => m.Verification)
  },

  {
    path: 'admin/verification/start/:memberId',
    canActivate: [AdminAuthGuard],
    loadComponent: () =>
      import('./admin/verification-start/verification-start')
        .then(m => m.VerificationStart)
  },


  // =====================================================
  // FALLBACK
  // =====================================================

  {
    path: '**',
    redirectTo: ''
  }

];