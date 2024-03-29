#!/bin/bash

# This script will install everything required to run a saashq and its related apps.
# This should be run on a clean Ubuntu 18.04 server.
#
# First, you will be asked to provide a domain name you are going to use for saashq.
# 
# Once the installation has completed you will be able to access the saashq.
# 
# * we expect you have configured your domain DNS settings already as per the instructions.

IS_ENABLED_TELEMETRY=true

if [[ $1 == 'disable-telemetry' ]]; then
  IS_ENABLED_TELEMETRY=false
fi

CPU_COUNT=`nproc --all`
MEMORY_INFO=$(awk '/MemTotal/ {print $2}' /proc/meminfo)
TOTAL_MEMERY_SIZE=$(($MEMORY_INFO/1024))

IS_BIG_SERVER=false
ELK_SYNCER="false"

if [ $CPU_COUNT -ge 8 ] && [ $TOTAL_MEMERY_SIZE -ge 16000 ]; then
        IS_BIG_SERVER=true
        ELK_SYNCER="true"
fi

set -Eeuo pipefail

trap notify ERR

NODE_VERSION=v12.19.0

ELASTICSEARCH_URL="http://localhost:9200"
RABBITMQ_HOST=""
REDIS_HOST=""

OS_NAME=notset
DISTRO=notset
RELEASE=notset
ARCH=`uname -m`

case "$OSTYPE" in
  solaris*) OS_NAME="solaris" ;;
  darwin*)  
  	OS_NAME="darwin" 
	  RELEASE=`uname -r`
  ;; 
  linux*)   
  	OS_NAME="linux" 
	
    if [ -f /etc/redhat-release ] ; then
      DistroBasedOn='RedHat'
      DISTRO=`cat /etc/redhat-release |sed s/\ release.*//`
      PSUEDONAME=`cat /etc/redhat-release | sed s/.*\(// | sed s/\)//`
      RELEASE=`cat /etc/redhat-release | sed s/.*release\ // | sed s/\ .*//`
    elif [ -f /etc/SuSE-release ] ; then
      DistroBasedOn='SuSe'
      PSUEDONAME=`cat /etc/SuSE-release | tr "\n" ' '| sed s/VERSION.*//`
      RELEASE=`cat /etc/SuSE-release | tr "\n" ' ' | sed s/.*=\ //`
    elif [ -f /etc/mandrake-release ] ; then
      DistroBasedOn='Mandrake'
      PSUEDONAME=`cat /etc/mandrake-release | sed s/.*\(// | sed s/\)//`
      RELEASE=`cat /etc/mandrake-release | sed s/.*release\ // | sed s/\ .*//`
    elif [ -f /etc/debian_version ] ; then
      DistroBasedOn='Debian'
      DISTRO=`lsb_release -is`
      PSUEDONAME=`lsb_release -cs`
      RELEASE=`lsb_release -rs`
    elif [ -f /etc/ubuntu_version ] ; then
      DistroBasedOn='Ubuntu'
      DISTRO='lsb_release -is'
      PSUEDONAME='lsb_release -cs'
      RELEASE='lsb_release -rs'
    fi
  ;;
  bsd*)     OS_NAME="bsd" ;;
  msys*)    OS_NAME="windows" ;;
  *)        OS_NAME="unknown: $OSTYPE" ;;
esac

CPU_DATA=""
CPUs=`lscpu | awk '/^CPU\(s\)/{print $2}'`
MODEL_NAME=`lscpu | awk -F ":" '/Model name:/{gsub(/^[ \t]+/,"",$2); print $2}'`
CPU_SPEED=`lscpu | awk -F ":" '/CPU MHz:/{gsub(/^[ \t]+/,"",$2); print $2}'`

for ((i=1;i<=$CPUs;i++)); 
do 
   CPU_DATA="$CPU_DATA {	\"model\": \"$MODEL_NAME\", \"speed\": \"$CPU_SPEED\"	},"
done
CPU_DATA=`echo $CPU_DATA | sed 's/,*$//g'`;

POST_DATA="$(cat <<EOF
  "osInformation": {
    "nodeVersion" : "$NODE_VERSION",
    "platform" : "$OS_NAME",
    "distro": "$DISTRO",
    "release" : "$RELEASE",
    "arch": "$ARCH",
    "cpus": [$CPU_DATA]
  }
EOF
)"

NOW="$(date +'%Y-%m-%d %H:%M:%S')"

function notify() {
  FAILED_COMMAND="Something went wrong on line $LINENO : Failed command: ${BASH_COMMAND}"
  
  curl -s -X POST https://telemetry.saashq.org/events/ \
    -H 'content-type: application/json' \
    -d "$(cat <<EOF
      [{
        "eventType": "CLI_COMMAND_installation_status",
        "errorMessage": "$FAILED_COMMAND",
        "message": "error",
        "time": "$NOW",
        $POST_DATA
      }]
EOF
      )"
}

#
# Ask a domain name
#
echo "You need to configure saashq to work with your domain name. If you are using a subdomain, please use the entire subdomain. For example, 'saashq.examples.com'."
while true; do

    read -p "Please enter a domain name you wish to use: " saashq_domain

    if [ -z "$saashq_domain" ]; then
        continue
    else
        break
    fi
done

# install curl for telemetry
apt-get -qqy install -y curl 

if $IS_ENABLED_TELEMETRY; then
curl -s -X POST https://telemetry.saashq.org/events/ \
  -H 'content-type: application/json' \
  -d "$(cat <<EOF
      [{
        "eventType": "CLI_COMMAND_installation_status",
        "message": "attempt",
        "time": "$NOW",
        $POST_DATA
      }]
EOF
      )"
fi

# Dependencies
echo "Installing Initial Dependencies"
apt-get -qqy update
apt-get -qqy install -y wget gnupg apt-transport-https software-properties-common python3-pip ufw


if $ELK_SYNCER; then
  pip3 install mongo-connector==3.1.1
  pip3 install elasticsearch==7.5.1
  pip3 install elastic2-doc-manager==1.0.0
  pip3 install python-dotenv==0.11.0
  pip3 install certifi==0.0.8
  pip3 install pymongo==3.11.0
fi

function installEs () {
  echo "ElasticSearch will be installed"
  # Java , elasticsearch dependency
  echo "Installing Java"
  apt-get -qqy update
  apt-get -qqy install default-jre -y
  echo "Installed Java successfully"

  # Elasticsearch
  # https://www.elastic.co/guide/en/elasticsearch/reference/current/deb.html
  wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
  echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | tee -a /etc/apt/sources.list.d/elastic-7.x.list
  apt-get -qqy update
  apt-get -qqy install elasticsearch
  systemctl enable elasticsearch
  systemctl start elasticsearch
  echo "Installed Elasticsearch successfully"
}

if $IS_BIG_SERVER;
then
  installEs
else
  #
  # Ask ES option
  #
  esMessage="Would you like to install ElasticSearch on your server or use our free ElasticSearch service https://elasticsearch.saashq.org ?"
  while true; do
    esChoice=$(whiptail --radiolist --nocancel --title "ElasticSearch" "$esMessage" 20 50 2 -- 1 "Install ElasticSearch" "ON" 2 "Use elasticsearch.saashq.org" "OFF" 3>&1 1>&2 2>&3)
    if [ -z "$esChoice" ]; then
        continue
    else
        break
    fi
  done

  if [ $esChoice -eq 1 ];
  then
    installEs
  else
    ELASTICSEARCH_URL="https://elasticsearch.saashq.org"
    echo "Using elasticsearch.saashq.org"
  fi
fi

function installRedis () {
  REDIS_HOST="localhost"
  echo "Redis will be installed"
  echo "Installing Redis"
  apt -qqy install -y redis-server
  systemctl enable redis-server
  systemctl start redis-server
  echo "Installed Redis successfully"
}

if $IS_BIG_SERVER;
then
  installRedis
else
  read -p "Would you like to install Redis on your server (y/n)?" choice
  case "$choice" in 
    y|Y )
      installRedis
      ;;

    n|N ) echo "Using runtime variable for in memory storage";;
    * ) echo "invalid";;
  esac
fi

function installRabbitMQ () {
RABBITMQ_HOST="amqp://localhost"
echo "Installing RabbitMQ"
apt-get install curl gnupg apt-transport-https -y

## Team RabbitMQ's main signing key
curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" | sudo gpg --dearmor | sudo tee /usr/share/keyrings/com.rabbitmq.team.gpg > /dev/null
## Cloudsmith: modern Erlang repository
curl -1sLf https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/gpg.E495BB49CC4BBE5B.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/io.cloudsmith.rabbitmq.E495BB49CC4BBE5B.gpg > /dev/null
## Cloudsmith: RabbitMQ repository
curl -1sLf https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/gpg.9F4587F226208342.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/io.cloudsmith.rabbitmq.9F4587F226208342.gpg > /dev/null

## Add apt repositories maintained by Team RabbitMQ
sudo tee /etc/apt/sources.list.d/rabbitmq.list <<EOF
## Provides modern Erlang/OTP releases
##
deb [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.E495BB49CC4BBE5B.gpg] https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/deb/ubuntu focal main
deb-src [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.E495BB49CC4BBE5B.gpg] https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-erlang/deb/ubuntu focal main

## Provides RabbitMQ
##
deb [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.9F4587F226208342.gpg] https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/deb/ubuntu focal main
deb-src [signed-by=/usr/share/keyrings/io.cloudsmith.rabbitmq.9F4587F226208342.gpg] https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/deb/ubuntu focal main
EOF

## Update package indices
sudo apt-get update -y

## Install Erlang packages
sudo apt-get install -y erlang-base \
                        erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
                        erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
                        erlang-runtime-tools erlang-snmp erlang-ssl \
                        erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl

## Install rabbitmq-server and its dependencies
sudo apt-get install rabbitmq-server -y --fix-missing
echo "Installed RabbitMQ successfully"
}

