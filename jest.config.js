module.exports = {
    rootDir: '.',
    resetMocks: true,
    moduleFileExtensions: ['ts', 'js'],
    collectCoverage: true,
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['<rootDir>/test/**/*.ts'],
    coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    preset: 'ts-jest',
};
