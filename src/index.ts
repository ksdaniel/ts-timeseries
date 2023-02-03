class TimeSeries {
  constructor(
    public name: string,
    public data: [Date, number][],
    public periodicity: "monthly" | "daily" | "hourly",
    public zeroFill: boolean = true,
    public sortOrder: "ASC" | "DESC" = "ASC"
  ) {
    this.sortData(sortOrder);
  }

  sortData(order: "ASC" | "DESC") {
    this.data.sort((a: [Date, number], b: [Date, number]) => {
      if (order === "ASC") {
        return a[0].getTime() - b[0].getTime();
      } else {
        return b[0].getTime() - a[0].getTime();
      }
    });
  }
  public static fromJSON(json: any): TimeSeries {
    return new TimeSeries(json.name, json.data, json.periodicity);
  }

  public toJSON(): any {
    return {
      name: this.name,
      data: this.data,
    };
  }

  public getPeriodicity(): "monthly" | "daily" | "hourly" {
    return this.periodicity;
  }

  public getName(): string {
    return this.name;
  }

  public getData(): [Date, number][] {
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
    return (
      this.getValues().reduce((a, b) => a + b, 0) / this.getValues().length
    );
  }

  public getMedianValue(): number {
    const values = this.getValues();
    const middle = Math.floor(values.length / 2);
    const sorted = values.sort((a, b) => a - b);
    return values.length % 2
      ? sorted[middle]
      : (sorted[middle - 1] + sorted[middle]) / 2;
  }

  public fillGaps(): TimeSeries {
    const dates = this.getDates();
    const values = this.getValues();
    const newDates: Date[] = [];
    const newValues: number[] = [];

    if (this.sortOrder === "ASC") {
      for (let i = 0; i < dates.length - 1; i++) {
        const date = dates[i];
        const nextDate = dates[i + 1];
        const value = values[i];
        const nextValue = values[i + 1];
        const diff = this.getDiff(date, nextDate);

        newDates.push(date);
        newValues.push(value);

        for (let j = 1; j < diff; j++) {
          newDates.push(this.add(date, j));
          newValues.push(
            this.zeroFill ? 0 : value + (nextValue - value) * (j / diff)
          );
        }
      }

      newDates.push(dates[dates.length - 1]);
      newValues.push(values[values.length - 1]);
    } else {
      for (let i = dates.length - 1; i > 0; i--) {
        const date = dates[i];
        const nextDate = dates[i - 1];
        const value = values[i];
        const nextValue = values[i - 1];
        const diff = this.getDiff(date, nextDate);

        newDates.push(date);
        newValues.push(value);

        for (let j = 1; j < diff; j++) {
          newDates.push(this.add(date, j));
          newValues.push(
            this.zeroFill ? 0 : value + (nextValue - value) * (j / diff)
          );
        }
      }
      newDates.push(dates[0]);
      newValues.push(values[0]);
    }

    return new TimeSeries(
      this.name,
      newDates.map((d, i) => [d, newValues[i]]),
      this.periodicity,
      this.zeroFill,
      this.sortOrder
    );
  }

  private getDiff(date1: Date, date2: Date): number {
    switch (this.periodicity) {
      case "monthly":
        return date2.getMonth() - date1.getMonth();
      case "daily":
        return Math.ceil((date2.getTime() - date1.getTime()) / 86400000);
      case "hourly":
        return Math.ceil((date2.getTime() - date1.getTime()) / 3600000);
    }
  }

  private add(date: Date, diff: number): Date {
    switch (this.periodicity) {
      case "monthly":
        return new Date(
          date.getFullYear(),
          date.getMonth() + diff,
          date.getDate()
        );
      case "daily":
        return new Date(date.getTime() + diff * 86400000);
      case "hourly":
        return new Date(date.getTime() + diff * 3600000);
    }
  }
}

export default TimeSeries;