

    const setttl = require('./index');

    // Create cache with a TTL of 500ms
    let cache = new setttl(500);

    // Add a value to the set, TTL is not specified so the default is used.
    cache.add('test 1');

    // Check the contents of "test 1" after 250ms
    setTimeout( ()=> {
        console.log('Should be true: ', cache.has('test 1'));
        cache.extend('test 1', 300); //Extends cached value TTL by 300ms
    }, 250)

    // Check the contents of "test 1" after 450ms
    // Item should still exists, cause it was extended at 250ms
    setTimeout( ()=> {
        console.log('Should be true: ', cache.has('test 1'));
    }, 450)

    // Check the contents of "test 1" after 600ms
    // Item should still exists, cause it was extended at 250ms
    setTimeout( ()=> {
        console.log('Should be true: ', cache.has('test 1'));
    }, 600)

    // Now a second has passed and the 500+300ms TTL should have passed.
    setTimeout( ()=> {
        console.log('Should be false: ', cache.has('test 1'));
    }, 1000)
