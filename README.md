# Cosmos Safari
The Lion DAO's watchful eye upon the Cosmos blockchain ecosystem, Cosmos Safari monitors on-chain events and reports them to the Lions' Den.

Currently, Cosmos Safari runs highly specialized code which are essentially just scheduled cron jobs comparing previous state to current state.

## Setup
Cosmos Safari is a CLI application. To run it, clone this repository, then run `yarn install` in its root directory to prepare dependencies, then `yarn tsc` to "compile" the project.

Next, it requires 2 secrets: A) `FIREBASE_SECRET` Firebase GoogleService.json, and B) `EXPO_SECRET` Expo Access Token. Both can be stored in a `.env` file in the project root, but for enhanded security you may store these in secure storage by running the `scripts/secrets.js` script.

The `FIREBASE_SECRET` must either point to a GoogleService.json file, or provide its contents. I recommend storing the entire JSON in the variable when using `scripts/secrets.js`, as pointing to a file mostly defeats the purpose.

You are now ready to run the application with `node dist/index.js`. A shortcut for this command on Linux exists: `./run`

Note that it is not possible to use package scripts, as these are run with a different user which then has its own secrets.

# License
Licensed under GNU GPL 3.0
