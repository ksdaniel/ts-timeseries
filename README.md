# Time series data type

The reasoning behind this package is rather simple: most plotting libraries require as input two array's: one with labels, one with values. For time series, most of the times we want to see continuous time intervals, with missing data either interporlated or set to 0. Usually, backends will not provide "zero values" for the missing dates. This is the main usage scenario for this package. 

Sample usage here: 

```typescript
const _timeSeries = new TimeSeries("test", // name of the dataset 
  [[new Date(2020, 0, 0), 1],
  [new Date(2020, 0, 1), 2],
  [new Date(2020, 0, 4), 3]], // the actual date / value pairs 
  "daily", // periodicity
  true, // true - fill with zero, false - linear interpolation
  "ASC" // sorting of the date values (ASC or DESC)
);

console.log(_timeSeries.fillGaps());
``` 

Output will be: 

```typescript 
TimeSeries {
  name: 'test',
  data: [
    [ 2019-12-30T22:00:00.000Z, 1 ],
    [ 2019-12-31T22:00:00.000Z, 2 ],
    [ 2020-01-01T22:00:00.000Z, 0 ],
    [ 2020-01-02T22:00:00.000Z, 0 ],
    [ 2020-01-03T22:00:00.000Z, 3 ]
  ],
  periodicity: 'daily',
  zeroFill: true
}
```

Basic value interpolation: 

```typescript 
const _timeSeries = new TimeSeries("test", [
  [new Date(2020, 0, 0), 1],
  [new Date(2020, 0, 1), 2],
  [new Date(2020, 0, 4), 3]],
  "daily", 
  false
);

console.log(_timeSeries.fillGaps());
```

And the output will show interpolate values: 

```typescript
TimeSeries {
  name: 'test',
  data: [
    [ 2019-12-30T22:00:00.000Z, 1 ],
    [ 2019-12-31T22:00:00.000Z, 2 ],
    [ 2020-01-01T22:00:00.000Z, 2.3333333333333335 ],
    [ 2020-01-02T22:00:00.000Z, 2.6666666666666665 ],
    [ 2020-01-03T22:00:00.000Z, 3 ]
  ],
  periodicity: 'daily',
  zeroFill: true
}
```