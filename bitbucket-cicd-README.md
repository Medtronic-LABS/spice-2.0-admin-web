# CI/CD Pipeline Guide

This document explains the complete CI/CD setup defined in `bitbucket-pipelines.yml` for the `spice_web` project.

## 1) Pipeline Purpose

The pipeline performs the following flow:

1. Install dependencies and run tests
2. Run SonarQube analysis (with coverage report)
3. Build the web application
4. Deploy build artifacts to AWS S3
5. Invalidate AWS CloudFront cache

It supports:
- Pull request validation pipelines
- Automatic deployment from selected branches
- Manual deployment for QA

---

## 2) Global Configuration

- `options.max-time: 60`
  - Max runtime for each pipeline execution is 60 minutes.

---

## 3) Definitions Section

### 3.1 Cache

- NPM cache:
  - `~/.npm`
  - Improves dependency install speed for repeated builds.

### 3.2 Runner

Reusable runner definition (`&runner-uhis-dev`):
- `self.hosted`
- `linux`
- `spice.uhis`
- `ec2.runner`

All stages in this file run on this self-hosted runner.

### 3.3 Reusable Step Anchors

The pipeline uses YAML anchors to avoid duplication:

- `&install-test`
- `&sonar`
- `&build`
- `&deploy-s3-cf`
- `&deploy-s3-cf-training`

---

## 4) Step Details

## 4.1 Install & Test (`&install-test`)

- Image: `node:22.14.0`
- Cache: `npm`
- Script:
  - `set -e`
  - `export CI=false`
  - `npm ci`
  - `npm run test || echo "Tests failed but continuing..."`

### Artifacts produced
- `coverage/**`
- `node_modules/**`

### Notes
- Tests are currently non-blocking because failures are swallowed with `|| echo ...`.
- `node_modules` artifact is reused by build step to reduce repeated installs.

## 4.2 Sonar (`&sonar`)

- Image: `sonarsource/sonar-scanner-cli:latest`
- Runs `sonar-scanner` with:
  - `sonar.projectKey=${SONAR_PROJECT_KEY:-spice-uhis-web}`
  - `sonar.sources=./src`
  - `sonar.tests=./src`
  - `sonar.test.inclusions=*.test.{ts,tsx}`
  - `sonar.typescript.lcov.reportPaths=coverage/lcov.info`
  - `sonar.qualitygate.wait=true`

### Required variables
- `SONAR_HOST_URL`
- `SONAR_TOKEN`

### Optional variable
- `SONAR_PROJECT_KEY` (defaults to `spice-uhis-web` if unset)

## 4.3 Build (`&build`)

- Image: `node:22.14.0`
- Cache: `npm`
- Script:
  - `export CI=false`
  - If `node_modules` exists (artifact), skip install
  - Else run `npm ci`
  - Run `npm run build`

### Artifacts produced
- `build/**`

## 4.4 Deploy to S3 + CloudFront (`&deploy-s3-cf`)

- Image: `amazon/aws-cli:2.15.0`
- Script:
  - `set -e`
  - Sync all build files except `index.html` with long cache headers
  - Upload `index.html` separately with no-cache headers
  - Invalidate CloudFront path `/*`

### Required deployment variables
- `AWS_S3_BUCKET`
- `CF_DIST_ID`

## 4.5 Deploy to Training with OIDC (`&deploy-s3-cf-training`)

Same deployment logic as `deploy-s3-cf`, plus OIDC authentication:

- OIDC audience is configured in step:
  - `ari:cloud:bitbucket::workspace/25d4da96-4791-4b12-9b73-a2308af9ff35`
- Script includes:
  - `AWS_ROLE_ARN=$AWS_OIDC_ROLE`
  - `AWS_WEB_IDENTITY_TOKEN_FILE=<temp-token-file>`
  - Write `BITBUCKET_STEP_OIDC_TOKEN` to token file
  - `aws sts get-caller-identity` for identity verification
  - Cleanup token file at end

### Additional required variable
- `AWS_OIDC_ROLE`

---

## 5) Triggered Pipelines

## 5.1 Pull Request Pipelines

### Pattern: `uhis-*`

Stages:
1. `Install, Test & Sonar`
2. `Build` (deployment context: `uhis-dev`)

### Pattern: `feature/uhis-*`

