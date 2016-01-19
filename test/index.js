// switch environment to testing
process.env.NODE_ENV = 'testing';


// Shouldn't display the notifier's output during tests
process.env.DISABLE_NOTIFIER = 'true';


// setup chai promise library
const chai = require('chai');
chai.should();
