module.exports = {
    rootDir:'../../',
    roots: [
        '<rootDir>/src/tests/unit',
    ],
    coverageDirectory: '<rootDir>/jest/coverage',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    // testRegex: '(/test/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
    moduleNameMapper: {
        '^helpers/(.*)$': '<rootDir>/src/helpers/$1',
        '^types/(.*)$': '<rootDir>/src/@types/$1',
        '^packageJson$': '<rootDir>/package.json',
    },
    globals: {
        'ts-jest': {
            packageJson: 'package.json',
            tsConfig: '<rootDir>/tsconfig.json'
        }
    },
};
