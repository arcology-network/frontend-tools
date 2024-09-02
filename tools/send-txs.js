#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline");
var frontendUtil = require('@arcologynetwork/frontend-util/utils/util') 




/**
 * This script reads in a file containing raw transaction data, splits the data into individual transactions,
 * and sends them in batches of 1000 to the Arcology network.
 * 
 * @async
 * @function main
 * @returns {Promise<void>} A Promise that resolves when the transactions are sent.
 */
async function main() {
  var args = process.argv.splice(2);
  if(args.length<2){
    console.log('Please provide the RPC provider and the file containing the transaction data.');
    return;
  }

  if(!fs.statSync(args[1]).isDirectory()){
    console.log('Please provide the path that contains the pre-signed transaction file.');
    return;
  }

  
  // console.time('send time')

  const client =await frontendUtil.startRpc(args[0])
  const files=frontendUtil.findAllFiles(args[1])
  
  for(fidx=0;fidx<files.length;fidx++){
    sentxs(files[fidx],client)
  }
  
  // console.timeEnd('send time')
}

/**
 * Find all the files in the folder.
 * @param {string} file - Transaction file name .
 * @param {Object} client - Client instance of rpc connection .
 * @returns {} -.
 */
function sentxs(file,client){
  let counter=0;
  var txs=new Array();
  
  const readStream = fs.createReadStream(file, 'utf-8');
  let rl = readline.createInterface({input: readStream})
  rl.on('line', (line) => {
    if(line.length==0){
      return
    }
    txs.push(line.split(',')[0])
    if(txs.length>=1000){
      frontendUtil.rpcRequest(client,"arn_sendRawTransactions",[...txs])
      counter=counter+txs.length;
      txs=new Array();
    }
  });
  rl.on('error', (error) => console.log(error.message));
  rl.on('close', () => {
    if(txs.length>0){
      frontendUtil.rpcRequest(client,"arn_sendRawTransactions",[...txs])
      counter=counter+txs.length;
      filenames=file.split('/')
      console.log(`The file ${filenames[filenames.length-1]} is sent successfully,total ${counter}`);
    }
    
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
