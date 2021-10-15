import yargs from 'yargs/yargs'

async function run(args: string[]) {
  const {argv} = yargs(args).options({
    't': {type: 'string', alias: 'token'},
    'r': {type: 'string', alias: 'repository'},
  })


}

run(process.argv.slice(2)).catch(console.error)

