import { Component, OnInit, HostListener } from '@angular/core';
import { SampleCode } from '../sample-code.model';
import { DataService } from '../data.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-typing-test',
  templateUrl: './typing-test.component.html',
  styleUrls: ['./typing-test.component.css'],
  providers: [DataService]
})

export class TypingTestComponent implements OnInit {
  game: boolean = false;
  startButton: boolean = true;
  codeText: string;
  charsArray: string[];
  displayArray: string[];
  inputtedKey: string;
  successArray: string[] = [];
  hightlightColor: string = "#73d073";
  failureArray: string[] = [];
  totalKeys: number = 0;
  accuracy: number = 100;
  progress: number = 0;
  successCounter: number = 0;
  capsLock: boolean;
  startStamp;
  endStamp;
  timerID;
  timerStatus: boolean = false;
  roundTime: number;
  roundCPM: number;
  javascriptCode: string[] = [];
  sampleCode: SampleCode[];


  constructor(private dataService: DataService) { }

  ngOnInit() {
    // this.codeText = "animateToOverview: function(animationType) { for (let w = 0; w < this._workspaces.length; w++) { if (animationType == AnimationType.ZOOM)";
    // this.charsArray = this.codeText.split('');
    // this.displayArray = this.codeText.split('');
     this.dataService.getSampleCodes().subscribe(dataLastEmittedFromObserver => {
    this.sampleCode = dataLastEmittedFromObserver;
    this.javascriptCode.push(this.sampleCode[0].text, this.sampleCode[1].text, this.sampleCode[2].text)
    });
  }

  startTime() {
    if (this.timerStatus === false) {
      this.timerStatus = true;
      let d = new Date();
      this.startStamp = d.getTime();
    }
  }

  endTime() {
    if (this.timerStatus === true) {
      this.timerStatus = false;
      let d = new Date();
      this.endStamp = d.getTime();
      this.roundTime = (this.endStamp - this.startStamp) / 1000;
      this.roundCPM = (this.displayArray.length * 60) / this.roundTime;
    }
  }

  @HostListener('document:keypress', ['$event'])
  whatKey(event: KeyboardEvent) {
    this.startTime();
    this.inputtedKey = event.key;
    this.totalKeys += 1;
      if (this.charsArray[this.successCounter] === this.inputtedKey) {
        this.successArray.push(this.charsArray[this.successCounter]);
        this.hightlightColor = "#73d073";
        this.successCounter += 1;
      } else {
        this.failureArray.push(this.inputtedKey)
        this.hightlightColor = "#ff8787";
      }
    this.capsLock = event.getModifierState("CapsLock");
    this.accuracy = (this.successArray.length / this.totalKeys) * 100;
    this.progress = (this.successArray.length / this.codeText.length) * 100;
    if (this.progress === 100) {
      this.endTime();
    }
  }

    startGame() {
      this.game = true;
      this.startButton = false;
      this.codeText = this.javascriptCode[0];
      this.charsArray = this.codeText.split("");
      this.displayArray = this.codeText.split("");
    }

}
