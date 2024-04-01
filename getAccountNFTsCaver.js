const Caver = require('caver-js');

const caver = new Caver('YOUR_RPC_ENDPOINT');
const ERC721 = require('@openzeppelin/contracts/build/contracts/ERC721.json');

const getAccountNFTsCaver = async function (nftAddress, account) {

    const contract = new caver.contract({
        abi: ERC721.abi,
        address: nftAddress
    });

    const incomingTransferEvents = await contract.getPastEvents('Transfer', {
        filter: { to: account }
    });

    const outgingTransferEvents = await contract.getPastEvents('Transfer', {
        filter: { from: account }
    });

    const outgoingNftIds = new Set(outgingTransferEvents.map(event => event.returnValues.tokenId));

    const incomingNftIds = new Set(
        incomingTransferEvents.map(event => event.returnValues.tokenId)
            .filter(tokenId => !outgoingNftIds.has(tokenId))
    );

    const owned = [...incomingNftIds]

    return owned;
}


module.exports = getAccountNFTsCaver(nftAddress, account)
    .then(tokenIds => console.log(tokenIds))
    .catch(err => console.error(err));