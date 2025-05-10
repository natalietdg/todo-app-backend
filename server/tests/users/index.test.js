process.env.NODE_ENV = 'test';
const _ = require('lodash');
const url = require('url');
const request = require('../util/httpRequests.js');
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const getBody = response => response.body;

describe("Test user routes", () => {
    it("the user api responds to a POST with the user which was posted to it", async () => {
        const starting = {
            "name": "Samantha",
            "status": "active"
        }
        const getRoot = await request.post('/user', starting).then(getBody);
        expect(getRoot).toMatchObject(expect.objectContaining(starting));

    });

})