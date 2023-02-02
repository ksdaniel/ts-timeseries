class TimeSeries {
  constructor(
    public name: string,
    public data: [number, number][],
    public periodicity: 'monthly' | 'daily' | 'hourly
  ) {}

  public static fromJSON(json: any): TimeSeries {
    return new TimeSeries(json.name, json.data, json.periodicity);
  }

  public toJSON(): any {
    return {
      name: this.name,
      data: this.data
    };
  }

  public getPeriodicity(): 'monthly' | 'daily' | 'hourly' {
    return this.periodicity;
  }

  public getName(): string {
    return this.name;
  }

  public getData(): [number, number][] {
    return this.data;
  }

  public getValues(): number[] {
    return this.data.map((d) => d[1]);
  }

  public getDates(): Date[] {
    return this.data.map((d) => new Date(d[0]));
  }

  public getMinDate(): Date {
    return new Date(this.data[0][0]);
  }

  public getMaxDate(): Date {
    return new Date(this.data[this.data.length - 1][0]);
  }

  public getMinValue(): number {
    return Math.min(...this.getValues());
  }

  public getMaxValue(): number {
    return Math.max(...this.getValues());
  }

  public getAverageValue(): number {  
    return this.getValues().reduce((a, b) => a + b, 0) / this.getValues().length;
  }

  public getMedianValue(): number { 
    const values = this.getValues();
    const middle = Math.floor(values.length / 2);
    const sorted = values.sort((a, b) => a - b);
    return values.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }

  public fillGaps(): TimeSeries {
    const data = this.data;
    const periodicity = this.periodicity;
    const filledData: any[] = [];
    let lastDate = this.getMinDate();
    let lastValue = this.getMinValue();

    for (let i = 0; i < data.length; i++) {
      const date = new Date(data[i][0]);
      const value = data[i][1];

      if (date.getTime() !== lastDate.getTime()) {
        const diff = date.getTime() - lastDate.getTime();
        const step = diff / (periodicity === 'monthly' ? 30 : 1);
        for (let j = 1; j < step; j++) {
          filledData.push([lastDate.getTime() + j * (diff / step), lastValue]);
        }
      }

      filledData.push([date.getTime(), value]);
      lastDate = date;
      lastValue = value;
    }

    return new TimeSeries(this.name, filledData, this.periodicity);
  }
}


const timeSeries = new TimeSeries('test', [[0, 1], [1, 2], [3, 3]], 'daily');

console.log(timeSeries.fillGaps());