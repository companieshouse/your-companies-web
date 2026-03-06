module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleDirectories: ['node_modules', 'src'],
    globalSetup: "./test/global.setup.ts",
    testTimeout: 10000
};
