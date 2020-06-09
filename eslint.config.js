module.exports = {
  plugins: [
    "@typescript-eslint",
    "header"
  ],
  extends: [
      "./node_modules/gts",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
      "project": "./tsconfig.json"
  },
  rules: {
    "@typescript-eslint/no-this-alias": "off",
    "eqeqeq": "off",
    "prefer-rest-params": "off",
    "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "memberLike",
          "modifiers": ["private", "protected"],
          "format": ["camelCase"],
          "leadingUnderscore": "require"
        }
    ],
    "@typescript-eslint/no-inferrable-types": ["error", { ignoreProperties: true }],
    "arrow-parens": ["error", "as-needed"],
    "prettier/prettier": ["error", { "singleQuote": true, "arrowParens": "avoid" }],
    "node/no-deprecated-api": ["warn"],
    "header/header": [2, "block", [{
        pattern: / \* Copyright \d{4}, OpenTelemetry Authors[\r\n]+ \*[\r\n]+ \* Licensed under the Apache License, Version 2\.0 \(the \"License\"\);[\r\n]+ \* you may not use this file except in compliance with the License\.[\r\n]+ \* You may obtain a copy of the License at[\r\n]+ \*[\r\n]+ \*      https:\/\/www\.apache\.org\/licenses\/LICENSE-2\.0[\r\n]+ \*[\r\n]+ \* Unless required by applicable law or agreed to in writing, software[\r\n]+ \* distributed under the License is distributed on an \"AS IS\" BASIS,[\r\n]+ \* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied\.[\r\n]+ \* See the License for the specific language governing permissions and[\r\n]+ \* limitations under the License\./gm
    }]]
  },
  overrides: [
    {
      "files": ["test/**/*.ts"],
      "rules": {
        "no-empty": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
};
