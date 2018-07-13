'use strict';

module.exports = navigator.clipboard || {
    readText,
    writeText,
};

function readText() {
    return Promise.reject();
}

function writeText(value) {
    const el = document.createElement('textarea');
    
    el.hidden = true;
    el.style.cssText = `
        opacity: 0;
        position: fixed;
        top: 50%;
    `;
    
    document.body.appendChild(el);
    el.select();
    
    const is = document.execCommand('copy');
    document.body.removeChild(el);
    
    if (is)
        return Promise.resolve();
     
    return Promise.reject();
}

