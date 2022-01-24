const SetTTL = require('set-ttl');

// Create cache with a TTL of 500ms
let cache = new SetTTL(500);

// Add a value to the set, TTL is not specified so the default is used.
cache.add('example');

// Check the contents of "example" after 250ms
setTimeout( ()=> {
	console.log('Should be true: ', cache.has('example'));
	cache.extend('example', 300); //Extends cached value TTL by 300ms
}, 250)

// After 1 second, the TTL should have expired and the item doesn't exist anymore
setTimeout( ()=> {
	console.log('Should be false: ', cache.has('example'));
}, 1000)