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
  failureStats;
  g;
  

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
    });
  }

  drawBoard() {
    let svg = this.d3.select("svg"),
    margin = {top: 30, right: 30, bottom: 30, left: 200},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
    this.g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = this.d3.scaleTime().range([0, width]);

    let xAxis = this.d3.axisBottom(x);

    // let xAxisG = this.g.append("g").attr("transform", "translate(0, " + height + ")");

    // this.d3.timer(function() {
    //   let now = Date.now();
    //   x.domain([now - 5000, now]);
    //   // xAxisG.call(xAxis);
    // });
  }

  drawCircle(color) {
    this.d3.select("body").on("keydown", () => {

    let time = Date.now();

    let circle = this.g.append("circle")
        .attr("r", 100)
        .attr("stroke-opacity", 0)
        .attr("cy", Math.random() * 200)
        .attr("cx", Math.random() * 1000)
        .style('fill', color);

    circle.transition("time")
        .duration(3000)
        .ease(this.d3.easeLinear)
        .attr("cx", Math.random() * this.progress * 10);



    circle.transition()
        .duration(1450)
        .ease(this.d3.easeCubicOut)
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
    this.capsLock = event.getModifierState("CapsLock");
    this.accuracy = (this.successArray.length / this.totalKeys) * 100;
    this.progress = (this.successArray.length / this.codeText.length) * 100;
    if (this.progress === 100) {
      this.endTime();
    }
  }

    startGame() {
      this.drawBoard();
      this.game = true;
      this.startButton = false;
      this.codeText = this.javascriptCode[0].text;
      this.splitCode(this.codeText);
    }

    splitCode(codeText) {
      this.charsArray = codeText.split("");
      this.displayArray = codeText.split("");
    }

    nextLevel() {
      switch(this.codeText) {
        case this.javascriptCode[0].text: {
          this.successArray = [];
          this.successCounter = 0;
          this.codeText = this.javascriptCode[1].text;
          this.splitCode(this.codeText);
          break;
        }
        case this.javascriptCode[1].text: {
          this.successArray = [];
          this.successCounter = 0;
          this.codeText = this.javascriptCode[2].text;
          this.splitCode(this.codeText);
          break;
        }
      }
    }


}
