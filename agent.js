//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const si = require('systeminformation');
const fs = require('fs');
const axios = require('axios');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

let agent_version = '1.0.0';
let action = process.argv[2];
let gateway = process.argv[3];
let key = process.argv[4];
let type = process.argv[5]; // server or workstation

const fullPath = __filename;
const fileName = path.basename(fullPath);
const workingPath = __dirname;
const platform = os.platform();


async function init_stats() {
    console.log('Initializing stats...');

    const networkStats = await si.networkStats("*");
    const disksIO = await si.disksIO();
    const fsStats = await si.fsStats();
    const currentLoad = await si.currentLoad();
}


async function collect_currentLoad() {
    console.log('Collecting current load...');

    const currentLoad = await si.currentLoad();

    return currentLoad;
}


async function collect_all_other(collectAll) {
    console.log('Collecting all other...');

    let allData = {};


    // static data
    if(collectAll) {
        const system = await si.system(); 
        allData.system = system;
        
        const bios = await si.bios(); 
        allData.bios = bios;

        const baseboard = await si.baseboard(); 
        allData.baseboard = baseboard ?? null;

        const chassis = await si.chassis(); 
        allData.chassis = chassis;

        const osInfo = await si.osInfo(); 
        allData.os = osInfo;

        const uuid = await si.uuid(); 
        allData.uuid = uuid;

        const versions = await si.versions(); 
        allData.versions = versions;

        const cpu = await si.cpu(); 
        allData.cpu = cpu;

        const graphics = await si.graphics(); 
        allData.graphics = graphics;

        const networkInterfaces = await si.networkInterfaces(); 
        allData.net = networkInterfaces;

        const memLayout = await si.memLayout(); 
        allData.memLayout = memLayout;

        const diskLayout = await si.diskLayout(); 
        allData.diskLayout = diskLayout;

        const blockDevices = await si.blockDevices(); 
        allData.blockDevices = blockDevices;

        const cpuCurrentSpeed = await si.cpuCurrentSpeed(); 
        allData.cpuCurrentSpeed = cpuCurrentSpeed;

        const battery = await si.battery(); 
        allData.battery = battery;

        const users = await si.users(); 
        allData.users = users;

        const printers = await si.printer(); 
        allData.printers = printers;
        
        const usb = await si.usb(); 
        allData.usb = usb;

        const audio = await si.audio(); 
        allData.audio = audio;

        const bluetoothDevices = await si.bluetoothDevices(); 
        allData.bluetoothDevices = bluetoothDevices;

        const wifiConnections = await si.wifiConnections(); 
        allData.wifiConnections = wifiConnections;
    }


    const time = await si.time(); 
    allData.time = time;

    // hystorical data
    const cpuTemperature = await si.cpuTemperature(); 
    allData.temp = cpuTemperature;

    const disksIO = await si.disksIO(); 
    allData.disksIO = disksIO;

    const fsStats = await si.fsStats(); 
    allData.fsStats = fsStats;

    const fsSize = await si.fsSize(); 
    allData.fsSize = fsSize;

    const mem = await si.mem(); 
    allData.mem = mem;

    const processes = await si.processes(); 
    allData.processes = processes;

    const networkConnections = await si.networkConnections(); 
    allData.networkConnections = networkConnections;

    const inetLatency = await si.inetLatency(); 
    allData.inetLatency = inetLatency;

    const dockerAll = await si.dockerAll(); 
    allData.docker = dockerAll;

    const networkStats = await si.networkStats('*'); 
    allData.networkStats = networkStats;

    const services = await si.services('*'); 
    allData.services = services;


    allData.agent_version = agent_version;
  


    return allData;
}


function run(collectAll = true) {

    collect_currentLoad().then(function(currentLoad) {


        collect_all_other(collectAll).then(function(allData) {
            
            //const mergedData = Object.assign({}, currentLoad, allData)  
            allData.currentLoad = currentLoad;

            console.log('Sending stats...');

            fs.writeFile(workingPath + '/latest.json', JSON.stringify(allData), function (err) { });

 
            console.log('Sending stats to ' + gateway + '/api/' + type + '/' + key);

            const axiosResult = axios.post(gateway + '/api/' + type + '/' + key, allData);
            axiosResult.then(function(response) {
                console.log(response.data);
            });
            

        }).catch(error => console.error(error));

    }).catch(error => console.error(error));

    
}




