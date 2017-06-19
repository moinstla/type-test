import { Component, OnInit, HostListener } from '@angular/core';



@Component({
  selector: 'app-typing-test',
  templateUrl: './typing-test.component.html',
  styleUrls: ['./typing-test.component.css']
})
export class TypingTestComponent implements OnInit {
  codeText: string;
  charsArray: string[];
  inputtedKey: string;
  successArray: string[] = [];
  wrongKey: boolean;
  hightlightColor: string = "green";

  constructor() { }

  ngOnInit() {
     this.codeText =
      "animateToOverview: function(animationType) { for (let w = 0; w < this._workspaces.length; w++) { if (animationType == AnimationType.ZOOM)";
     this.charsArray = this.codeText.split('');
  }





    @HostListener('document:keypress', ['$event'])
    whatKey(event: KeyboardEvent) {
      this.inputtedKey = event.key;

        if (this.charsArray[0] === this.inputtedKey) {
          this.successArray.push(this.charsArray.shift());
          this.hightlightColor = "green";
        } else {
          this.hightlightColor = "red";
        }

      }




    }
