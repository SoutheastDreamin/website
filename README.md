# Southeast Dreamin' Website

This repository hosts the website for [Southeast Dreamin'](https://southeastdreamin.com) using [Github Pages](https://pages.github.com/) serving out the [gh-pages](https://github.com/SoutheastDreamin/website/tree/gh-pages) branch of this repository.

## Build Process
The build process is managed by the [build.yml](https://github.com/SoutheastDreamin/website/blob/main/.github/workflows/build.yml) Github [actions](https://github.com/SoutheastDreamin/website/actions/workflows/build.yml).  This build process consists of three main steps

### Checkout
The build process checks out a node instance with the `npm` directory cached

### Lint and Build
#### Lint
Using npm, the dependencies are pull down and the lint process is ran checking all the Javascipt, CSS, YAML and JSON files.  Then the build process is started.

#### Build
The build process is run using [Gulp](https://gulpjs.com/) and the projects [gulpfile.js](https://github.com/SoutheastDreamin/website/blob/main/gulpfile.js).  This process takes the various files, compiles or moves them into the `dist` directory.  The majority of these are the [Nunjucks]() templates comprising the sites [pages](https://github.com/SoutheastDreamin/website/tree/main/html/pages).

### Deploy
After the build is complete, the contents of the `dist` folder are copied into the `gh_pages` branch of the repository and then rendered out as the website.

## Development Process
To update existing content on the site, simply edit the raw HTML in the pages directory for the appropriate page or modify the accompanying JSON file.  Most page's are driven from data in these JSON files.

When a new year is needed, create a folder under `html/pages/sponsors`, `html/pages/team`, `html/pages/schedule` and `html/pages/sessions`.  Copy each folder's `index.html` and reuse the structure of it's `index.json` file to create the data for the current year.  Additionally, site-wide information and display flags are configured in the [_globals.html](https://github.com/SoutheastDreamin/website/blob/main/html/templates/_globals.html) file.

### Tooling
In addition to more [generalized tooling]() this repo has some specific tools that can be found in the `tools` directory such as the `speakerReport.js` and `sponsorReport.js` that check for the healthiness of the speaker and sponsor data.  The `generateWhovaSessionAgenda.js` script will generate a CSV that can be imported into the Whova Excel file to generate the session agenda in Whova.