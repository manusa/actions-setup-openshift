#!/usr/bin/env node
'use strict';

const errorHandler = require('./error-handler');
const checkEnvironment = require('./check-environment');
const configureDocker = require('./configure-docker');
const loadInputs = require('./load-inputs');
const download = require('./download');
const install = require('./install');

const run = async () =>{
  checkEnvironment();
  configureDocker();
  const downloadedFile = await download(loadInputs());
  await install(downloadedFile);
};

process.on('unhandledRejection', errorHandler);
run().catch(errorHandler);
