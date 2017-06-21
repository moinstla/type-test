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
  startJavascriptButton: boolean = true;
  startRubyButton: boolean = true;
  nextLevelJavascriptButton: boolean = true;
  nextLevelRubyButton: boolean = true;
  codeText: string;
  level: number = 1;
  charsArray = [];
  displayArray = [];
  inputtedKey: string;
  successArray = [];
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
  currentLine: number = 0;
  failureStats: object = {};
  success;
  characters;

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
      this.startGame()
    });
    // let level = {
    //   level: "1",
    //   text: ["this is some text", "this is some other text", "this is just more text", "this is bonus text"]
    // }
    // this.javascriptCode.push(level);
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
      this.roundCPM = (this.displayArray.join("").length * 60) / this.roundTime;
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
    if (this.charsArray[this.currentLine][this.successCounter] === this.inputtedKey) {
      this.successArray[this.currentLine].push(this.charsArray[this.currentLine][this.successCounter]);
      this.hightlightColor = "#a3e4a3";
      this.successCounter += 1;
      this.totalKeys += 1;
    } else if ((this.charsArray[this.currentLine].length === this.successArray[this.currentLine].length) && (event.which === 13)) {
      this.currentLine += 1;
      this.successCounter = 0;
    } else if ((this.charsArray[this.currentLine].length !== this.successArray[this.currentLine].length) && (this.charsArray[this.currentLine][this.successCounter] !== this.inputtedKey)) {
      this.failureArray.push(this.charsArray[this.currentLine][this.successCounter])
      this.hightlightColor = "#ff8787";
      this.totalKeys += 1;
    }
    this.successArray.forEach((line) => {
      line.join("");
    })
    this.success = [].concat.apply([], this.successArray);
    this.characters = [].concat.apply([], this.charsArray);
    this.capsLock = event.getModifierState("CapsLock");
    this.accuracy = (this.success.length / this.totalKeys) * 100;
    this.progress = (this.success.length / this.characters.length) * 100;
    if (this.progress === 100) {
      this.endTime();
    }
  }


    startJavascript() {
      this.game = true;
      this.startJavascriptButton = false;
      this.nextLevelJavascriptButton = true;
      this.nextLevelRubyButton = false;
      this.startRubyButton = true;
      this.codeText = this.javascriptCode[0].text;
      this.splitCode(this.codeText);
    }
    startGame() {
      this.splitCode(this.javascriptCode[(this.level - 1)].text)
      this.charsArray.forEach(() => {
        this.successArray.push([])
      });
      this.game = true;
      this.startButton = false;

    }
    startRuby() {
      this.game = true;
      this.startRubyButton = false;
      this.nextLevelJavascriptButton = false;
      this.nextLevelRubyButton = true;
      this.startJavascriptButton = true;
      this.codeText = this.rubyCode[0].text;
      this.splitCode(this.codeText);
    }

    splitCode(codeText) {
      codeText.forEach((line) => {
        this.charsArray.push(line.split(""));
        this.displayArray.push(line.split(""));
      })
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


    nextLevelJavascript() {
      switch(this.codeText) {
        case this.javascriptCode[0].text: {
          this.successArray = [];
          this.successCounter = 0;
          this.codeText = this.javascriptCode[1].text;
          this.splitCode(this.codeText);
          break;
        }
        case this.javascriptCode[1].text: {
          this.nextLevelJavascriptButton = false;
          this.successArray = [];
          this.successCounter = 0;
          this.codeText = this.javascriptCode[2].text;
          this.splitCode(this.codeText);
          break;
        }

    nextLevel() {
      if (this.javascriptCode[this.level]) {
        this.displayArray = [];
        this.charsArray = [];
        this.level += 1;
        this.startGame();

      }
    }
    nextLevelRuby() {
      switch(this.codeText) {
        case this.rubyCode[0].text: {
          this.successArray = [];
          this.successCounter = 0;
          this.codeText = this.rubyCode[1].text;
          this.splitCode(this.codeText);
          break;
        }
        case this.rubyCode[1].text: {
          this.nextLevelRubyButton = false;
          this.successArray = [];
          this.successCounter = 0;
          this.codeText = this.rubyCode[2].text;
          this.splitCode(this.codeText);
          break;
        }
      }
    }


}
