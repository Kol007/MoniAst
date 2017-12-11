# MoniAst

[![GitHub release](https://img.shields.io/github/release/Kol007/MoniAst.svg)](https://github.com/Kol007/MoniAst/releases)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/df6ee9e8cbf34393b728f3640449210b)](https://www.codacy.com/app/nromankevich/MoniAst?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Kol007/MoniAst&amp;utm_campaign=Badge_Grade)
[![Join the chat at https://gitter.im/MoniAst/Lobby](https://badges.gitter.im/MoniAst/Lobby.svg)](https://gitter.im/MoniAst/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Features:
- See who is available or not
- See agent status
- Real-time monitoring state of agents and trunks
- Listening to current calls (spy)
- Prompter (whisper)

![Demo](https://raw.githubusercontent.com/Kol007/barber/master/2017-12-09_13-41-50.png)

- [Requirements](#requirements)
- [Install](#install)
- [Start application](#start-application)
- [WebServer config example](#nginx-example)

## Requirements

Can run on virtually all platforms where Node.js can (Windows, Mac, Linux, etc.).

- Node.js
- MongoDB

## Install

git clone https://github.com/Kol007/MoniAst.git

cd MoniAst

npm install

rename config.example.js -> config.js

Create manager in asterisk for MoniAst or use exist 
```
#/etc/asterisk/manager.conf
[general]
enabled = yes
port = 5038
bindaddr = 0.0.0.0
displayconnects=no ;only effects 1.6+

[managerLogin]
secret = superPassword
deny=0.0.0.0/0.0.0.0
permit=127.0.0.1/255.255.255.0
read = system,call,log,verbose,command,agent,user,config,dtmf,reporting,cdr,dialplan,originate,message
write = system,call,log,verbose,command,agent,user,config,dtmf,reporting,cdr,dialplan,originate,message

```

Fill config.js with you Config data (AMI user, MongoDB url, fill secret)
```js
module.exports = {
  'secret': 'Super Secret String',
  'database': 'mongodb://localhost:27017/MoniAst',
  'port': process.env.PORT || 3001,
  
  AMI: {
    port: 5038,
    ip: '127.0.0.1',
    login: 'managerLogin',
    pass: 'superPassword'
  }
};


```
## Start application

node index.js

or with pm2: pm2 start ecosystem.config.js --env production

Application will start on 127.0.0.1:3001

Default login/password admin/admin

### Nginx example
Simple on 80 port:
 ```nginx
 server {
     listen 80;
     server_name moniast.domain.com;
 
     access_log  /var/log/nginx/moniast.access.log;
     error_log  /var/log/nginx/moniast.error.log;
      
     location / {
        proxy_pass http://127.0.0.1:3001/;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
     }
 }
 ```
 or secure on 443 port:
 [Gist for gzip and ssl](https://gist.github.com/Kol007/8dfac7b2a06a0ffa637954cc1ad563c5)
```nginx
server {
    listen 80;
    server_name moniast.domain.com;

    return 301 https://moniast.domain.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name  moniast.domain.com;

    access_log  /var/log/nginx/moniast.access.log;
    error_log  /var/log/nginx/moniast.error.log;

###############################
    ssl_trusted_certificate /etc/ssl/nginx.bundle;
    include snippets/gzip.conf; # gzip enable
    include snippets/ssl_sep.conf; # ssl config
###############################
    ssl_certificate /etc/ssl/nginx.bundle;
    ssl_certificate_key /etc/ssl/ssl.key;

    location / {
      proxy_pass http://127.0.0.1:3001/;
      proxy_set_header   X-Real-IP $remote_addr;
      proxy_set_header   Host $http_host;
      proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
    }
}
```





