'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Request = require('request-promise');
const Boom = require('boom');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

server.route({
    method: 'GET',
    path: '/latlong/{address}',
    handler: (request, reply) => {

        var options = {
            url: 'http://localhost:3001/latlongByAddress/' + encodeURIComponent(request.params.address),
            method: 'GET',

        };

        Request(options)
        .then((response) => {

            reply(response).header('content-type', 'application/json');
        })
        .catch((err) => {

            console.warn('ERROR:', err);
            reply(Boom.wrap(err, 500));
        });
    }
});

server.route({
    method: 'GET',
    path: '/weather/{lat}/{long}/{startDate}',
    handler: (request, reply) => {


        var options = {
            url: 'http://localhost:3002/weatherByLatLongAndDate/' +
            encodeURIComponent(request.params.lat) + '/' +
            encodeURIComponent(request.params.long) + '/' +
            encodeURIComponent(request.params.startDate),
            method: 'GET',

        };

        Request(options)
        .then((response) => {

            reply(response).header('content-type', 'application/json');
        })
        .catch((err) => {

            console.warn('ERROR:', err);
            reply(Boom.wrap(err, 500));
        });
    }
});

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
