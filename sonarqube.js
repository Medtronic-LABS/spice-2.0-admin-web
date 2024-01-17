const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: process.env.REACT_APP_SONAR_URL,
    token: process.env.REACT_APP_SONAR_TOKEN,
    options: {
      'sonar.sources': './src',
      'sonar.tests': './src/',
      'sonar.test.inclusions': '*.test.{ts,tsx}',
      'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info'
    }
  },
  () => process.exit()
);
