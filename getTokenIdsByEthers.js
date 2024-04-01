const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_ENDPOINT');
const ERC721 = require('@openzeppelin/contracts/build/contracts/ERC721.json');

const getAccountNFTsEthers = async function (nftAddress, account) {

    const contract = new ethers.Contract(nftAddress, ERC721.abi, provider);

    const outogingTransferEvents = await contract.queryFilter('Transfer', {
        from: account
    });

    const incomingTransferEvents = await contract.queryFilter('Transfer', {
        to: account
    });

    const outgoingNftIds = new Set(outogingTransferEvents.map(event => event.args.tokenId));

    const incomingNftIds = new Set(
        incomingTransferEvents.map(event => event.args.tokenId)
            .filter(tokenId => !outgoingNftIds.has(tokenId))
    );

    const owned = [...incomingNftIds];

    return owned;
}

getAccountNFTsEthers(nftAddress, account)
    .then(tokenIds => console.log(tokenIds))
    .catch(err => console.error(err));

