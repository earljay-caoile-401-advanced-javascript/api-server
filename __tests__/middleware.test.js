'use strict';

const timestamp = require('../lib/middleware/timestamp');
const logger = require('../lib/middleware/logger.js');
const fourOhFour = require('../lib/middleware/404');
const fiveHundred = require('../lib/middleware/500.js');
const mockAuth = require('../lib/middleware/mock-auth.js');

let req = {};
let res = {};

console.log = jest.fn();

beforeEach(() => {
  res = {};
  req = {};
});

const res404 = {
  send: function(msg) {
    expect(msg).toEqual('route not supported');
  },
  status: function(num) {
    expect(num).toEqual(404);
    // Calling this to be chainable
    return this;
  },
};

const fakeErrorMsg = 'fake error';
const res500 = {
  json: function(error) {
    expect(error.text).toEqual('Server crashed!');
    expect(error.error).toEqual(fakeErrorMsg);
  },
  status: function(num) {
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

describe('mock-auth middleware', () => {
  beforeEach(() => {
    req.params = {};
  });

  it('works', () => {
    req.params.authenticated = true;
    mockAuth(req, res, next);
    expect(console.log).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('works without params.authenticated assignment', () => {
    mockAuth(req, res, next);
    expect(console.log).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('throws', () => {
    req.params.authenticated = false;
    expect(() => mockAuth(req, res, next)).toThrow();
  });
});
