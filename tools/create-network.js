const fs = require("fs");

//nodejs create-network.js addressfile networkfile
/**
 * Analyze address file data written to network.json.
 * @async
 * @function main
 * @returns {Promise<void>} A promise that resolves when the processing is complete.
 */
async function main() {
    var args = process.argv.splice(2);
    
    console.time('loading file')
    const lines=fs.readFileSync(args[0],'utf8')
    console.timeEnd('loading file')

    const data = fs.readFileSync(args[1], 'utf8');
    const nets = JSON.parse(data);

    console.time('processtime')
    const lis=lines.split('\n')

    var addrs=new Array();
    var pks=new Array();
    for(i=0;i<lis.length;i++){
      if(lis[i].length==0){
        continue
      }
      pks.push(lis[i].split(',')[0])
      addrs.push(lis[i].split(',')[1])
    }
    nets.L2.accounts=pks
    nets.L2.addrs=addrs
    fs.writeFileSync(args[1],JSON.stringify(nets, null, 2));
    console.timeEnd('processtime')

  }

  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });