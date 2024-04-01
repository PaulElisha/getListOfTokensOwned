const Caver = require('caver-js');

const caver = new Caver('YOUR_RPC_ENDPOINT');

const getAccountNFTsCaver = async function (nftAddress, account) {

    const contract = new caver.contract({
        abi: [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ],
        address: nftAddress
    });

    const incomingTransferEvents = await contract.getPastEvents('Transfer', {
        filter: { to: account }
    });

    const outgingTransferEvents = await contract.getPastEvents('Transfer', {
        filter: { from: account }
    });

    const incomingTokenIds = new Set(
        incomingTransferEvents.map(event => event.returnValues.tokenId)
            .filter(tokenId => !outgoingTokenIds.has(tokenId))
    );

    const outgoingTokenIds = new Set(outgingTransferEvents.map(event => event.returnValues.tokenId));

    const owned = [...incomingTokenIds]

    return owned;
}


module.exports = getAccountNFTsCaver(nftAddress, account)
    .then(tokenIds => console.log(tokenIds))
    .catch(err => console.error(err));