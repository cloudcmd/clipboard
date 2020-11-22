'use strict';

const tryToCatch = require('try-to-catch');
const {reRequire} = require('mock-require');

const autoGlobals = require('auto-globals');
const {create} = autoGlobals;
const tape = require('supertape');
const test = autoGlobals(tape);

test('clipboard: readText: original', (t, {navigator}) => {
    const {readText} = navigator.clipboard;
    const clipboard = reRequire('../lib/clipboard');
    
    clipboard.readText('hello');
    global.navigator = navigator;
    
    t.ok(readText.calledWith('hello'), 'should call original readText');
    t.end();
});

test('clipboard: writeText: original', (t, {navigator}) => {
    const {writeText} = navigator.clipboard;
    const clipboard = reRequire('../lib/clipboard');
    
    clipboard.writeText('hello');
    
    t.ok(writeText.calledWith('hello'), 'should call original readText');
    t.end();
});

test('clipboard: readText', (t) => {
    const {navigator} = global;
    global.navigator = {};
    
    const clipboard = reRequire('../lib/clipboard');
    
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

test('clipboard: writeText: createElement', async (t, {document}) => {
    global.navigator = {};
    
    const el = create();
    
    const {createElement} = document;
    createElement.returns(el);
    
    const {writeText} = reRequire('../lib/clipboard');
    const value = 'hello';
    await tryToCatch(writeText, value);
    
    t.ok(createElement.calledWith('textarea'), 'should call createElement');
    t.end();
});

test('clipboard: writeText: appendChild', async (t, {document}) => {
    global.navigator = {};
    
    const value = 'hello';
    const el = {
        ...create(),
        value,
    };
    
    const {
        body,
        createElement,
    } = document;
    
    const {appendChild} = body;
    
    createElement.returns(el);
    
    const {writeText} = reRequire('../lib/clipboard');
    await tryToCatch(writeText, value);
    
    t.ok(appendChild.calledWith(el), 'should call appendChild');
    t.end();
});

test('clipboard: writeText: select', async (t, {document}) => {
    global.navigator = {};
    
    const el = create();
    
    const {
        createElement,
        execCommand,
    } = document;
    
    createElement.returns(el);
    execCommand.returns(true);
    
    const {writeText} = reRequire('../lib/clipboard');
    const value = 'hello';
    await tryToCatch(writeText, value);
    
    t.ok(el.select.calledWith(), 'should call el.select()');
    t.end();
});

test('clipboard: writeText: execCommand', async (t, {document}) => {
    global.navigator = {};
    
    const {execCommand} = document;
    execCommand.returns(true);
    
    const {writeText} = reRequire('../lib/clipboard');
    const value = 'hello';
    await writeText(value);
    
    t.ok(execCommand.calledWith('copy'), 'should call execCommand');
    t.end();
});

test('clipboard: writeText: removeChild', async (t, {document}) => {
    global.navigator = {};
    
    const value = 'hello';
    const el = create();
    
    const {
        createElement,
        execCommand,
        body,
    } = document;
    
    const {removeChild} = body;
    
    createElement.returns(el);
    execCommand.returns(true);
    
    const {writeText} = reRequire('../lib/clipboard');
    await writeText(value);
    
    t.ok(removeChild.calledWith(el), 'should call removeChild');
    t.end();
});

test('clipboard: writeText: reject', async (t, {document}) => {
    global.navigator = {};
    
    const {execCommand} = document;
    
    execCommand.returns(false);
    
    const {writeText} = reRequire('../lib/clipboard');
    const value = 'hello';
    try {
        await writeText(value);
        t.fail('should not resolve');
    } catch {
        t.pass('should reject');
    }
    
    t.end();
});

