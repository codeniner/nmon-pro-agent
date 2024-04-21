const si = require('systeminformation');
const fs = require('fs');
const axios = require('axios');

let agent_version = '1.0.0';
let action = process.argv[2];
let gateway = process.argv[3];
let serverkey = process.argv[4];

async function init_stats() {
    console.log('Initiating stats...');

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


async function collect_all_other() {
    console.log('Collecting all other...');

    let allData = {};


    // static data
    const system = await si.system(); 
    allData.system = system;

    const bios = await si.bios(); 
    allData.bios = bios;

    const baseboard = await si.baseboard(); 
    allData.baseboard = baseboard;

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

    const time = await si.time(); 
    allData.time = time;

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

        
        
        //allData.inetLatency = await si.inetLatency();
        

        //const dockerAll = await si.dockerAll();
        // const printer = await si.printer();
        // const usb = await si.usb();
        // const audio = await si.audio();
        // const bluetoothDevices = await si.bluetoothDevices();
        // const networkInterfaces = await si.networkInterfaces();
        // const wifiConnections = await si.wifiConnections();
        // const blockDevices = await si.blockDevices();
    
        // allData.docker = dockerAll;
        // allData.printers = printer;
        // allData.usb = usb;
        // allData.audio = audio;
        // allData.bluetoothDevices = bluetoothDevices;
        // allData.networkInterfaces = networkInterfaces;
        // allData.wifiConnections = wifiConnections;
        // allData.blockDevices = blockDevices;
    
        //allData.currentLoad = currentLoad;

    allData.agent_version = agent_version;
  



    return allData;
}

function run() {

    collect_currentLoad().then(function(currentLoad) {


        collect_all_other().then(function(allData) {
            
            //const mergedData = Object.assign({}, currentLoad, allData)  
            allData.currentLoad = currentLoad;

            console.log('Sending stats...');

            
            fs.writeFile('latest.json', JSON.stringify(allData), function (err) { });

            if (gateway && serverkey) {
                console.log('Sending stats to ' + gateway + '/api/server/' + serverkey);

                const axiosResult = axios.post(gateway + '/api/server/' + serverkey, allData);
                axiosResult.then(function(response) {
                    console.log(response.data);
                });
            }

        }).catch(error => console.error(error));

    }).catch(error => console.error(error));

    
}


if(action == 'run') {
    init_stats();
    setTimeout(run, 3000);
}

if(!action) {

    if (typeof sea !== 'undefined') {
        console.log('Usage: agent run <gateway> <serverkey>');
    } else {
        console.log('Usage: node agent.js run <gateway> <serverkey>');
    }

    
}

