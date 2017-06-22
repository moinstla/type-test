import { Pipe, PipeTransform } from '@angular/core';
import { Round } from './round.model';

@Pipe({
  name: 'rounds'
})
export class RoundsPipe implements PipeTransform {

  transform(rounds: Round[], playerID: string, language: string){
    if (rounds) {
      let playerRounds = rounds.filter(function(round){
        return round.playerID === playerID;
      });
      let playerLanguageRounds = playerRounds.filter(function(round){
        return round.language === language;
      });
      let sorted = playerLanguageRounds.sort(function(a, b) {
        return b.timestamp - a.timestamp;
      })
      console.log(sorted)
      return sorted;
    }
  }

}
