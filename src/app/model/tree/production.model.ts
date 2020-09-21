import { number } from '@amcharts/amcharts4/core';

export class Production {
  public simboloNoTer: any;
  public simboloTer: string[];
  public size : number;

  constructor() {
    this.simboloTer = []
    this.size = 5
  }

  getProduction(): boolean {
    let production = false;
    this.simboloTer.forEach(res => {
      if (res.match('[A-Z]')) {
        production = true
      }
    })
    return production
  }

}


