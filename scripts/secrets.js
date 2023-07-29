#!/usr/bin/env node
import keytar from 'keytar'
import promptPassword from 'password-prompt'
import yargs from 'yargs'

const { deletePassword, getPassword, setPassword } = keytar;

yargs(process.argv.slice(2))
  .command({ // set
    command: 'set <var> [value]',
    describe: 'Set a value. For enhanced security, omit the value and you will be prompted to enter it interactively.',
    builder: yargs => yargs,
    handler: async argv => {
      let { var: name, value } = argv;
      if (!value)
        value = await promptPassword('Enter value: ', { method: 'hide' });
      await setPassword('cosmos-safari', name, value);
      process.exit();
    },
  })
  .command({ // has
    command: 'has <var>',
    describe: 'Check if a value exists',
    builder: yargs => yargs,
    handler: async argv => {
      if (await getPassword('cosmos-safari', argv.var)) {
        console.log('true');
        process.exit();
      } else {
        console.log('false');
        process.exit(1);
      }
    },
  })
  .command({ // get
    command: 'get <var>',
    describe: 'Get a value',
    builder: yargs => yargs,
    handler: async argv => {
      console.log(await getPassword('cosmos-safari', argv.var));
      process.exit();
    },
  })
  .command({ // delete
    command: 'delete <var>',
    describe: 'Delete a value',
    builder: yargs => yargs,
    handler: async argv => {
      if (!await deletePassword('cosmos-safari', argv.var)) {
        console.error("Failed to delete password");
        process.exit(1);
      }
    },
  })
  .command({ // list
    command: 'list',
    aliases: ['ls'],
    describe: 'List secret names',
    builder: yargs => yargs,
    handler: async argv => {
      const all = await keytar.findCredentials('cosmos-safari');
      console.log(all.map(({ account }) => account).join('\n'));
    },
  })
  .help()
  .alias('help', 'h')
  .demandCommand()
  .argv
