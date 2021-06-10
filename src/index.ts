import { execSync } from "child_process";
import { readJSON } from "fs-extra";
import { resolve } from "path";
import fetch from "node-fetch";

import { timer } from "rxjs";
import { concatMap } from "rxjs/operators";

import { getUnixTime, subSeconds } from "date-fns";
import ora from "ora";

import { manualMode, fanSpeed15, fan5Off, autoMode } from "./ipmiCommands";
import { getHighestTemp } from "./utils";
import { SecretsType } from "./types";

const tempThreshold = 60;
let automode = "on";
let sendingCommands = false;
const spinner = ora("Begin monitoring");

(async () => {
  try {
    const { IpmiIp, IpmiUser, IpmiPassword, nasIp, nasApiKey } =
      (await readJSON(resolve("secrets.json"))) as SecretsType;
    console.log(`Config found, Initializing control`);
    sendingCommands = true;
    console.log(`Setting manual mode`);
    execSync(
      `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${manualMode}`
    );
    console.log(`Setting fans to 15%`);
    execSync(
      `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${fanSpeed15}`
    );
    console.log(`Turning off fan 5`);
    execSync(
      `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${fan5Off}`
    );

    automode = "off";
    sendingCommands = false;
    spinner.start();
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
            console.log(`Threshold exceeded, setting Auto mode`);
            sendingCommands = true;
            execSync(
              `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${autoMode}`
            );
            automode = "on";
            sendingCommands = false;
          }
          if (automode === "on" && temp < tempThreshold) {
            console.log(`Temperatures within safe limits, setting Manual mode`);
            sendingCommands = true;
            execSync(
              `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${manualMode}`
            );

            execSync(
              `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${fanSpeed15}`
            );

            execSync(
              `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${fan5Off}`
            );

            automode = "off";
            sendingCommands = false;
          }
        }
      });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
