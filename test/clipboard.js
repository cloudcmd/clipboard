'use strict';

const test = require('tape');
const diff = require('sinon-called-with-diff');
const sinon = diff(require('sinon'));
const tryToCatch = require('try-to-catch');

test('clipboard: readText: original', (t) => {
    const {navigator} = global;
    const readText = sinon.stub();
    
    global.navigator = {
        clipboard: {
            readText,
        }
    };
    
    const clipboard = rerequire('../lib/clipboard');
    
    clipboard.readText('hello');
    
    t.ok(readText.calledWith('hello'), 'should call original readText');
    
    global.navigator = navigator;
    t.end();
});

test('clipboard: writeText: original', (t) => {
    const {navigator} = global;
    const writeText = sinon.stub();
    
    global.navigator = {
        clipboard: {
            writeText
        }
    };
    
    const clipboard = rerequire('../lib/clipboard');
    
    clipboard.writeText('hello');
    
    global.navigator = navigator;
    
    t.ok(writeText.calledWith('hello'), 'should call original readText');
    t.end();
});

test('clipboard: readText', (t) => {
    const {navigator} = global;
    global.navigator = {};
    
    const clipboard = rerequire('../lib/clipboard');
    
    const end = () => {
        global.navigator = navigator;
        t.end();
    };
    const pass = t.pass.bind(t, 'should reject');
    
    clipboard
        .readText()
        .catch(pass)
        .then(end);
});

test('clipboard: writeText: createElement', async (t) => {
    const {
        navigator,
        document,
    } = global;
    
    global.navigator = {};
    
    const el = {
        select: sinon.stub(),
        setAttribute: sinon.stub(),
    };
    
    const createElement = sinon.stub().returns(el);
    global.document = createDocument({
        createElement
    });
    
    const {writeText} = rerequire('../lib/clipboard');
    const value = 'hello';
    await tryToCatch(writeText, value);
    
    t.ok(createElement.calledWith('textarea'), 'should call createElement');
    
    global.navigator = navigator;
    global.document = document;
    t.end();
});

test('clipboard: writeText: appendChild', async (t) => {
    const {
        navigator,
        document,
    } = global;
    
    global.navigator = {};
    
    const el = {
        select: sinon.stub(),
        setAttribute: sinon.stub(),
    };
    
    const appendChild = sinon.stub();
    const createElement = sinon.stub().returns(el);
    global.document = createDocument({
        createElement,
        appendChild,
    });
    
    const {writeText} = rerequire('../lib/clipboard');
    const value = 'hello';
    await tryToCatch(writeText, value);
    
    t.ok(appendChild.calledWith(el), 'should call appendChild');
    
    global.navigator = navigator;
    global.document = document;
    t.end();
});

test('clipboard: writeText: select', async (t) => {
    const {
        navigator,
        document,
    } = global;
    
    global.navigator = {};
    
    const el = {
        select: sinon.stub(),
        setAttribute: sinon.stub(),
    };
    
    const createElement = sinon.stub().returns(el);
    global.document = createDocument({
        createElement
    });
    
    const {writeText} = rerequire('../lib/clipboard');
    const value = 'hello';
    await tryToCatch(writeText, value);
    
    t.ok(el.select.calledWith(), 'should call el.select()');
    
    global.navigator = navigator;
    global.document = document;
    t.end();
});

test('clipboard: writeText: execCommand', async (t) => {
    const {
        navigator,
        document,
    } = global;
    
    global.navigator = {};
    
    const execCommand = sinon.stub().returns(true);
    global.document = createDocument({
        execCommand,
    });
    
    const {writeText} = rerequire('../lib/clipboard');
    const value = 'hello';
    await writeText(value);
    
    t.ok(execCommand.calledWith('copy'), 'should call execCommand');
    
    global.navigator = navigator;
    global.document = document;
    t.end();
});

test('clipboard: writeText: removeChild', async (t) => {
    const {
        navigator,
        document,
    } = global;
    
    global.navigator = {};
    
    const el = {
        select: sinon.stub(),
        setAttribute: sinon.stub(),
    };
    
    const createElement = sinon.stub().returns(el);
    const removeChild = sinon.stub();
    global.document = createDocument({
        removeChild,
        createElement,
    });
    
    const {writeText} = rerequire('../lib/clipboard');
    const value = 'hello';
    await writeText(value);
    
    t.ok(removeChild.calledWith(el), 'should call removeChild');
    
    global.navigator = navigator;
    global.document = document;
    
    t.end();
});

test('clipboard: writeText: setAttribute', async (t) => {
    const {
        navigator,
        document,
    } = global;
    
    global.navigator = {};
    
    const setAttribute = sinon.stub();
    
    const el = {
        select: sinon.stub(),
        setAttribute,
    };
    
    const createElement = sinon.stub().returns(el);
    global.document = createDocument({
        createElement,
    });
    
    const {writeText} = rerequire('../lib/clipboard');
    const value = 'hello';
    await writeText(value);
    
    t.ok(setAttribute.calledWith('aria-hidden', 'true'), 'should call setAttribute');
    
    global.navigator = navigator;
    global.document = document;
    
    t.end();
});

test('clipboard: writeText: hidden', async (t) => {
    const {
        navigator,
        document,
    } = global;
    
    global.navigator = {};
    
    const el = {
        select: sinon.stub(),
        setAttribute: sinon.stub(),
    };
    
    const createElement = sinon.stub().returns(el);
    global.document = createDocument({
        createElement,
    });
    
    const {writeText} = rerequire('../lib/clipboard');
    const value = 'hello';
    await writeText(value);
    
    t.ok(el.hidden, 'should set element.hidden');
    
    global.navigator = navigator;
    global.document = document;
    
    t.end();
});

test('clipboard: writeText: reject', async (t) => {
    const {
        navigator,
        document,
    } = global;
    
    global.navigator = {};
    
    const execCommand = sinon.stub().returns(false);
    global.document = createDocument({
        execCommand,
    });
    
    const {writeText} = rerequire('../lib/clipboard');
    const value = 'hello';
    try {
        await writeText(value);
        t.fail('should not resolve');
    } catch(e) {
        t.pass('should reject');
    }
    
    global.navigator = navigator;
    global.document = document;
    
    t.end();
});

function createDocument({createElement, execCommand, removeChild, appendChild} = {}) {
    const el = {
        select: sinon.stub(),
        setAttribute: sinon.stub(),
    };
    
    createElement = createElement || sinon.stub().returns(el);
    execCommand = execCommand || sinon.stub().returns(true);
    removeChild = removeChild || sinon.stub();
    appendChild = appendChild || sinon.stub();
    
    const body = {
        appendChild,
        removeChild,
    };
    
    return {
        body,
        createElement,
        execCommand,
    };
}

function rerequire(name) {
    delete require.cache[require.resolve(name)];
    return require(name);
}

