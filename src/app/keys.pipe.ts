import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    let amount;
    for (let key in value) {
      if (value[key] > 1) {
        amount = "times"
      } else {
        amount = "time"
      }
      keys.push({key: key, value: value[key], amount: amount});
    }
    return keys;
  }
}
