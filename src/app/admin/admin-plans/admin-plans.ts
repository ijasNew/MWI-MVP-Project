import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminMenu } from '../admin-menu/admin-menu';
import { FormsModule } from '@angular/forms';

interface PlanUser {
  id: string;
  name: string;
  gender: string;
  place: string;
  phone: string;
  registeredDate: string;
  plan: 'Free' | 'Basic';
  status: 'Active' | 'Pending';
}

@Component({
  selector: 'app-admin-plans',
  standalone: true,
  imports: [
    CommonModule,FormsModule,
    AdminMenu
  ],
  templateUrl: './admin-plans.html',
  styleUrl: './admin-plans.css'
})
export class AdminPlans {

  searchTerm = '';

  showPlanPopup = false;

selectedUser: PlanUser | null = null;

selectedPlanValue: 'Free' | 'Basic' = 'Free';

  selectedPlan = 'All';

  users: PlanUser[] = [

    {
      id: 'F1032',
      name: 'Rasiya Fathima',
      gender: 'Female',
      place: 'Malappuram',
      phone: '9746900055',
      registeredDate: '27 Aug 2026',
      plan: 'Free',
      status: 'Active'
    },

    {
      id: 'M1031',
      name: 'Faris Rahman',
      gender: 'Male',
      place: 'Kondotty',
      phone: '9876543210',
      registeredDate: '26 Aug 2026',
      plan: 'Free',
      status: 'Active'
    },

    {
      id: 'F1028',
      name: 'Raniya Fathima',
      gender: 'Female',
      place: 'Kannur',
      phone: '9847001122',
      registeredDate: '25 Aug 2026',
      plan: 'Basic',
      status: 'Active'
    },

    {
      id: 'M1025',
      name: 'Mohammed Shamil',
      gender: 'Male',
      place: 'Perinthalmanna',
      phone: '9567002233',
      registeredDate: '26 Aug 2026',
      plan: 'Free',
      status: 'Pending'
    },

    {
      id: 'F1024',
      name: 'Ayesha Fathima',
      gender: 'Female',
      place: 'Kozhikode',
      phone: '9495003344',
      registeredDate: '24 Aug 2026',
      plan: 'Free',
      status: 'Active'
    }

  ];


  constructor(
    private router: Router
  ) {}


  get filteredUsers(): PlanUser[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.users.filter(user => {

      const matchesSearch =
        !search ||
        user.id.toLowerCase().includes(search) ||
        user.name.toLowerCase().includes(search) ||
        user.place.toLowerCase().includes(search) ||
        user.phone.includes(search);

      const matchesPlan =
        this.selectedPlan === 'All' ||
        user.plan === this.selectedPlan;

      return matchesSearch && matchesPlan;

    });

  }


  get totalUsers(): number {

    return this.users.length;

  }


  get freeUsers(): number {

    return this.users.filter(
      user => user.plan === 'Free'
    ).length;

  }


  get basicUsers(): number {

    return this.users.filter(
      user => user.plan === 'Basic'
    ).length;

  }


  changePlan(user: PlanUser): void {

    if (user.plan === 'Free') {

      user.plan = 'Basic';

      return;

    }

    user.plan = 'Free';

  }


  viewProfile(memberId: string): void {

    this.router.navigate([
      '/admin/profile-view',
      memberId
    ]);

  }
/* =========================================
   OPEN PLAN POPUP
========================================= */

openPlanPopup(user: PlanUser): void {

  this.selectedUser = user;

  this.selectedPlanValue = user.plan;

  this.showPlanPopup = true;

}


/* =========================================
   CLOSE PLAN POPUP
========================================= */

closePlanPopup(): void {

  this.showPlanPopup = false;

  this.selectedUser = null;

}



/* =========================================
   CONFIRM PLAN CHANGE
========================================= */

confirmPlanChange(): void {

  if (!this.selectedUser) {
    return;
  }


  this.selectedUser.plan =
    this.selectedPlanValue;


  this.closePlanPopup();

}
   

  openDashboard(): void {

    this.router.navigate([
      '/admin/dashboard'
    ]);

  }

}