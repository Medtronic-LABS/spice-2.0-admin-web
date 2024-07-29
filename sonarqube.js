const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:8000/',
    token: 'sqp_c90a3ee0da9ec8789d7c4bd308ca72b91bb5f4eb',
    options: {
      'sonar.sources': './src',
      'sonar.tests': './src/',
      'sonar.test.inclusions': '*.test.{ts,tsx}',
      'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info'
    }
  },
  () => process.exit()
);
