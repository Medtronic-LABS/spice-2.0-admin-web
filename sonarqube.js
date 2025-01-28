const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000/',
    token: 'sqp_f04262923b6eb502a8e54ed1c0f502304f29aa42',
    options: {
      'sonar.sources': './src',
      'sonar.tests': './src/',
      'sonar.test.inclusions': '*.test.{ts,tsx}',
      'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info'
    }
  },
  () => process.exit()
);
