// Server configuration

const templateWithImage = `<template>
<img src="/image.svg" />
</template>`;
const svg = `svg version="1.1"
baseProfile="full"
width="300" height="200"
xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="red" />
<circle cx="150" cy="100" r="80" fill="green" />
<text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
</svg>`;

const express = require('express');
const app = express();

app.get('/', function (req, res) {
    console.log('Server: HTML requested');
    res.send(templateWithImage);
});

app.get('/image.svg', function (req, res) {
    console.log('Server: image requested');
    res.send(svg);
});

// jsdom API tests

function newApi() {
    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    console.log('---------------');
    console.log('Testing new API\n');

    JSDOM.fromURL('http://localhost:3000', {
        resources: 'usable'
    });
}

function oldApi() {
    const oldApi = require('jsdom/lib/old-api.js');
    console.log('---------------');
    console.log('Testing old API\n');

    oldApi.env('http://localhost:3000', {
        resourceLoader: function (resource, callback) {
            console.log(`jsdom resource loader: ${resource.url.href}`);
            return resource.defaultFetch(callback);
        },
        features: {
            FetchExternalResources: ["img"],
            SkipExternalResources: false
        },
        done: function (err, window) {
            newApi();
        }
    });

}

app.listen(3000, oldApi);