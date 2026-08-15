import {
  Component,
  HostListener
} from '@angular/core';

@Component({
  selector: 'app-construction-modal',
  imports: [],
  templateUrl: './construction-modal.html',
  styleUrl: './construction-modal.css'
})
export class ConstructionModal {

  isOpen = false;

  days = '00';
  hours = '00';
  minutes = '00';
  seconds = '00';

  private deadline = 0;
  private timer?: ReturnType<typeof setInterval>;

  constructor() {

    this.initializeCountdown();

  }


  // =========================
  // OPEN
  // =========================

  open(): void {

    this.isOpen = true;

    document.body.style.overflow = 'hidden';

  }


  // =========================
  // CLOSE
  // =========================

  close(): void {

    this.isOpen = false;

    document.body.style.overflow = '';

  }


  // =========================
  // ESC KEY
  // =========================

  @HostListener('document:keydown.escape')
  handleEscape(): void {

    if (this.isOpen) {

      this.close();

    }

  }


  // =========================
  // COUNTDOWN
  // =========================

  private initializeCountdown(): void {

    const savedDeadline =
      localStorage.getItem('mwiConstructionDeadline');


    if (savedDeadline) {

      this.deadline =
        Number(savedDeadline);

    } else {

      const deadline =
        new Date();

      deadline.setDate(
        deadline.getDate() + 10
      );

      this.deadline =
        deadline.getTime();

      localStorage.setItem(
        'mwiConstructionDeadline',
        String(this.deadline)
      );

    }


    this.updateCountdown();


    this.timer =
      setInterval(
        () => this.updateCountdown(),
        1000
      );

  }


  private updateCountdown(): void {

    const distance =
      this.deadline -
      new Date().getTime();


    if (distance <= 0) {

      this.days = '00';
      this.hours = '00';
      this.minutes = '00';
      this.seconds = '00';

      return;

    }


    const days =
      Math.floor(
        distance /
        (1000 * 60 * 60 * 24)
      );

    const hours =
      Math.floor(
        (distance /
          (1000 * 60 * 60)) % 24
      );

    const minutes =
      Math.floor(
        (distance /
          (1000 * 60)) % 60
      );

    const seconds =
      Math.floor(
        (distance / 1000) % 60
      );


    this.days =
      String(days).padStart(2, '0');

    this.hours =
      String(hours).padStart(2, '0');

    this.minutes =
      String(minutes).padStart(2, '0');

    this.seconds =
      String(seconds).padStart(2, '0');

  }


  // =========================
  // CLEANUP
  // =========================

  ngOnDestroy(): void {

    if (this.timer) {

      clearInterval(this.timer);

    }

    document.body.style.overflow = '';

  }

}