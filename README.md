# nMon Pro Agent
The nMon Pro agent

## Build

> This steps assumes you already have node and npm installed on your system. For more information on how to install node and npm please see [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
> The minimum node version is 22

To build the agent follow this steps:  

1. Clone this repository

`git clone https://github.com/codeniner/nmon-pro-agent`

2. Change to nmon-pro-agent folder

`cd nmon-pro-agent`


3. Install dependencies

`npm install --save-dev`

4. Run the build script

`npm run build`  

You can find the build file at `build/agent.js`.  

To run the agent: `node build/agent.js run <gateway> <key> <server/workstation>`


## Create single executable builds

1. Generate the blob to be injected

`node --experimental-sea-config sea-config.json`

This will create the blob file that will be injected in the node executable.


2. Create a copy of the node executable and name it according to your needs

On systems other than Windows  
`cp $(command -v node) build/agent`

On Windows  
`node -e "require('fs').copyFileSync(process.execPath, 'build/agent.exe')"`


3. Remove the signature of the binary (macOS and Windows only):

On macOS:  
`codesign --remove-signature build/agent`

On Windows:  
`signtool remove /s build/agent.exe`


4. Inject the blob into the node executable

 > Make sure the build/agent or build/agent.exe (windows) is writable before injecting.

On Linux:  
`npx postject build/agent NODE_SEA_BLOB build/agent.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`


On Windows - PowerShell:  
``npx postject build/agent.exe NODE_SEA_BLOB build/agent.blob `
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2``


On Windows - Command Prompt:  
`npx postject build/agent.exe NODE_SEA_BLOB build/agent.blob ^
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 `


On macOS:  
`npx postject build/agent NODE_SEA_BLOB build/agent.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
    --macho-segment-name NODE_SEA`

5. Sign the binary (macOS and Windows only)

On macOS:  
`codesign --sign - build/agent`

On Windows (optional):  
> A certificate needs to be present for this to work. However, the unsigned binary would still be runnable.  

`signtool sign /fd SHA256 build/agent.exe `

## Use

### Initialize agent

On Linux/BSD/MacOS:  
`sudo ./agent init <gateway> <key> <server/workstation>`

On Windows (elevated Command Prompt or PowerShell):  
`agent.exe init <gateway> <key> <server/workstation>`


### Deinitialize agent

On Linux/BSD/MacOS:  
`sudo ./agent deinit`

On Windows:  
`agent.exe deinit`


### Run on demand

On systems other than Windows:  
`./agent run <gateway> <key> <server/workstation>`

On Windows  
`agent.exe run <gateway> <key> <server/workstation>`


### Oneline Install & Initialize

On Linux x64 (terminal): 
`sudo mkdir -p /opt/nmonpro && sudo wget -N --no-check-certificate -O /opt/nmonpro/agent https://github.com/codeniner/nmon-pro-agent/releases/latest/download/nMonProAgent-linux-x64 && sudo /opt/nmonpro/agent init <gateway> <key> <server/workstation>`

On MacOS (terminal): 
`sudo mkdir -p /opt/nmonpro && sudo wget -N --no-check-certificate -O /opt/nmonpro/agent https://github.com/codeniner/nmon-pro-agent/releases/latest/download/nMonProAgent-darwin-arm64 && sudo /opt/nmonpro/agent init <gateway> <key> <server/workstation>`

On Windows (PowerShell):  
`New-Item -ItemType Directory -Force -Path C:\opt\nmonpro; Invoke-WebRequest -Uri https://github.com/codeniner/nmon-pro-agent/releases/latest/download/nMonProAgent-win-x64.exe -OutFile C:\opt\nmonpro\agent -UseBasicParsing; C:\opt\nmonpro\agent init <gateway> <key> <server/workstation>`

> Please replace <path to the agent binary>, <gateway>, <key>, and <server/workstation> with your actual values.


