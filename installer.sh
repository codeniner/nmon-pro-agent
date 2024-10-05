#!/bin/sh
#
#////////////////////////////////////////////////////////////
#===========================================================
# nMom Pro Linux Agent - Installer v2.0
#===========================================================
# Set environment
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Clear the screen
clear


GATEWAY=$1
KEY=$2
TYPE=$3

# Get platform and architecture
PLATFORM=$(uname -s)
ARCH=$(uname -m)


LOG=/tmp/nmon.log

echo "------------------------------------"
echo " Welcome to nMom Pro Agent Installer"
echo "------------------------------------"
echo " "


# Are we running as root
if [ $(id -u) != "0" ]; then
	echo "Installer needs to be run with root priviliges"
	echo "Try again with root privilileges"
	exit 1;
fi


# Is the server key parameter given ?
if [ $# -lt 3 ]; then
	echo "The server key, gateway or type is missing"
	echo "Exiting installer"
	exit 1;
fi


# Is CURL available?
if [  ! -n "$(command -v curl)" ]; then
	echo "CURL is required, please install curl and try again."
	echo "Exiting installer"
	exit 1;
fi


# Remove previous installation
if [ -f /opt/nmonpro/agent.js ]; then
	# Remove folder
	rm -rf /opt/nmonpro
fi


mkdir -p /opt/nmonpro >> $LOG 2>&1


if [ "$PLATFORM" = "Linux" ]; then

	if [ "$ARCH" = "x86_64" ]; then
		echo "Installing for Linux x86_64."
		NODE=node-linux-x64
		if [ -f /etc/redhat-release ]; then
			os_name=$(cat /etc/redhat-release)
			if [[ $os_name == *"CentOS Linux release 7"* ]] || [[ $os_name == *"CentOS Linux release 6"* ]]; then
				NODE=node16-linux-x64
			fi
		fi
		curl -L -s -o /opt/nmonpro/node https://github.com/codeniner/nmon-pro-agent/releases/latest/download/$NODE >> $LOG 2>&1
	fi

	if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
		echo "Installing for Linux ARM64."
		curl -L -s -o /opt/nmonpro/node https://github.com/codeniner/nmon-pro-agent/releases/latest/download/node-linux-arm64 >> $LOG 2>&1
	fi

elif [ "$PLATFORM" = "Darwin" ]; then

	if [ "$ARCH" = "x86_64" ]; then
		echo "Installing for MacOS x86_64."
		curl -L -s -o /opt/nmonpro/node https://github.com/codeniner/nmon-pro-agent/releases/latest/download/node-darwin-x64 >> $LOG 2>&1
	fi

	if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
		echo "Installing for MacOS ARM64."
		curl -L -s -o /opt/nmonpro/node https://github.com/codeniner/nmon-pro-agent/releases/latest/download/node-darwin-arm64 >> $LOG 2>&1
	fi

elif [ "$PLATFORM" = "FreeBSD" ]; then

	if [ "$ARCH" = "x86_64" ]; then
		echo "Installing for FreeBSD x86_64."
		curl -L -s -o /opt/nmonpro/node https://github.com/codeniner/nmon-pro-agent/releases/latest/download/node-linux-x64 >> $LOG 2>&1
	fi

	if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
		echo "Installing for FreeBSD ARM64."
		curl -L -s -o /opt/nmonpro/node https://github.com/codeniner/nmon-pro-agent/releases/latest/download/node-linux-arm64 >> $LOG 2>&1
	fi

else

	rm -rf /opt/nmonpro
	echo "Unsupported platform: $PLATFORM"
	echo "Exiting installer"
	exit 1;

fi


# Download the agent
curl -L -s -o /opt/nmonpro/agent.js https://github.com/codeniner/nmon-pro-agent/releases/latest/download/agent.js >> $LOG 2>&1

chmod +x /opt/nmonpro/node

/opt/nmonpro/node /opt/nmonpro/agent.js init "$GATEWAY" "$KEY" "$TYPE"

echo " "
echo "-------------------------------------"
echo " Installation Completed "
echo "-------------------------------------"


# Attempt to delete this installer
if [ -f $0 ]; then
	rm -f $0
fi