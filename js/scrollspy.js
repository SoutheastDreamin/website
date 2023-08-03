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