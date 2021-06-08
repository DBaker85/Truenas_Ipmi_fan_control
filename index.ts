const { exec } = require("child_process");
const { readJSON } = require("fs-extra");
const { resolve } = require("path");

(async () => {
  try {
    const { ip, user, password } = await readJSON(resolve("secrets.json"));

    exec(
      `ipmitool -I lanplus -H ${ip} -U ${user} -P ${password} sensor list`,
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
    exec(
      `ipmitool -I lanplus -H ${ip} -U ${user} -P ${password} sensor list`,
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