if $IS_BIG_SERVER;
then
  installRabbitMQ
else
  read -p "Would you like to install RabbitMQ on your server (y/n)?" choice
  case "$choice" in 
    y|Y )
    installRabbitMQ
      ;;

    n|N ) echo "Using http for service communications";;
    * ) echo "invalid";;
  esac
fi

# MongoDB
echo "Installing MongoDB"
# MongoDB version 3.6+
# Latest MongoDB version https://www.mongodb.org/static/pgp/ 
# https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list
apt-get -qqy update
apt-get install -y mongodb-org
echo "Installed MongoDB 4.2 successfully"
echo "Enabling and starting MongoDB..."
systemctl enable mongod
systemctl start mongod
echo "MongoDB enabled and started successfully"

# Nginx
echo "Installing Nginx"
apt-get -qqy install -y nginx
echo "Installed Nginx successfully"

## setting up ufw firewall
echo 'y' | ufw enable
ufw allow 22
ufw allow 80
ufw allow 443

# install certbot
echo "Installing Certbot"
apt-get update
apt install certbot python3-certbot-nginx
echo "Installed Certbot successfully"

# username that saashq will be installed in
echo "Creating a new user called 'saashq' for you to use with your server."
username=saashq

# create a new user saashq if it does not exist
id -u saashq &>/dev/null || useradd -m -s /bin/bash -U -G sudo $username

# saashq directory
saashq_root_dir=/home/$username/saashq.org

su $username -c "mkdir -p $saashq_root_dir"
cd $saashq_root_dir

MONGO_PASS=$(openssl rand -hex 16)

# set mongod password
result=$(mongo --eval "db=db.getSiblingDB('admin'); db.createUser({ user: 'saashq', pwd: \"$MONGO_PASS\", roles: [ 'root' ] })" )
echo $result

# set up mongod ReplicaSet
systemctl stop mongod
mv /etc/mongod.conf /etc/mongod.conf.bak
cat<<EOF >/etc/mongod.conf
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
net:
  bindIp: localhost
processManagement:
  timeZoneInfo: /usr/share/zoneinfo
replication:
  replSetName: "rs0"
security:
  authorization: enabled
EOF
systemctl start mongod

echo "Starting MongoDB..."
curl https://raw.githubusercontent.com/vishnubob/wait-for-it/main/wait-for-it.sh > /usr/local/bin/wait-for-it.sh
chmod +x /usr/local/bin/wait-for-it.sh
/usr/local/bin/wait-for-it.sh --timeout=0 localhost:27017
while true; do
    healt=$(mongo --eval "db=db.getSiblingDB('admin'); db.auth('saashq', \"$MONGO_PASS\"); rs.initiate().ok" --quiet)
    if [ $healt -eq 0 ]; then
        break
    fi
done
echo "Started MongoDB ReplicaSet successfully"

# install nvm and install node using nvm
su $username -c "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash"
su $username -c "source ~/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && npm install -g yarn pm2"

# make pm2 starts on boot
env PATH=$PATH:/home/$username/.nvm/versions/node/$NODE_VERSION/bin pm2 startup -u $username --hp /home/$username
systemctl enable pm2-$username

MONGO_URL="mongodb://saashq:$MONGO_PASS@localhost/saashq?authSource=admin\&replicaSet=rs0"

sourceCommand="source ~/.nvm/nvm.sh && nvm use $NODE_VERSION && export MONGO_URL=$MONGO_URL"
su $username -c "$sourceCommand && yarn create saashq-app saashq --quickStart --domain=$saashq_domain --mongoUrl=\"$MONGO_URL\" --elasticsearchUrl=$ELASTICSEARCH_URL --redisHost=$REDIS_HOST --rabbitmqHost=$RABBITMQ_HOST --elkSyncer=$ELK_SYNCER"
cd saashq
su $username -c "$sourceCommand && yarn start"
cp nginx.conf /etc/nginx/sites-enabled/saashq.conf

nginx -t

# reload nginx service
systemctl reload nginx

if $IS_ENABLED_TELEMETRY; then
  su $username -c "$sourceCommand && cd $saashq_root_dir/saashq/build/api && node ./commands/trackTelemetry \"success\""
fi

su $username -c "$sourceCommand && cd $saashq_root_dir/saashq/build/api && node ./commands/loadInitialData"
su $username -c "$sourceCommand && cd $saashq_root_dir/saashq/build/api && node ./commands/loadInitialData growthHack"

certbot --nginx --agree-tos -d $saashq_domain --redirect --register-unsafely-without-email