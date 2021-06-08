const { exec } = require("child_process");
const {readJSON, writeJSON} = require("fs-extra");
const {resolve} = require("path");
const prompts = require('prompts');

(async ()=>{
try { 
const {ip, user, password} = await readJSON(resolve('secrets.json'))

exec(`ipmitool -I lanplus -H ${ip} -U ${user} -P ${password} sensor list`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout with no cinfig: ${stdout}`);
});

} catch (err){
    const questions = [
        {
          type: 'text',
          name: 'ip',
          message: `Enter your server's ip adress`
        },
        {
          type: 'text',
          name: 'user',
          message: 'Enter your user name'
        },
        {
          type: 'password',
          name: 'password',
          message: 'Enter your password',
          initial: 'Why should I?'
        }
      ];
      const response = await prompts(questions);
      const {ip, user, password} = response;
      writeJSON('secrets.json', response)
      
      exec(`ipmitool -I lanplus -H ${ip} -U ${user} -P ${password} sensor list`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout with no cinfig: ${stdout}`);
    });
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




})()