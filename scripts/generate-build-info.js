const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const getGitCommit = () => {
  if (process.env.CI_COMMIT_SHA) {
    return process.env.CI_COMMIT_SHA;
  }

  if (process.env.BITBUCKET_COMMIT) {
    return process.env.BITBUCKET_COMMIT;
  }

  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
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
