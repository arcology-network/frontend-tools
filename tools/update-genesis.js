#!/usr/bin/env node

const fs = require("fs");

/**
 * Reads and Analyze a cvs file containing accounts and addresses, and updates the network.json, which will be 
 * used later to initialize the test accounts when starting the network
 * @async
 * @function main
 * @returns {Promise<void>} A promise that resolves when the processing is complete.
 * @throws {Error} If an error occurs during the processing.
 */

async function main() {
    var args = process.argv.splice(2);
    if(args.length!=2){
      console.log('Please provide the address file and the location of the network.json file.');
      return;
    }

    console.time('loading file')
    const lines=fs.readFileSync(args[0],'utf8')
    console.timeEnd('loading file')

    
    const data = fs.readFileSync(args[1], 'utf8');
    let genesis;
    try {
      genesis = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing the file:', error);
    }
    
    console.time('processtime')
    const lis=lines.split('\n')

    var alloc=genesis.alloc;
    var balance;
    for(i=0;i<lis.length;i++){
      if(lis[i].length==0){
        continue
      }
      balance = { "balance": lis[i].split(',')[2]};
      alloc[lis[i].split(',')[1]]=balance;
    }

    genesis.alloc=alloc
    fs.writeFileSync(args[1],JSON.stringify(genesis, null, 2));
    console.timeEnd('processtime')
  }

  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });