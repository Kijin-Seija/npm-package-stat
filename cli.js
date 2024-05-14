#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const analyzeProjects = require('./script');
const path = require('path');

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options] <projectPath1> <projectPath2> ...')
  .example('$0 /path/to/project1 /path/to/project2', 'Analyze dependencies and devDependencies for project1 and project2')
  .example('$0 -S -D /path/to/project', 'Analyze both dependencies and devDependencies for a single project')
  .option('S', {
    describe: 'Only include dependencies',
    type: 'boolean',
    default: false,
  })
  .option('D', {
    describe: 'Only include devDependencies',
    type: 'boolean',
    default: false,
  })
  .option('O', {
    describe: 'Only include optionalDependencies',
    type: 'boolean',
    default: false,
  })
  .option('P', {
    describe: 'Only include peerDependencies',
    type: 'boolean',
    default: false,
  })
  .help('h')
  .alias('h', 'help')
  .epilogue('By default, if no options are provided, both dependencies and devDependencies are included.\n' +
            'Parameters can be combined, and the resulting package set will be the union of the specified types.')
  .argv;

const projectPaths = argv._.map(p => path.resolve(p));

analyzeProjects(projectPaths, argv, (err, message) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(message);
  }
});
