'use strict';

const timestamp = require('../lib/middleware/timestamp');
const logger = require('../lib/middleware/logger.js');
const fourOhFour = require('../lib/middleware/404');
const fiveHundred = require('../lib/middleware/500.js');

const req = {};
const res = {};

console.log = jest.fn();

const res404 = {
  send: function (msg) {
    expect(msg).toEqual('route not supported');
  },
  status: function (num) {
    expect(num).toEqual(404);
    // Calling this to be chainable
    return this;
  },
};

const fakeErrorMsg = 'fake error';
const res500 = {
  json: function (error) {
    expect(error.text).toEqual('Server crashed!');
    expect(error.error).toEqual(fakeErrorMsg);
  },
  status: function (num) {
    expect(num).toEqual(500);
    // Calling this to be chainable
    return this;
  },
};

const next = jest.fn();
jest.spyOn(global.console, 'log');

describe('404 middleware', () => {
  it('works', () => {
    fourOhFour(req, res404, next);
  });
});

describe('500 middleware', () => {
  it('works', () => {
    fiveHundred(fakeErrorMsg, req, res500, next);
  });
});

describe('timestamp middleware', () => {
  it('works', () => {
    timestamp(req, res, next);
    expect(!!req.requestTime).toEqual(true);
    expect(next).toHaveBeenCalled();
  });
});

describe('logger middleware', () => {
  it('works', () => {
    logger(req, res, next);
    expect(console.log).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
