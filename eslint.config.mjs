import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import jsdoc from 'eslint-plugin-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: [
            "js/mc-validate.js"
        ],
    },
    ...compat.extends("eslint:recommended"),
    jsdoc.configs['flat/recommended'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
                Chart: "readonly",
            },

            ecmaVersion: 6,
            sourceType: "module",
        },
        plugins: {
            jsdoc
        },
        rules: {
            "array-bracket-spacing": ["error", "always"],
            "block-scoped-var": "error",
            "block-spacing": ["error", "never"],
            "brace-style": ["error", "1tbs"],
            "comma-dangle": ["error", "never"],
            indent: ["error", 4],
            "linebreak-style": ["error", "unix"],
            "global-require": "error",
            "no-extra-parens": "error",
            "no-inline-comments": "error",
            "no-lonely-if": "error",

            "no-multiple-empty-lines": ["error", {
                max: 1,
                maxBOF: 0,
                maxEOF: 0,
            }],

            "no-mixed-operators": "error",
            "no-mixed-requires": "error",
            "no-nested-ternary": "error",
            "no-plusplus": "error",
            "no-return-assign": "error",
            "no-trailing-spaces": "error",
            "no-useless-return": "error",

            "object-curly-newline": ["error", {
                minProperties: 1,
            }],

            "one-var": ["error", {
                initialized: "never",
                uninitialized: "consecutive",
            }],

            "one-var-declaration-per-line": ["error", "initializations"],
            "padded-blocks": ["error", "never"],
            quotes: ["error", "single"],

            "jsdoc/require-description": "warn",

            semi: ["error", "always"],

            "space-before-function-paren": ["error", {
                anonymous: "always",
                named: "never",
            }]
        },
    }
];