var td = require('testdouble');

afterEach(function() {
    td.reset();
    console.log('before every test in every file');
});