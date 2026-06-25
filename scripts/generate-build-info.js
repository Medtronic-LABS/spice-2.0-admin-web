const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const getGitCommit = () => {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
};

const buildInfo = {
  git: {
    commit: getGitCommit(),
  }
};

fs.writeFileSync(
  path.resolve(__dirname, '../public/build-info.json'),
  JSON.stringify(buildInfo, null, 2)
);
