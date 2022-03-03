const fs = require('fs');

const importGroups = [
  ['^\\u0000'],
  ['^@?\\w'],
  ['^'],
  ['^\\.'],
  ['^@?\\w.*\\u0000$', '^[^.].*\\u0000$', '^\\..*\\u0000$']
];

let configJson = fs.readFileSync('./tsconfig.json', 'utf8');
configJson = configJson.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => (g ? '' : m));

const compilerOptions = JSON.parse(configJson).compilerOptions;

if ('paths' in compilerOptions) {
  const namespaces = Object.keys(compilerOptions.paths).map(path => path.replace('/*', ''));
  if (namespaces && namespaces.length > 0) {
    // Anything that is defined in tsconfig.json with a little trick in order to resolve paths
    const pathAliasRegex = [`^(${namespaces.join('|')})(/.*|$)`];
    importGroups.splice(2, 0, pathAliasRegex);
  }
}

module.exports = {
  env: {
    "browser": true,
    "es2021": true
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:eslint-comments/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:unicorn/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:promise/recommended",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "eslint-comments",
    "unicorn",
    "import",
    "promise",
    "prettier",
    "simple-import-sort"
  ],
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "no-useless-constructor": "off",
    "class-methods-use-this": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "simple-import-sort/imports": [
      "error",
      {
        groups: importGroups
      }
    ],
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["../*"],
            message: "For imports of parent elements use better path aliases. For example, @domain/shared."
          }
        ]
      }
    ],
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    "simple-import-sort/exports": "error",
    "import/prefer-default-export": "off",
    "import/no-default-export": "off",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-deprecated": "error",
    "import/group-exports": "error",
    "import/exports-last": "error",
    "react/function-component-definition": [
      2,
      {
        "namedComponents": "arrow-function",
        "unnamedComponents": "arrow-function"
      }
    ]
  }
};
