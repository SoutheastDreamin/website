(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
document.addEventListener('DOMContentLoaded', function () {
    const activeClass = 'scrollspy__display_active';
    const sections = document.querySelectorAll('.scrollspy__section');
    const headers = document.querySelectorAll('.scrollspy__display');

    /**
     * Makes a section active
     * @param {Integer} index The index of the section header
     * @returns {undefined}
     */
    const makeActive = (index) => {
        if (index < headers.length) {
            headers[index].classList.add(activeClass);
        }
    };

    /**
     * Makes a section inactive
     * @param {Integer} index The index of the section header
     * @returns {undefined}
     */
    const removeActive = (index) => headers[index].classList.remove(activeClass);

    /**
     * Makes all sections inactive
     * @returns {undefined}
     */
    const removeAllActive = () => [ ...Array(sections.length).keys() ].forEach((link) => removeActive(link));

    const sectionMargin = -30;
    let currentActive = 0;

    window.addEventListener('scroll', () => {
        const current = sections.length - [ ...sections ].reverse().findIndex((section) => window.scrollY >= section.offsetTop - sectionMargin ) - 1;

        if (current !== currentActive) {
            removeAllActive();
            currentActive = current;
            makeActive(current);
        }
    });
}, false);
},{}]},{},[1]);
