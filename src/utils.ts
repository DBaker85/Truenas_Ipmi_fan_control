export interface SensorGraphType {
  name: string;
  identifier: null;
  data: Array<Array<number | null>>;
  start: number;
  end: number;
  step: number;
  legend: string[];
  aggregations: Aggregations;
}

export interface Aggregations {
  min: number[];
  mean: number[];
  max: number[];
}

type GraphResponse = SensorGraphType[];

export const getHighestTemp = (json: GraphResponse) => {
  const maxValue = Math.max(...json[0].aggregations.max);

  return isFinite(maxValue) ? maxValue : 0;
};
