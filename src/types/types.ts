import {ethers} from "ethers";

export interface Theme {
    size: string;
    mainColor: string;
    lightOrDark: string;
}

export interface Platte{
    foregroundColor: string;
    backgroundColor: string;
    actionColor: string;
    buttonTextColor: string;
    inactiveColor: string;
    cardColor: string;
    errorColor: string;
    successColor: string;
    borederColor: string;
}

export interface Asset {
    imageSrc: string;
    collectionName : string;
    assetId: string;
    assetPrice: number;
    assetAddress: string;
    openseaPermaLink: string;
}

export interface LoanTerms {
    loanDurations: Array<number>;
    loanAmounts: Array<number>;
    estimateInterest: number;
    repaymentAmount: number;
    repaymentAmountDict?:  {
        [loanDuration: number]: {
            [loanAmount: number]: number;
        }
    };
    loanAmountDict?: {
        [loanDuration: number]: number[];
    }
    valuation: number;
    valuationInUSD: number;
    APRdict?: {
        [loanDuration: number]: {
            [loanAmount: number]: number;
        };
    };
    offerDict?: {
        [loanDuration: number]: {
            [loanAmount: number]: Term;
        };
    }
}

export interface SelectedLoanTerm{
    loanDuration: number | null;
    loanAmount: number | null;

}

export interface LoanTermsResponse {
    offers: Offers;
    price: number | string;
    maxLoan: number
}

export interface Offers {
    [loanDuration: string]: [
        term: Term
    ];
}

export interface Term {
    LTV: number;
    APR: number;
    FEE: number | string;
    loanPrincipal: number | string;
    loanRepayment: number | string;
}

export interface IGSSDK{
    getWhiteList: () => Promise<{
        slug: string;
        asset_contract: string;
    }[]>;
    getAssets: () => Promise<Asset[]>;
    getLoanTerms: (asset: Asset) => Promise<LoanTerms>;
    approveAssetViaSDK: (asset: Asset, settlementLayer?: "NFTFI" | "ARCADE") => Promise<ethers.ContractReceipt>;
    getApprovalStatus: (asset: Asset, settlementLayer?: "NFTFI" | "ARCADE") => Promise<Boolean>;
    getLoan: (asset: Asset, loanTerms: LoanTerms, selectLoanTerm: SelectedLoanTerm, settlementLayer?: "NFTFI" | "ARCADE") => Promise<ethers.ContractReceipt>;
    getDetailedWhitelist: () => Promise<WhitelistDetailed[]>;
}

export interface WhitelistDetailed{
    slug: string;
    asset_contract: string;
    img_src: string;
    opensea_url: string;
}
