import { Player } from './player.model';
import { Round } from './round.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class PlayerService {
  players: FirebaseListObservable<any[]>;
  rounds: FirebaseListObservable<any[]>;

  constructor(private database: AngularFireDatabase) {
    this.players = database.list('players');
    this.rounds = database.list('rounds');
  }

  getPlayers() {
    return this.players;
  }

  getRounds() {
    return this.rounds;
  }

  addRound(newRound: Round) {
    this.rounds.push(newRound);
  }

  addPlayer(newPlayer: Player) {
    this.players.push(newPlayer);
  }

   getPlayerByID(playerID: string) {
     return this.database.object('players/' + playerID);
   }

   getRoundByID(roundID: string) {
     return this.database.object('rounds/' + roundID);
   }

}
