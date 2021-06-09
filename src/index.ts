import { spawnSync } from "child_process";
import { readJSON } from "fs-extra";
import { resolve } from "path";

import { manualMode, fanSpeed15, fan5Off } from "./ipmiCommands";

type SecretsType = {
  IpmiIp: String;
  IpmiUser: String;
  IpmiPassword: String;
  nasIp: String;
  nasApiKey: String;
};

(async () => {
  try {
    const { IpmiIp, IpmiUser, IpmiPassword } = (await readJSON(
      resolve("secrets.json")
    )) as SecretsType;

    spawnSync(
      `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${manualMode}`
    );

    spawnSync(
      `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${fanSpeed15}`
    );

    spawnSync(
      `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} ${fan5Off}`
    );
  } catch (err) {
    console.error(
      `no config file found, try running npm run setup to get started`
    );
  }
  /**
 *  Manual mode

    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw 0x30 0x30 0x01 0x00

    auto mode 

    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw 0x30 0x30 0x01 0x01

    15%
    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw 0x30 0x30 0x02 0xff 0x0f

    Fan 5 0% 
    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw  0x30 0x30 0x02 0x04 0x00
 * 
 */
})();
