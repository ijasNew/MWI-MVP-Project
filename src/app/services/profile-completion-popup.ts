import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ProfileCompletionPopupData {
  percentage: number;
}

@Injectable({ providedIn: 'root' })
export class ProfileCompletionPopupService {
  private readonly openSubject = new Subject<ProfileCompletionPopupData>();
  readonly open$ = this.openSubject.asObservable();

  open(percentage: number): void {
    this.openSubject.next({ percentage });
  }
}
