import { Glances, SensorType } from "./types";

export const getHighestTemp = (json: Glances) => {
  const cpuTemps = json.sensors.filter(
    (sensor) => sensor.type === SensorType.TemperatureCore
  );
  const maxValue = Math.max.apply(
    Math,
    cpuTemps.map((temp) => temp.value)
  );

  return isFinite(maxValue) ? maxValue : 0;
};
