<h1> Frontend Tools  <img align="center" height="32" src="./img/home.svg">  </h1>

This project is designed to facilitate interaction with the Arcology Network. It provides a set of tools to generate transactions in **batch**, sign and save them to files, load and send them to the network, wait for their execution, parse receipts, and handle events. It also comes with the ability to monitor the status of the network.

<h2> Eth RPC  <img align="center" height="32" src="./img/ethereum.svg">  </h2>

On the Ethereum network, the standard RPC API is designed to accept a single raw transaction and cannot handle batched transactions. But the original Ethereum API lacks the ability to send transactions in batch, which is essential for improving network performance. 

With the standard `eth_sendRawTransaction` interface, you can only send one transaction at a time. This is not efficient in some cases for the Arcology Network, which is designed to handle a large number of transactions in parallel. 

<h2> Extension API  <img align="center" height="32" src="./img/code-circle.svg">  </h2>

Arcology Network supports the standard RPC API provided by Ethereum. In addition, it offers an extra interface called `arcol_sendRawTransactions`to support batched transactions for better performance. It is very similar to the standard `eth_sendRawTransaction` interface, but it is designed to accept batched raw transactions in a single request for better performance. 

For more information, please refer to the [RPC API]() document.

<h2> Toolkit  <img align="center" height="32" src="./img/key.svg">  </h2>

The toolkit provides a set of tools to generate transactions in batch, sign and save them to files, load and send them to the network, wait for their execution, parse receipts, and handle events. It also comes with the ability to monitor the status of the network.

1. `network-monitor.js` is a lightweight tool to monitor the status of the network. It calculates the maximum TPS (Transactions Per Second), real TPS, and blocks within one minute a moving window. It also provides the ability to monitor the status of the network.

2. `send-tx.js` loads raw transactions from files and sends them to the network.

<h2> Usage   <img align="center" height="32" src="./img/palett.svg">  </h2>

Please check out [this project](https://github.com/arcology-network/examples) for more information on how to use the tools to interact with the Arcology Network.

<h2> Feedback and Contributions  <img align="center" height="32" src="./img/chat.svg">  </h2>
Feel free to use these tools for benchmarking on the Arcology Network. If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.

<h2> License  <img align="center" height="32" src="./img/copyright.svg">  </h2>
This toolkit is licensed under the MIT License.

