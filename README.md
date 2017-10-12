# This is a project in three parts

* An Angular 4 front end assembled with angular cli

* An Express server

* A terminal application 

# Description
The front end uses xterm.js to serve up a terminal

this connects via a websocket to the express server

The server conects via a pseudo tty to a node app called sash (Swiss Army Shell)

This shell is based on [commander.js](https://www.npmjs.com/package/commander) which provides 
an easily extensible mechanism to do CLI

Currently the commands implemented are
* `docker ps`
* `docker exec <container|name> <command>`

## Docker
I built this to do a `docker exec` without having access to the docker host so it will run as a [docker container](https://hub.docker.com/r/jeremymarshall/angular4-express-dist/)

Simply run `docker run -d -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock jeremymarshall/angular4-express-dist` and connect to it on port 3000

**There is a security risk as this exposes the docker daemon and you can exec to the container running the service. But this is a proof of concept**

## CI
The CI is a bit hand cranked at the moment

## TODO
1. Do the CI
1. Command History
1. More commands
  * docker
  * docker compose
  * marathon/mesos
  * haproxy?
  * ssh?
1. integrate colour
1. Log commands to a database - what about passwords?)

## Please fork and raise PRs
