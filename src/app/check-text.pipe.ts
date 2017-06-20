import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkText'
})
export class CheckTextPipe implements PipeTransform {

  transform(charsArray: string, inputtedKey: any) {
  const successArray: string[] = [];
    for (let i = 0; i < charsArray.length; i++) {
      if (charsArray[i] === inputtedKey) {
        successArray.push(inputtedKey)
      } else {
        console.log('bad inputted key')
      }
    }
  }

}
