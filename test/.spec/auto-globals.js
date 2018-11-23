'use strict';

const stub = require('@cloudcmd/stub');
const currify = require('currify');

const saveProps = require('./save-props');

const unsetGlobals = saveProps(global, [
    'document',
    'FormData',
    'URLSearchParams',
    'fetch',
    'navigator',
]);

function create() {
    return {
        dataset: {},
        appendChild: stub(),
        removeChild: stub(),
        addEventListener: stub(),
        removeEventListener: stub(),
        select: stub(),
        setAttribute: stub(),
        style: {},
    };
};

function setGlobals() {
    const document = getDocument();
    const fetch = getFetch();
    const FormData = getFormData()
    const URLSearchParams = getURLSearchParams();
    const navigator = getNavigator();
    
    Object.assign(global, {
        document,
        fetch,
        FormData,
        URLSearchParams,
        navigator,
    });
    
    return {
        document,
        fetch,
        FormData,
        URLSearchParams,
        navigator,
    };
};

function getDocument() {
    const body = {
        ...create(),
    }
    
    return {
        body,
        createElement: stub(),
        querySelector: stub(),
        createElement: stub(create),
        execCommand: stub(),
    };
}

function getFormData() {
    const entries = stub()
        .returns([]);
    
    const FormData = stub()
        .returns({
            entries
        });
    
    const constructor = function(...args) {
        return FormData(...args);
    };
    
    return constructor;
}

function getFetch() {
    return stub();
}

function getURLSearchParams() {
    const append = stub();
    
    return stub()
        .returns({
            append,
        });
}

function getNavigator() {
    const readText = stub();
    const writeText = stub();
    
    return {
        clipboard: {
            readText,
            writeText,
        }
    };
}

const autoGlobals = currify(async (f, t) => {
    await f(t, setGlobals());
    unsetGlobals();
});

const set = currify((wrapper, tape, str, promise) => {
    return tape(str, wrapper(promise));
});

function tapify(tape, f) {
    const fn = set(f, tape);
    fn.only = set(f, tape.only);
    
    return fn;
};

module.exports = (tape) => {
    return tapify(tape, autoGlobals);
};

module.exports.create = create;

