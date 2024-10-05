New-Item -ItemType Directory -Force -Path "C:\Program Files\nMon Pro";

$gateway=$args[0]
$key=$args[1]
$type=$args[2]


$cpuArch = (Get-WmiObject -Class Win32_Processor).Architecture

if ($cpuArch -eq 9) {
	Write-Host "Installing for x64"
	Invoke-WebRequest -Uri https://github.com/codeniner/nmon-pro-agent/releases/latest/download/node-win-x64.exe -OutFile "C:\Program Files\nMon Pro\node.exe" -UseBasicParsing;
} elseif ($cpuArch -eq 5) {
	Write-Host "Installing for ARM64"
	Invoke-WebRequest -Uri https://github.com/codeniner/nmon-pro-agent/releases/latest/download/node-win-arm64.exe -OutFile "C:\Program Files\nMon Pro\node.exe" -UseBasicParsing;
} else {
	throw "Unsupported CPU architecture"
}


Invoke-WebRequest -Uri https://github.com/codeniner/nmon-pro-agent/releases/latest/download/agent.js -OutFile "C:\Program Files\nMon Pro\agent.js" -UseBasicParsing;

& "C:\Program Files\nMon Pro\node.exe" "C:\Program Files\nMon Pro\agent.js" init $gateway $key $type