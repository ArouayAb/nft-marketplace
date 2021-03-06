'use strict'

const listingService = require("../services/ListingService");

let pageIndex = 1;

exports.listingPage = function(req, res) {
    let pageNumberElements = 8;

    if(req.query.loadMore !== undefined) pageIndex++;
    // else if(req.query.pageIndex > 0) pageIndex = req.query.pageIndex;
    else pageIndex = 1;

    listingService.findAllActiveListings(pageNumberElements, pageNumberElements * (pageIndex - 1), req.query.searchedNft)
        .then(nftCards => {
            let isLastPage = false;
            if (pageIndex >= 0 && pageIndex > Math.floor(nftCards.count / pageNumberElements)){
                isLastPage = true;
                pageIndex = Math.floor(nftCards.count / pageNumberElements);
            }

            res.status(200).render('explore', { nfts: nftCards.rows, isLastPage: isLastPage, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile } });
        }).catch(err => {
            res.status(404).render('404', {error: err, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
        });
}

exports.itemDetailsPage = function (req, res) {
    listingService.findListingByTokenId(req.query.nft_id)
        .then(nftDTO => {
            res.status(200).render('item-details', { nft: nftDTO, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile } });
        }).catch(err => {
            res.status(404).render('404', {error: err, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
    });
}