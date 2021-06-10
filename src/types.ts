export type SecretsType = {
  IpmiIp: String;
  IpmiUser: String;
  IpmiPassword: String;
  nasIp: String;
  nasApiKey: String;
};

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

export type GraphResponse = SensorGraphType[];
