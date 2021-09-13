import { Component } from '@angular/core';
import { interval, Subject, PartialObserver, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-timer';
   name = 'Angular';
  progressNum: number = 0;
  seconds: any = '00';
  minutes: any = '00';
  hours: any = '';
  lastPress: number = 0;
  progress: string;
  timer$: Observable<number>;
  timerObserver: PartialObserver<number>;

  stopClick$ = new Subject();
  pauseClick$ = new Subject();

  private getProgress() {
    this.progress = this.minutes+':'+this.seconds;
  }


  startTimer() {
      this.getProgress();
    this.timer$ = interval(1000).pipe(
      takeUntil(this.pauseClick$),
      takeUntil(this.stopClick$)
    );



    this.timerObserver = {
      next: (_: number) => {
     this.getProgress();
     this.progressNum++;
     this.hours = Math.floor(this.progressNum / 3600);
     this.minutes = Math.floor((this.progressNum - (this.hours * 3600)) / 60);
     this.seconds = this.progressNum - (this.hours * 3600) - (this.minutes * 60);
    if (this.minutes < 10) {this.minutes = '0' + this.minutes;}
    if (this.seconds < 10) {this.seconds = '0' + this.seconds;}
    this.progress = this.minutes+':'+this.seconds;
      }
    };
    this.timer$.subscribe(this.timerObserver);
  }

  ngOnInit() {
    this.progress = '00:00';
  }

  pauseClick() {
    const time = new Date().getTime();
    const delta = time - this.lastPress;
    const pressDelay = 500;
    if (delta < pressDelay) {
    this.pauseClick$.next();
    }
    this.lastPress = time;
  }


  restartClick() {
    this.progressNum = 0;
    this.hours = '';
    this.seconds = '00';
    this.minutes = '00';
    this.progress = this.minutes + ':' + this.seconds;
    setTimeout(() => {
    this.getProgress();
    }, 1000);
  }

  stopClick() {
    this.progressNum = 0;
    this.hours = '';
    this.seconds = '00';
    this.minutes = '00';
    this.progress = this.minutes+':'+this.seconds;
    this.stopClick$.next();
  }
}
