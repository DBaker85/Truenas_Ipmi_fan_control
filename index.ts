import { exec } from "child_process";
import { readJSON } from "fs-extra";
import { resolve } from "path";

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

    exec(
      `ipmitool -I lanplus -H ${IpmiIp} -U ${IpmiUser} -P ${IpmiPassword} sensor list`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout with no cinfig: ${stdout}`);
      }
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