Stages:
1. `Install, Test & Sonar`
2. `Build` (deployment context: `uhis-dev`)

### PR behavior summary
- Validates code quality and build readiness.
- No S3/CloudFront deployment step is executed in PR pipelines.

## 5.2 Branch Pipelines

### Branch: `uhis-dev`

Stages:
1. `Install, Test & Sonar`
2. `Build & Deploy to UHIS-DEV`
   - Build
   - Deploy (`deploy-s3-cf`)

Deployment environment: `uhis-dev`

### Branch: `uhis-training`

Stages:
1. `Install, Test & Sonar`
2. `Build & Deploy to UHIS-TRAINING`
   - Build
   - Deploy (`deploy-s3-cf-training`, OIDC)

Deployment environment: `uhis-training`

## 5.3 Custom (Manual) Pipeline

### Pipeline: `deploy-uhis-qa`

Stages:
1. `Build & Deploy to UHIS-QA`
   - Build
   - Deploy (`deploy-s3-cf`)

Deployment environment: `uhis-qa`

Required deployment variables for QA:
- `AWS_S3_BUCKET`
- `CF_DIST_ID`

---

## 6) Variable Reference

## 6.1 Sonar Variables
- `SONAR_HOST_URL`
- `SONAR_TOKEN`
- `SONAR_PROJECT_KEY` (optional)

## 6.2 AWS Deploy Variables
- `AWS_S3_BUCKET`
- `CF_DIST_ID`

## 6.3 OIDC Deploy Variables (Training)
- `AWS_OIDC_ROLE`
- `BITBUCKET_STEP_OIDC_TOKEN` (provided by Bitbucket at runtime when OIDC enabled)

---

## 7) Artifact and Dependency Flow

1. `install-test` generates:
   - `coverage/**`
   - `node_modules/**`
2. `sonar` consumes coverage output
3. `build` consumes `node_modules/**` artifact and outputs `build/**`
4. deploy steps use `build/**` to publish assets

This reduces repeated dependency installation and speeds up pipeline runs.

---

## 8) Cache-Control Strategy in Deploy

The deploy step intentionally applies different cache policies:

- Static assets (via `aws s3 sync`, excluding `index.html`):
  - `cache-control: max-age=31536000,public`
- `index.html`:
  - `cache-control: no-cache, no-store, must-revalidate`

Why:
- Long cache for hashed/static assets improves performance.
- No-cache for `index.html` ensures users receive latest app shell quickly.

---

## 9) Failure Behavior and Important Notes

- Deploy steps use `set -e`, so any failing deploy command stops the step.
- Sonar waits for quality gate (`sonar.qualitygate.wait=true`), which can fail pipeline if gate fails.
- Test failures currently do not fail pipeline due to:
  - `npm run test || echo "Tests failed but continuing..."`
- CloudFront invalidation is always full (`/*`) after deploy.

---

## 10) How to Run

## 10.1 Automatic runs

- Create/update PR from:
  - `uhis-*`
  - `feature/uhis-*`
- Push commits to:
  - `uhis-dev`
  - `uhis-training`

## 10.2 Manual QA run

1. Open Bitbucket Pipelines.
2. Click **Run pipeline**.
3. Select custom pipeline: `deploy-uhis-qa`.
4. Choose branch/commit and run.

---

## 11) Troubleshooting Guide

## Sonar issues
- Confirm `SONAR_HOST_URL` and `SONAR_TOKEN` are configured.
- Confirm tests generated `coverage/lcov.info`.
- Verify Sonar project key and permissions.

## Build issues
- If dependency errors occur, check whether `node_modules/**` artifact was created.
- Build step already falls back to `npm ci` if artifact is missing.

## AWS deployment issues
- Verify deployment variables: `AWS_S3_BUCKET`, `CF_DIST_ID`.
- Check IAM permissions for:
  - `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`
  - `cloudfront:CreateInvalidation`

## OIDC issues in training deployment
- Confirm `AWS_OIDC_ROLE` is correct.
- Confirm AWS IAM OIDC IdP audience and role trust policy match Bitbucket audience.
- Confirm `oidc` is enabled in the deployment step.

## Stale content after deployment
- Verify CloudFront invalidation command succeeded.
- Ensure `index.html` has no-cache headers as intended.
