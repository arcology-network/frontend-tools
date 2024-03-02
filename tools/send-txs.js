const fs = require("fs");
const readline = require("readline");
const hre = require("hardhat");

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
  let counter=0;
  console.time('send time')
  const provider = new hre.ethers.providers.JsonRpcProvider(args[0]);
  var txs=new Array();
  const readStream = fs.createReadStream(args[1], 'utf-8');
  let rl = readline.createInterface({input: readStream})
  rl.on('line', (line) => {
    if(line.length==0){
      return
    }
    txs.push(line.split(',')[0])
    if(txs.length>=1000){
      provider.send("arcol_sendRawTransactions", [...txs]);
      counter=counter+txs.length;
      txs=new Array();
    }
  });
  rl.on('error', (error) => console.log(error.message));
  rl.on('close', () => {
    if(txs.length>0){
      provider.send("arcol_sendRawTransactions", [...txs]);
      counter=counter+txs.length;
    }
    console.log(`Transactions Send completed,total ${counter}`);
    console.timeEnd('send time')
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
