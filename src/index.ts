import { spawnSync } from "child_process";
import { readJSON } from "fs-extra";
import { resolve } from "path";
import fetch from "node-fetch";

import { timer, from, of } from "rxjs";
import { map, filter, concatMap } from "rxjs/operators";

import { getUnixTime, subSeconds } from "date-fns";

import { manualMode, fanSpeed15, fan5Off, autoMode } from "./ipmiCommands";
import { getHighestTemp } from "./utils";
import { SecretsType } from "./types";

const tempThreshold = 60;
let automode = "on";
let sendingCommands = false;

(async () => {
  try {
    const { IpmiIp, IpmiUser, IpmiPassword, nasIp, nasApiKey } =
      (await readJSON(resolve("secrets.json"))) as SecretsType;
    sendingCommands = true;
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
    sendingCommands = false;
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
        if ((sendingCommands = false)) {
          if (automode === "off" && temp > tempThreshold) {
            sendingCommands = true;
            spawnSync(
              `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${autoMode}`
            );
            automode = "on";
            sendingCommands = false;
          }
          if (automode === "on" && temp < tempThreshold) {
            sendingCommands = true;
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
            sendingCommands = false;
          }
        }
      });
  } catch (err) {
    console.error(err);
  }
})();
