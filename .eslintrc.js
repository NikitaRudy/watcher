module.exports = {
    "extends": "airbnb-base",
    "env": {
        "node": true,
        "es6": true
    },
    "rules": {
        "comma-dangle": ["error", "always-multiline"],
        "arrow-body-style": 0,
        "no-shadow": 0,
        "object-curly-newline": "off",
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "global-require": 0,
        "func-names": "off",
        "no-underscore-dangle": "off",
        "max-len": "off",
        "no-bitwise": "off",
        "no-param-reassign": ["warn", { "props": false }],
        "padded-blocks": "off",
        "no-use-before-define": "off",
        "no-unused-vars": "warn",
        "react/require-extension": "off",
        "import/no-extraneous-dependencies": "off",
        "no-plusplus": "off",
        "prefer-template": "off",
        "consistent-return": "off",
        "no-console": "off",
        "no-restricted-syntax": ["error", "DebuggerStatement", "ForInStatement", "LabeledStatement", "WithStatement"],
        "dot-notation": "off",
        "class-methods-use-this": "off",
        "no-useless-constructor": "off",
    }
}
