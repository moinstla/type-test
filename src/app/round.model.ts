export class Round {
  $key: string;
  d = new Date();
  timestamp = this.d.getTime();

  constructor (public playerID: string, public language: string, public level: number, public time: number, public cpm: number, public accuracy: number) {}
}
