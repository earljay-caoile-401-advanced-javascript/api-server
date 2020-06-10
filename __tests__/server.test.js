'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../lib/server.js');
supergoose(server.apiServer);
console.log = jest.fn();

describe('server', () => {
  it('will console log on start', () => {
    jest.spyOn(global.console, 'log');
    server.apiServer.listen = jest.fn(port => {
      console.log('running on', port);
    });
    server.start(3000);
    expect(console.log).toHaveBeenCalled();
  });
});
