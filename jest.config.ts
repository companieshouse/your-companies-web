module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(uuid)/)',
    ],
    moduleDirectories: ['node_modules', 'src'],
    globalSetup: "./test/global.setup.ts",
    testTimeout: 10000
};
