# DB-KDE-Widget

DB-KDE-Widget is a modern widget for KDE Plasma that displays the timetable of a chosen train connection of Deutsche Bahn trains. You can specify the departure and arrival station and it shows you realtime information of times and potential delays.

## Development

### Run vite development server

`npm install`

`npm run dev`

### DB API docker-container

`docker run -d -p 3000:3000 docker.io/derhuerst/db-rest:6`

### Package

`zip -r ../me.oskarkraemer.dbkdewidget.plasmoid .`

## Installation

Run inside the `/me.oskarkraemer.dbkdewidget` directory:

`kpackagetool6 --type Plasma/Applet --install .`
