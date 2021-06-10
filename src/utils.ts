import { GraphResponse } from "./types";

export const getHighestTemp = (json: GraphResponse) => {
  const maxValue = Math.max(...json[0].aggregations.max);

  return isFinite(maxValue) ? maxValue : 0;
};
