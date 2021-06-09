import { spawnSync } from "child_process";
import { readJSON } from "fs-extra";
import { resolve } from "path";
import fetch, { Response } from "node-fetch";

import { timer, from, of } from "rxjs";
import { map, filter, concatMap } from "rxjs/operators";

import { getUnixTime, subSeconds } from "date-fns";

import { manualMode, fanSpeed15, fan5Off, autoMode } from "./ipmiCommands";

import { getHighestTemp } from "./utils";

type SecretsType = {
  IpmiIp: String;
  IpmiUser: String;
  IpmiPassword: String;
  nasIp: String;
  nasApiKey: String;
};

const tempThreshold = 60;

let automode = "on";

(async () => {
  try {
    const { IpmiIp, IpmiUser, IpmiPassword, nasIp, nasApiKey } =
      (await readJSON(resolve("secrets.json"))) as SecretsType;

    spawnSync(
      `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${manualMode}`
    );

    spawnSync(
      `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${fanSpeed15}`
    );

    spawnSync(
      `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${fan5Off}`
    );

    automode = "off";

    timer(1, 1000)
      .pipe(
        concatMap(async (id) => {
          const res = await fetch(
            `http://${nasIp}/api/v2.0/reporting/get_data`,
            {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              headers: {
                Authorization: `Bearer ${nasApiKey}`,
              },
              body: JSON.stringify({
                graphs: [
                  {
                    name: "cputemp",
                  },
                ],
                reporting_query: {
                  start: `${getUnixTime(subSeconds(new Date(), 10))}`,
                  end: `${getUnixTime(subSeconds(new Date(), 10))}`,
                  aggregate: true,
                },
              }),
            }
          );
          const json = await res.json();

          return getHighestTemp(json);
        })
      )
      .subscribe((temp: number) => {
        if (automode === "off" && temp > tempThreshold) {
          spawnSync(
            `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${autoMode}`
          );
          automode = "on";
        }
        if (automode === "on" && temp < tempThreshold) {
          spawnSync(
            `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${manualMode}`
          );

          spawnSync(
            `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${fanSpeed15}`
          );

          spawnSync(
            `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${fan5Off}`
          );

          automode = "off";
        }
      });
  } catch (err) {
    console.error(err);
  }
})();
