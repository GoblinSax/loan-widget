import { GoblinSaxAPI, Version } from "@goblinsax/gs-sdk";
import {ethers} from "ethers";
import { Asset, LoanTerms, LoanTermsResponse, Offers, SelectedLoanTerm, Term } from "src/types/types";;

const goblinSaxSDK = (signerFromProps: ethers.providers.JsonRpcSigner, APIkey: string, network?: 'MAINNET'|'GOERLI') => {
    let signer = null as ethers.providers.JsonRpcSigner | null
    let gs = null as GoblinSaxAPI | null


        if (!signerFromProps) {
            // throw new Error("Signer not found");
            return;
        }
        
        if(!APIkey){
            // throw new Error("API key not found");
            return;
        }

        signer = signerFromProps;
        const temp_gs = new GoblinSaxAPI(signerFromProps, APIkey, Version.MAINNET);
        gs = temp_gs;


    const getWhiteList = async () => {
        if(!gs){
            throw new Error("GoblinSaxAPI not found");
        }

        // const whiteList = await fetch(`https://api.goblinsax.xyz/collections/`);
        // const whiteList_json = await whiteList.json();
        // return whiteList_json;
        const whitelist = await gs.getWhitelist();
        return whitelist;
    }

    const getWhitelistImgSrc = (slug:string) => {
        //'autoglyphs azuki bored-ape-kennel-club boredapeyachtclub chromie-squiggle-by-snowfro clonex construction-token-by-jeff-davis cool-cats-nft cryptoadz-by-gremplin cryptodickbutts-s3 cryptopunks cyberbrokers cyberkongz deafbeef digidaigaku doodles-official fidenza-by-tyler-hobbs goblintownwtf meebits mutant-ape-yacht-club nftrees nouns otherdeed proof-moonbirds ringers-by-dmitri-cherniak space-doodles-official thecurrency veefriends world-of-women-nft'
        const slugToImgFormat = {
            'autoglyphs': 'svg',
            'azuki': 'png',
            'bored-ape-kennel-club': 'png',
            'boredapeyachtclub': 'png',
            'chromie-squiggle-by-snowfro': 'png',
            'clonex': 'png',
            'construction-token-by-jeff-davis': 'png',
            'cool-cats-nft': 'png',
            'cryptoadz-by-gremplin': 'png',
            'cryptodickbutts-s3': 'png',
            'cryptopunks': 'png',
            'cyberbrokers': 'svg',
            'cyberkongz': 'gif',
            'deafbeef': 'jpg',
            'digidaigaku': 'png',
            'doodles-official': 'png',
            'fidenza-by-tyler-hobbs': 'png',
            'goblintownwtf': 'png',
            'meebits': 'jpg',
            'mutant-ape-yacht-club': 'png',
            'nftrees': 'jpg',
            'nouns': 'svg',
            'otherdeed': 'jpg',
            'proof-moonbirds': 'png',
            'ringers-by-dmitri-cherniak': 'png',
            'space-doodles-official': 'png',
            'thecurrency': 'png',
            'veefriends': 'png',
            'world-of-women-nft': 'png'
        }

        return `https://sax-machine-goerli.vercel.app/whitelist/${slug}.${slugToImgFormat[slug as keyof typeof slugToImgFormat]}`
    }

    const getOpenSeaUrl = (slug:string) => {
        return `https://opensea.io/collection/${slug}`
    }

    const getDetailedWhitelist = async () => {
        if(!gs){
            throw new Error("GoblinSaxAPI not found");
        }

        const whitelist = await gs.getWhitelist();
        const whitelist_detailed = []
        for (let collection of whitelist) {
            const collection_detailed_slug = collection.slug;
            const collection_detailed_address = collection.asset_contract;

            const collection_detailed_img_src = getWhitelistImgSrc(collection.slug);
            const collection_detailed_opensea_url = getOpenSeaUrl(collection.slug);
            whitelist_detailed.push({
                slug: collection_detailed_slug,
                asset_contract: collection_detailed_address,
                img_src: collection_detailed_img_src,
                opensea_url: collection_detailed_opensea_url
            })
        }
        return whitelist_detailed;
    }

    const getAssets = async () => {
        if (!signer) {
            throw new Error("Signer not found");
        }

        if(!gs){
            throw new Error("GoblinSaxAPI not found");
        }
        
        const owned_nfts = await fetch(`https://api.opensea.io/api/v1/assets?owner=${signer._address}`);
        const owned_nfts_json = await owned_nfts.json();
        const onwed_assets = owned_nfts_json.assets;
        const whitelist = (await getWhiteList()) as [
            {
                slug: string;
                asset_contract: string;
            }
        ];

        // Find the whitelisted assets that the user owns
        let ownedWhitelist: Array<Asset> = [];

        //extract the slug from the whitelist
        const whitelist_slugs = whitelist.map((collection: any) => {
            return collection.slug;
        });

        //Get list of asset
        for (let asset of onwed_assets) {
            if (whitelist_slugs.includes(asset.collection.slug)) {
                ownedWhitelist.push({
                    imageSrc: asset.image_url,
                    collectionName: asset.collection.slug,
                    assetId: asset.token_id,
                    assetPrice: 0,
                    assetAddress: asset.asset_contract.address,
                    openseaPermaLink: asset.permalink,
                });
            }
        }

        return ownedWhitelist;
    };

    const getLoanTerms = async (asset: Asset) => {
        if(!gs){
            throw new Error("GoblinSaxAPI not found");
        }

        try {
            let terms = (await gs.getTerms(asset.assetAddress, asset.assetId)) as LoanTermsResponse;
            let offers = terms.offers as Offers;
            let valuation = Number(ethers.utils.formatEther(terms.price as string));

            const url = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
            const etherToUSD = await fetch(url);
            const etherToUSD_json = await etherToUSD.json();
            const etherToUSD_value = etherToUSD_json.USD;

            const return_loan_terms: LoanTerms = {
                loanDurations: [], 
                loanAmounts: [], 
                estimateInterest: 0, 
                repaymentAmount: 0, 
                valuation: valuation, 
                valuationInUSD: valuation * etherToUSD_value, 
                repaymentAmountDict: {},
                loanAmountDict: {}, 
                APRdict: {}, 
                offerDict: {},
            };

            for (let duration in offers) {
                const durationInt = parseInt(duration);
                return_loan_terms.loanDurations.push(durationInt);
                const termDetail = offers[duration];
                for (let term of termDetail) {
                    const loanPrincipal = Number(ethers.utils.formatEther(term.loanPrincipal as string));
                    if (!return_loan_terms.loanAmountDict) {
                        return_loan_terms.loanAmountDict = {};
                    }
                    if (!return_loan_terms.loanAmountDict[durationInt]) {
                        return_loan_terms.loanAmountDict[durationInt] = [];
                    }

                    return_loan_terms.loanAmountDict[durationInt].push(loanPrincipal);

                    if (!return_loan_terms.repaymentAmountDict) {
                        return_loan_terms.repaymentAmountDict = {};
                    }
                    if (!return_loan_terms.repaymentAmountDict[durationInt]) {
                        return_loan_terms.repaymentAmountDict[durationInt] = {};
                    }

                    return_loan_terms.repaymentAmountDict[durationInt][loanPrincipal] = Number(
                        ethers.utils.formatEther(term.loanRepayment as string)
                    );

                    if (!return_loan_terms.APRdict) {
                        return_loan_terms.APRdict = {};
                    }
                    if (!return_loan_terms.APRdict[durationInt]) {
                        return_loan_terms.APRdict[durationInt] = {};
                    }

                    return_loan_terms.APRdict[durationInt][loanPrincipal] = term.APR;

                    if (!return_loan_terms.offerDict) {
                        return_loan_terms.offerDict = {};
                    }
                    if (!return_loan_terms.offerDict[durationInt]) {
                        return_loan_terms.offerDict[durationInt] = {};
                    }

                    return_loan_terms.offerDict[durationInt][loanPrincipal] = term;
                }
            }
            if (!return_loan_terms.loanAmountDict) {
                throw new Error("No loan terms found");
            }

            if (return_loan_terms.loanDurations.length > 0 && return_loan_terms.loanAmountDict[return_loan_terms.loanDurations[0]].length > 0) {
                return_loan_terms.loanAmounts = return_loan_terms.loanAmountDict[return_loan_terms.loanDurations[0]];
            }

            return return_loan_terms;
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const getApprovalStatus = async (asset: Asset, settlementLayer?: "NFTFI" | "ARCADE") => {
        if(!gs){
            throw new Error("GoblinSaxAPI not found");
        }

        const approved = await gs.checkApprovedNFT(asset.assetAddress);
        return approved;
    };

    const approveAssetViaSDK = async (asset: Asset, settlementLayer?: "NFTFI" | "ARCADE") => {
        if(!gs){
            throw new Error("GoblinSaxAPI not found");
        }

        try {
            const tx = await gs.approveSpendingNFT(asset.assetAddress);
            const receipt = await tx.wait();
            return receipt;
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const getLoan = async (asset: Asset, loanTerms: LoanTerms, selectLoanTerm: SelectedLoanTerm, settlementLayer?: "NFTFI" | "ARCADE") => {
        if (!signer) {
            throw new Error("Signer not found");
        }

        if(!gs){
            throw new Error("GoblinSaxAPI not found");
        }

        if (!loanTerms.APRdict) throw new Error("No APR dict found");
        if (!selectLoanTerm.loanDuration) throw new Error("No loan duration found");
        if (!selectLoanTerm.loanAmount) throw new Error("No loan amount found");
        if (!loanTerms.offerDict) throw new Error("No offer dict found");
        const collection = asset.assetAddress;
        const duration = selectLoanTerm.loanDuration.toString();

        const principal = loanTerms.offerDict[selectLoanTerm.loanDuration][selectLoanTerm.loanAmount].loanPrincipal as string;

        const assetId = asset.assetId;
        const borrowerAddress = await signer.getAddress();

        const apr = loanTerms.offerDict[selectLoanTerm.loanDuration][selectLoanTerm.loanAmount].APR;
        // console.log({
        //     collection,
        //     assetId,
        //     duration,
        //     borrowerAddress,
        //     principal,
        //     apr,
        // });

        try {
            // console.log("begin loan");
            const tx = await gs.beginLoan(collection, assetId, duration, borrowerAddress, principal, apr);
            // console.log("Got tx");
            const receipt = await tx.wait();
            // console.log("Got receipt");
            // console.log(receipt);
            return receipt;
        } catch (e) {
            throw e;
        }
    };

    return {
        getWhiteList,
        getAssets,
        getLoanTerms,
        getApprovalStatus,
        approveAssetViaSDK,
        getLoan,
        getDetailedWhitelist
    };
};

export default goblinSaxSDK;
