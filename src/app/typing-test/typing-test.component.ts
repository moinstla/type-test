import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { SampleCode } from '../sample-code.model';
import { DataService } from '../data.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { D3Service, D3, Selection } from 'd3-ng2-service';


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
  failureStats;
  g;
  svg;
  currentLine: number = 0;
  failureStats: object = {};
  success;
  characters;


  private d3: D3;
  private parentNativeElement: any;

  constructor(private dataService: DataService, element: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {

    let d3 = this.d3;
    let d3ParentElement: Selection<any, any, any, any>;

    if (this.parentNativeElement !== null) {
      d3ParentElement = d3.select(this.parentNativeElement);
      // Do d3 stuff
    }

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

  drawBoard() {

    let svg = this.d3.select("svg"),
    margin = {top: 30, right: 30, bottom: 30, left: 200},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
    this.g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = this.d3.scaleTime().range([0, width]);
    let xAxis = this.d3.axisBottom(x);

  }



  drawCircle(color) {

    this.d3.select("body").on("keydown", () => {

    let time = Date.now()

    let circle = this.g.append("circle")
        .attr("r", 50)
        .attr("cy", Math.random() * 200)
        .attr("cx", Math.random() * 600)
        .attr("stroke", "black")
        .style('fill', color);

    circle.transition("time")
        .duration(6000)
        .ease(this.d3.easeElasticIn )
        .attr("cx", Math.random() * this.progress * 10);


    circle.transition()
        .duration(3050)
        .ease(this.d3.easeBounceOut)
        .attr("r", 3.5)
        .attr("stroke-opacity", 1)
      // .transition()
      //   .delay(5000 - 750 * 2)
      //   .ease(this.d3.easeCubicIn)
      //   .attr("r", 80)
      //   .attr("stroke-opacity", 0)
      //   .remove();
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
    this.totalKeys += 1;
      if (this.charsArray[this.successCounter] === this.inputtedKey) {
        this.successArray.push(this.charsArray[this.successCounter]);
        this.hightlightColor = "#a3e4a3";
        this.successCounter += 1;
        this.drawCircle("green");
      } else {
        this.failureArray.push(this.charsArray[this.successCounter])
        this.hightlightColor = "#ff8787";
        this.drawCircle("red");
      }

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

    startGame() {
      this.splitCode(this.javascriptCode[(this.level - 1)].text)
      this.charsArray.forEach(() => {
        this.successArray.push([])
      });
      this.game = true;
      this.startButton = false;

      this.codeText = this.javascriptCode[0].text;
      this.splitCode(this.codeText);
      this.drawBoard();
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

    nextLevel() {
      if (this.javascriptCode[this.level]) {
        this.displayArray = [];
        this.charsArray = [];
        this.level += 1;
        this.startGame();
      }
    }


}
