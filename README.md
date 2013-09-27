# Angular Hapi Couch

This is an example application that uses Angular.js, the node.js based web and API server Hapi and CouchDB for storage. It make heavy use of the cores-ng library created by [Till Reitemeyer] (https://github.com/skoni), but with architecture geared towards a future project I have in mind. It includes a single Users schema and supports basic CRUD operations. You can also load sample users into CouchDB from the home page.

I created this application to learn how the following components work together:

1. [Angular.js](http://angularjs.org/) - front-end framework 
2. [Bootstrap](http://getbootstrap.com/) - css & layouts 
3. [Hapi.js](http://spumko.github.io/) - node.js based API and web server 
4. [CouchDB](http://couchdb.apache.org/) - storage 


In terms of connecting all this together, [Till Reitemeyer] (https://github.com/skoni) has already provided the beginnings of a workable framework, including:

1. [cores-server] (https://github.com/skoni/cores-server) - bootstrap for hapi server
2. [cores-ng] (https://github.com/skoni/cores-ng) - angular.js cores layer
3. [cores-hapi] (https://github.com/skoni/cores-hapi) - hapi cores resource api
4. [cores] (https://github.com/skoni/cores) - couchdb resource layer with validationr

Note: the above libraries appear to be very much under development and there is documentation yet.

## Prerequisites

1. CouchDB (port 5984)

## Installation

Clone the repository locally.

```
cd angular-hapi-couch
npm install
bower install
```

Note: you may need to run `sudo npm install`.

## To run

Create the database:

```
grunt db
```

Build (various tasks including compiling templates, jade files, combining the cores-ng files):

```
grunt
```
Start the web server:

```
grunt server
```

Browse to: [http://localhost:8080] (http://localhost:8080)

## Known Issues

This sample application is quite incomplete and is being refactored constantly to incorporate changes and new developments in the various cores libraries. The following are what I know are incomplete/buggy:

 - No thoughts have been given to security yet, i.e. restricting actions via the API.
 - Pagination in Users page - no ability to navigate to pages directly (maybe need to use offsets?).
 - Create/edit forms show validation before record is dirty (still works, just unsightly IMO).
 - Incomplete support for inut type validations, e.g. I have added a hack for email, but other formats are not yet supported.
 - Not all directive templates have been converted fully to Bootstrap 3, i.e. I have only converted some model templates and String and Number.
 
## Endnotes

I am very much a begginer when it comes to node, angular.js, hapi.js and couchDB - so there are no doubt fundamental mistakes in the way I have approached things. This is very much a learning exercise for me.

A big thank you to Till for his work in this space - it is appreciated (well, at least by one person :)