if(action == 'init') {

    let config = {};
    config.key = key;
    config.gateway = gateway;
    config.type = type;
    config.lastRun = null;
    config.runCount = 0;
    fs.writeFile(workingPath + '/config.json', JSON.stringify(config), function (err) { });


    if(type == 'server') {

        if(platform == 'linux' || platform == 'freebsd' || platform == 'openbsd') {
            console.log(platform + ' detected. Initializing with cron job...');

            let cron = "";
            if(type == 'server') {
                cron = '* * * * * ' + fullPath + ' run';
            }
            if(type == 'workstation') {
                cron = '0 * * * * ' + fullPath + ' run';
            }
            
            // Check if cron job already exists
            exec('crontab -l', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error checking cron jobs: ${error.message}`);
                    return;
                }
                
                if (stdout.includes(cron)) {
                    console.log('Cron job already exists. Skipping...');
                } else {
                    // Add cron job
                    exec(`(crontab -l 2>/dev/null; echo "${cron} run") | crontab -`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error adding cron job: ${error.message}`);
                            return;
                        }
                        
                        console.log('Cron job added successfully.');
                    });
                }
            });

            console.log('Done.');
        }

        if(platform == 'win32') {
            console.log(platform + ' detected. Initializing with task scheduler...');

            let task = "";
            if(type == 'server') {
                task = 'schtasks /create /tn "nMon Pro Agent" /tr "' + fullPath + ' run" /sc minute /mo 1 /ru SYSTEM';
            }
            if(type == 'workstation') {
                task = 'schtasks /create /tn "nMon Pro Agent" /tr "' + fullPath + ' run" /sc minute /mo 60 /ru SYSTEM';
            }
            
            
            exec(task, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error creating task: ${error.message}`);
                    return;
                }
                
                console.log('Task created successfully.');
            });

            console.log('Done.');
        }
    
        if(platform == 'darwin') {
            console.log('MacOS detected. Initializing with launch daemon.');

            StartInterval = 60;

            if(type == 'server') {
                StartInterval = 60;
            }
            if(type == 'workstation') {
                StartInterval = 3600;
            }

            const launchdPlist = `
            <?xml version="1.0" encoding="UTF-8"?>
            <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
            <plist version="1.0">
                <dict>
                    <key>Label</key>
                    <string>com.codeniner.nmonpro.agent</string>
                    <key>RunAtLoad</key>
                    <true/>
                    <key>StartInterval</key>
                    <integer>` + StartInterval + `</integer>
                    <key>StandardErrorPath</key>
                    <string>` + workingPath + `/error.log</string>
                    <key>StandardOutPath</key>
                    <string>` + workingPath + `/stdout.log</string>
                    <key>EnvironmentVariables</key>
                    <dict>
                        <key>PATH</key>
                        <string><![CDATA[/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin]]></string>
                    </dict>
                    <key>WorkingDirectory</key>
                    <string>` + workingPath + `</string>
                    <key>ProgramArguments</key>
                    <array>
                        <string>` + fullPath + `</string>
                        <string>run</string>
                    </array>
                </dict>
            </plist>
            `;

            fs.writeFile('/Library/LaunchDaemons/com.codeniner.nmonpro.agent.plist', launchdPlist, function (err) {
                if (err) {
                    console.error('Error creating launch daemon:', err);
                } else {
                    console.log('Launch daemon created successfully.');
                    exec('launchctl load /Library/LaunchDaemons/com.codeniner.nmonpro.agent.plist', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error loading launch daemon: ${error.message}`);
                            return;
                        }
                        
                        console.log('Launch daemon loaded successfully.');
                    });
                }
            });


            console.log('Sending first data set to the server.');

            init_stats();
            setTimeout(run, 3000);


            console.log('Done.');
        }

    }


}


if(action == 'deinit') {

    if(platform == 'linux' || platform == 'freebsd' || platform == 'openbsd') {
        console.log(platform + ' detected. Removing cron job...');
        let cron = '* * * * * ' + workingPath + '/' + fileName + ' run';
        exec(`crontab -l | grep -v '${cron}' | crontab -`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error removing cron job: ${error.message}`);
                return;
            }
            
            console.log('Cron job removed successfully.');
        });

        console.log('Done.');
    }

    if(platform == 'win32') {
        console.log(platform + ' detected. Removing task...');
        exec('schtasks /delete /tn "nMon Pro Agent" /f', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error removing task: ${error.message}`);
                return;
            }
            
            console.log('Task removed successfully.');
        });

        console.log('Done.');
    }

    if(platform == 'darwin') {
        console.log('MacOS detected. Removing launch daemon...');
        exec('launchctl unload /Library/LaunchDaemons/com.codeniner.nmonpro.agent.plist', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error unloading launch daemon: ${error.message}`);
                return;
            }
            
            fs.unlink('/Library/LaunchDaemons/com.codeniner.nmonpro.agent.plist', function (err) {
                if (err) {
                    console.error('Error removing launch daemon:', err);
                } else {
                    console.log('Launch daemon removed successfully.');
                }
            });
        });

        console.log('Done.');
    }


    console.log('Removing config...');
    fs.unlink(workingPath + '/config.json', function (err) { });
    console.log('Done.');
 

}


if(action == 'run') {

    if(!gateway || !key || !type) {

        fs.readFile(workingPath + '/config.json', 'utf8', function (err, data) {
            if (err) {
                console.error(err);
                return;
            }
            const config = JSON.parse(data);
            gateway = config.gateway;
            key = config.key;
            type = config.type;
            lastRun = config.lastRun;
            runCount = config.runCount;

            //const { gateway, key, type, lastRun, runCount } = config;

            if (gateway && key && type) {

                init_stats();

                if(runCount > 60) {
                    setTimeout(run, 3000, true); // collecting all data
                    var newRunCount = 0; 
                } else {
                    setTimeout(run, 3000, false); // collecting only historicall data
                    var newRunCount = runCount + 1;
                }
                

                const currentTime = new Date().toISOString();
                config.lastRun = currentTime;
                config.runCount = newRunCount;
                fs.writeFile(workingPath + '/config.json', JSON.stringify(config), function (err) {
                    if (err) {
                        console.error(err);
                    }
                });


            }
        });

    } else {
        init_stats();
        setTimeout(run, 3000, true);
    }
}


if(!action) {
    console.log('Action not specified.'); 
}

