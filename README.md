# Microservice for handling users over AMQP transport layer

## Installation

`npm i ms-payments -S`

## Overview

Starts horizontally scalable nodejs worker communicating over amqp layer with redis cluster backend.
Supports a broad range of operations for working with payments. Please refer to the configuration options for now,
that contains description of routes and their capabilities.

## Configuration

```js
const Users = require('ms-payments');

// all the opts listed here are set by defaults
const defaultOpts = {
  debug: process.env.NODE_ENV === 'development',
  // listens to routes on prefix.postfix
  prefix: 'users',
  // keep inactive accounts for 30 days
  deleteInactiveAccounts: 30 * 24 * 60 * 60,
  // postfixes for routes that we support
  postfix: {
    // ban, supports both unban/ban actions
    ban: 'ban',

    // challenge. Challenge sends email with a token that is used to activate account
    // often used internally from 'register' method
    challenge: 'challenge',

    // verifies it and activates not banned account
    activate: 'activate',

    // verify token and return metadata
    verify: 'verify',

    // verify credentials and return metadata
    login: 'login',

    // verify token and destroy it
    logout: 'logout',

    // creates new user
    // sends 'challenge', or, if this options is not set, immediately registers user
    // in the future multiple challenge options could be supported, for now it's just an email
    register: 'register',

    // pass metadata out based on username
    // core data only contains username and hashed password
    // this is an application specific part that can store anything here
    getMetadata: 'getMetadata',

    // update metadata based on username
    // rewrites/adds new data, includes both set and remove methods, set overwrites,
    // while remove - deletes. Set precedes over remove and batch updates are supported
    updateMetadata: 'updateMetadata',

    // requests an email to change password
    // can be extended in the future to support more options like secret questions
    // or text messages
    requestPassword: 'requestPassword',

    // updates password - either without any checks or, if challenge token is passed, makes sure it's correct
    updatePassword: 'updatePassword',
  },
  // ms-amqp-transport settings, do not specify listen, will be overwritten
  amqp: {
    queue: 'ms-payments',
  },
  // google recaptcha settings
  captcha: {
    secret: 'put-your-real-gcaptcha-secret-here',
    ttl: 3600, // 1 hour - 3600 seconds
    uri: 'https://www.google.com/recaptcha/api/siteverify',
  },
  // ioredis options, uses redis.Cluster
  redis: {
    options: {
      keyPrefix: '{ms-payments}',
    },
  },
  // json web token settings
  jwt: {
    defaultAudience: '*.localhost',
    hashingFunction: 'HS256',
    issuer: 'ms-payments',
    secret: 'i-hope-that-you-change-this-long-default-secret-in-your-app',
    ttl: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    lockAfterAttempts: 5,
    keepLoginAttempts: 60 * 60, // 1 hour
  },
  // account validation settings
  validation: {
    secret: 'please-replace-this-as-a-long-nice-secret',
    algorithm: 'aes-256-ctr',
    throttle: 2 * 60 * 60, // dont send emails more than once in 2 hours
    ttl: 4 * 60 * 60, // do not let password to be reset with expired codes
    paths: {
      activate: '/activate',
      reset: '/reset',
    },
    subjects: {
      activate: 'Activate your account',
      reset: 'Reset your password',
    },
    email: 'support@example.com',
  },
  // http server settings, that serves api
  server: {
    proto: 'http',
    host: 'localhost',
    port: 8080,
  },
  // ms-mailer-client settings
  mailer: {
    prefix: 'mailer',
    routes: {
      adhoc: 'adhoc',
      predefined: 'predefined',
    },
  },
};

const usersService = new Users(defaultOpts);
```

## Roadmap

1. Add extra features to registration:
 - [ ] limit registrations per ip per time span
 - [ ] reject known disposable email addresses
 - [ ] add text message validation
 - [ ] add ability to change username
2. Abstract storage options:
 - [ ] create abstract storage class
 - [ ] move interactions with redis to an abstract class
 - [ ] write docs about adding more storage options
3. Test coverage
4. Extra features for challenge:
 - [ ] be able to set metadata on request
 - [ ] record ip address for such a request
 - [ ] extra types of validation
5. Update Metadata:
 - [ ] Add/remove batch operations
 - [ ] support operations on multiple audiences
6. Ban:
 - [ ] Add security log
7. Dockerfile
8. Search/filter/sort:
 - [ ] sort by metadata field
 - [ ] filter by metadata field
 - [ ] filter by multiple metadata fields
 - [ ] paginate
