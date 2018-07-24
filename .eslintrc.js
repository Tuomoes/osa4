module.exports = {
    "env": {
        "node": true,
        "es6": true,
        "jest": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-console": 0
    },
    "parserOptions": {
        "ecmaVersion": 2018
    }
};