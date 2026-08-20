import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  checkPhone(data: any) {
  return this.http.post<any>(
    `${this.apiUrl}/check-phone.php`,
    data
  );
}

verifyOtp(data: any) {
  return this.http.post<any>(
    `${this.apiUrl}/verify-otp.php`,
    data
  );
}
}