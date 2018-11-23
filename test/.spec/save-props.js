'use strict';

module.exports = (obj, names) => {
    const store = {};
    
    for (const name of names) {
        store[name] = obj[name];
    };
    
    return () => {
        for (const name of names) {
            obj[name] = store[name];
        };
    };
};

