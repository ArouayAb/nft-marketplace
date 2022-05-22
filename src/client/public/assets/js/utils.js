import {ethers} from "./ethers.js";

$(window).on('load', () => {
    if($("#exploreBody").data("load")) {
        $("#loadMoreNftId").toggleClass("disableButton");
    }
});

$("#nftSearchButton").on('click', () => {
    location.href='?searchedNft=' + $("#nftSearch").val();
});

$("#profileSearchButton").on('click', () => {
    location.href='?searchedProfile=' + $("#profileSearch").val();
});

$("#musicRadioId").on('click', () => {
    $("#digitalArtRadioId, #photographyRadioId").removeClass("active home-3");

    $("#musicRadioId").addClass("active home-3");
});

$("#photographyRadioId").on('click', () => {
    $("#digitalArtRadioId, #musicRadioId").removeClass("active home-3");

    $("#photographyRadioId").addClass("active home-3");
});

$("#digitalArtRadioId").on('click', () => {
    $("#photographyRadioId, #musicRadioId").removeClass("active home-3");

    $("#digitalArtRadioId").addClass("active home-3");
});

$(".testSendSigner").on("click", async () => {

    let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});

    var provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    let Marketplace = await (await fetch("../contracts/Marketplace.json")).json();
    let MarketplaceAddress = await (await fetch("../contracts/Marketplace-address.json")).json();

    let Nft = await (await fetch("../contracts/NFT.json")).json();
    let NftAddress = await (await fetch("../contracts/NFT-address.json")).json();

    let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, signer);
    let nftContract = new ethers.Contract(NftAddress, Nft.abi, signer);

    const toWei = (number) => ethers.utils.parseEther(number.toString());

    nftContract.on('Minted', (a, b, c) => {
        console.log(a.toString(), b, c);
    });

    let tokenId = await nftContract.mint("URI HERE TEST");

    await nftContract.setApprovalForAll(marketplaceContract.address, true);
    await marketplaceContract.makeItem(nftContract.address, (await nftContract.tokenCount()).toString(), toWei(2));

    // $.ajax({
    //     url: 'http://localhost:3000/',
    //     type: 'get',
    //     success: function (res) {
    //         window.location.href = "index";
    //     }
    // });

});
