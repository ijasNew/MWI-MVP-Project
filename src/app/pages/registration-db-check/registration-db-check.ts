import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-db-check',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration-db-check.html',
  styleUrl: './registration-db-check.css'
})
export class RegistrationDbCheck implements OnInit {

  loading = true;

  errorMessage = '';

  data: any = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const token =
      localStorage.getItem('mwi_token');

    if (!token) {

      this.router.navigate(['/login']);

      return;
    }

    this.loadDatabaseData();
  }

  loadDatabaseData(): void {

    this.loading = true;

    this.apiService.getProfile().subscribe({

      next: (response: any) => {
        this.loading = false;

        console.log(
          'PROFILE DATA:',
          response.data?.profiles
        );

        this.data = response.data || {};

        console.log(
          'CHECKER DATA SET:',
          this.data
        );


        console.log(
          'REGISTRATION DB DATA:',
          response
        );

        if (
          response?.success !== true
        ) {

          this.errorMessage =
            response?.message ||
            'Unable to load DB data.';

          return;
        }

        this.data =
          response.data || {};
      },

      error: (error: any) => {

        console.error(
          'DB CHECK API ERROR:',
          error
        );

        this.loading = false;

        if (error?.status === 401) {

          localStorage.removeItem(
            'mwi_token'
          );

          this.router.navigate([
            '/login'
          ]);

          return;
        }

        this.errorMessage =
          error?.error?.message ||
          'Unable to fetch registration data.';
      }

    });
  }

  objectEntries(
    value: any
  ): [string, any][] {

    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value)
    ) {
      return [];
    }

    return Object.entries(value);
  }

  formatValue(value: any): string {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return 'NULL / EMPTY';
    }

    if (typeof value === 'object') {
      return JSON.stringify(
        value,
        null,
        2
      );
    }

    return String(value);
  }

  isEmpty(value: any): boolean {

    return (
      value === null ||
      value === undefined ||
      value === ''
    );
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  isObject(value: any): boolean {
    return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    );
  }
}