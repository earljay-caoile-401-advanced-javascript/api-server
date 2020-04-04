'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../lib/server.js');
const agent = supergoose(server.apiServer);
console.log = jest.fn();

describe('server', () => {
  it('will console log on start', () => {
    jest.spyOn(global.console, 'log');
    server.apiServer.listen = jest.fn((port) => {
      console.log('running on', port);
    });
    server.start(3000);
    expect(console.log).toHaveBeenCalled();
  });
});

describe('model finder', () => {
  it('will return an error for an invalid model', async () => {
    const getRes = await agent.get('/api/v1/dumplings');
    expect(getRes.statusCode).toBe(500);
  });
});
