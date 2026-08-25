import { Component } from '@angular/core';
import { UserMenu } from '../../components/user-menu/user-menu';

@Component({
  selector: 'app-shortlisted',
  imports: [UserMenu],
  templateUrl: './shortlisted.html',
  styleUrl: './shortlisted.css'
})
export class Shortlisted {

  readonly hasShortlistedProfiles = true;

  removeShortlist(name: string): void {
    console.log('Remove from shortlist:', name);
  }

}
