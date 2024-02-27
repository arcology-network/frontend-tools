const hre = require("hardhat");
var benchtools = require('@arcologynetwork/benchmarktools/tools') 
const nets = require('../network.json');

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

  const provider = new hre.ethers.providers.JsonRpcProvider(args[0]);
  console.time('loading file')
  const flines=benchtools.readfile(args[1])
  console.timeEnd('loading file')

  console.time('send time')
  const lines=flines.split('\n')

  var txs=new Array();
  for(i=0;i<lines.length;i++){
    if(lines[i].length==0){
      continue
    }
    txs.push(lines[i].split(',')[0])
    if(txs.length>=1000){
      provider.send("arcol_sendRawTransactions", [...txs]);
      txs=new Array();
    }
  }

  if(txs.length>0){
    provider.send("arcol_sendRawTransactions", [...txs]);
  }
  console.timeEnd('send time')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
