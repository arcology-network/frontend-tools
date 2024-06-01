#!/usr/bin/env node

var frontendUtil = require('@arcologynetwork/frontend-util/utils/util') 


/**
 * Monitors the network by calculating the transactions per second (TPS) in real-time.
 * @async
 * @function main
 * @returns {Promise<void>} A promise that resolves when the monitoring is complete.
 */
async function main() {
    var args = process.argv.splice(2);
    if(args.length!=1){
      console.log('Please provide the RPC provider to connect.');
      return;
    }

    const client =await frontendUtil.startRpc(args[0])
    let startBlocknum=await frontendUtil.rpcRequest(client,"eth_blockNumber",[])

    let loop=true;
    let blocknum=parseInt(startBlocknum);
    var blocksWithInOneMinute=new Array();
    let maxTps=0;
    while (loop) {
      let block;
      block=await frontendUtil.rpcRequest(client,"eth_getBlockByNumber",['0x'+(blocknum).toString(16),false])
      if(block==undefined){
        await frontendUtil.sleep(1000);
        continue;
      }
      blocksWithInOneMinute.push(block);
      const hashes=block.transactions;
      let successful=0;
      let fail=0;
      for(i=0;i<hashes.length;i++){
        const receipt=await frontendUtil.rpcRequest(client,"eth_getTransactionReceipt",[hashes[i]])
        if(receipt.status=='0x1'){
          successful=successful+1;
        }else{
          fail=fail+1;
        }
      }

      const result=calculateTps(maxTps,blocksWithInOneMinute);
      maxTps=result.maxTps;
      blocksWithInOneMinute=result.blocksWithInOneMinute;      
      if(hashes.length>0){
        console.log(`height = ${parseInt(block.number)}, total = ${hashes.length}, success = ${successful}, fail = ${fail}, timestamp = ${parseInt(block.timestamp)}, maxTps = ${result.maxTps}, realtimeTps(1m) = ${result.realtimeTps}`)
      }else{
        console.log(`height = ${parseInt(block.number)}, empty block, timestamp = ${parseInt(block.timestamp)}, maxTps = ${result.maxTps}, realtimeTps(1m) = ${result.realtimeTps}`)
      }
      blocknum = blocknum + 1;
    }
  }

  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


/**
 * Calculates the maximum TPS (Transactions Per Second), real TPS, and blocks within one minute.
 * @param {number} maxTps - The maximum TPS value.
 * @param {Array} blocks - An array of blocks.
 * @returns {Object} - An object containing the maximum TPS, real TPS, and blocks within one minute.
 */

function calculateTps(maxTps,blocks){
  if(blocks.length>1){
    const txsNums=blocks[blocks.length-2].transactions.length;
    const lastTps=parseInt(txsNums/(blocks[blocks.length-1].timestamp-blocks[blocks.length-2].timestamp))
    maxTps=lastTps>maxTps?lastTps:maxTps;
  }

  let nblocks=new Array();
  let now=parseInt(blocks[blocks.length-1].timestamp)
  for(i=0;i<blocks.length;i++){
    if(parseInt(blocks[i].timestamp)+60<now){
      continue;
    }
    nblocks.push(blocks[i]);
  }

  let totalTxs=0;
  for(i=0;i<nblocks.length;i++){
    totalTxs=totalTxs+nblocks[i].transactions.length;
  }

  let seconds=60;
  if(nblocks.length>1){
    seconds=blocks[blocks.length-1].timestamp-blocks[0].timestamp;
  }

  const realtimeTps=parseInt(totalTxs/seconds);
  const tps=realtimeTps>maxTps?realtimeTps:maxTps;
  return {"maxTps":tps,"realtimeTps":realtimeTps,"blocksWithInOneMinute":nblocks}
}