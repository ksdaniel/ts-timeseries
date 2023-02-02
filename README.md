### Time series data type

Sample usage here: 

```typescript
const _timeSeries = new TimeSeries("test", [
  [new Date(2020, 0, 0), 1],
  [new Date(2020, 0, 1), 2],
  [new Date(2020, 0, 4), 3]],
  "daily"
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
