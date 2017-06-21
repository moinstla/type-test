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
  hightlightColor: string = "#a3e4a3";
  failureArray: string[] = [];
  totalKeys: number = 0;
  accuracy: number = 100;
  progress: number = 0;
  successCounter: number = 0;
  capsLock: boolean;
  startStamp: number;
  endStamp: number;
  timerStatus: boolean = false;
  roundTime: number;
  roundCPM: number;
  javascriptCode = [];
  rubyCode = [];
  sampleCode;
  failureStats: object = {};

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getSampleCodes().subscribe(dataLastEmittedFromObserver => {
    this.sampleCode = dataLastEmittedFromObserver;

    this.sampleCode[0].forEach((level) => {
      this.javascriptCode.push(level);
    });
    this.sampleCode[1].forEach((level) => {
      this.rubyCode.push(level);
    });
    });
  }

  startTime() {
    if (this.timerStatus === false && this.progress !== 100) {
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
      this.failureArray.forEach((letter) => {
        var occurrences = this.failureArray.filter(function(val) {
          return val === letter;
        }).length;
        this.failureStats[letter] = occurrences;
      });
      console.log(this.failureStats);
    }
  }

  @HostListener('document:keypress', ['$event'])
  whatKey(event: KeyboardEvent) {
    this.startTime();
    this.inputtedKey = event.key;
    this.totalKeys += 1;
      if (this.charsArray[this.successCounter] === this.inputtedKey) {
        this.successArray.push(this.charsArray[this.successCounter]);
        this.hightlightColor = "#a3e4a3";
        this.successCounter += 1;
      } else {
        this.failureArray.push(this.charsArray[this.successCounter])
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
      this.codeText = this.javascriptCode[0].text;
      this.splitCode(this.codeText);
    }

    splitCode(codeText) {
      this.charsArray = codeText.split("");
      this.displayArray = codeText.split("");
    }

    reset() {
      this.progress = 0;
      this.failureStats = {};
      this.successArray = [];
      this.failureArray = [];
      this.totalKeys = 0;
      this.accuracy = 0;
      this.roundTime = 0;
      this.roundCPM = 0;
      this.successCounter = 0;
    }

    nextLevel() {
      switch(this.codeText) {
        case this.javascriptCode[0].text: {
          this.reset();
          this.codeText = this.javascriptCode[1].text;
          this.splitCode(this.codeText);
          break;
        }
        case this.javascriptCode[1].text: {
          this.reset();
          this.codeText = this.javascriptCode[2].text;
          this.splitCode(this.codeText);
          break;
        }
      }
    }


}
