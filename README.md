# spice-2.0-admin-web

> Project SPICE 2.0 Admin Web

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.
You can find the most recent version of this guide [here](https://github.com/facebook/create-react-app/blob/master/README.md).


## Tech stack

- HTML
- SCSS
- TypeScript
- React(18.x.x)
- Redux


## Setup

To bring the Spice client side up and running, there are few prerequisites that have to be followed.

- Install NodeJS v18.x.x. [Click here](https://nodejs.org/en/download)

- Install npm package

```sh
npm install -g npm@8
```

## Getting Started

1. Clone the application repository

   ```
   $ git clone https://github.com/Medtronic-LABS/spice-2.0-admin-web.git --branch main
   ```

2. Environment Config

   Before start the application need to configure the environment variables.
   Sample environment config file `env.example` rename the file to `.env` and customize the variable `REACT_APP_BASE_URL`.

   ```properties
   REACT_APP_BASE_URL=http://<your_server_url>:<port>/
   REACT_APP_PASSWORD_HASH_KEY=spice_opensource
   REACT_APP_CRYPTR_SECRET_KEY=spice_opensource
   REACT_APP_GA_TRACKING_ID=2hb78n0
   REACT_APP_ORG_SUCCESS_DELAY_TIME=545678
   ```
   By default, the Salt key is set as `spice_opensource`, but you can modify it if necessary. Please note that the Salt key must match the key used in the backend.

3. Install your dependencies

   ```
   $ npm install --force
   ```

4. Start your application
   ```
   $ npm start
   ```

## .env

The `.env` file is used to store environment variables for the project. These variables are used to configure the
application and contain sensitive information such as passwords, API keys, and other credentials.

Please note that the `.env` file should never be committed to version control, as it contains sensitive information that
should not be shared publicly. Instead, you should add the `.env` file to your .gitignore file to ensure that it is not
accidentally committed.

To use the application, you will need to create a `.env` file in the root directory of the project and add the necessary
environment variables. You can refer to the above file for an example of the required variables and their format.

***The values provided in the
instructions are for demonstration purposes only and will not work as-is. You will need to replace them with actual
values that are specific to your environment.***

## .env description

`REACT_APP_BASE_URL`: This variable could be used to specify the base URL of the API that the application is consuming.

`REACT_APP_PASSWORD_HASH_KEY`: This variable could be used to store the password hash key that is used to hash passwords.

`REACT_APP_CRYPTR_SECRET_KEY`: This variable could be used to store the secret key used for encryption and decryption in the application.

`REACT_APP_ORG_SUCCESS_DELAY_TIME`: This variable could be used to specify the time delay for success messages displayed to the user.

`REACT_APP_GA_TRACKING_ID`: This variable could be used to specify the Google Analytics tracking ID for the application to track user behavior and activity.

## Web URL

Web URL - `http://localhost:3000/`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## Supported Browsers

By default, the generated project uses the latest version of React.

You can refer [to the React documentation](https://reactjs.org/docs/react-dom.html#browser-support) for more information about supported browsers.
