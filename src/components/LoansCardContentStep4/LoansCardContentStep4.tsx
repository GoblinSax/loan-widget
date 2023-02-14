import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useState, useEffect, useLayoutEffect } from "react";
import { styled } from "@mui/material/styles";
import useLoanWidgetLoanTerms from "src/hooks/useLoansWidgetLoanTerms";
import useLoanWidgetAssets from "src/hooks/useLoansWidgetAssets";
import { Asset, LoanTerms, SelectedLoanTerm} from "src/types/types";

const StyledGetLoanButton = styled(Button)(({ theme }) => ({
    width: "100%",
    height: theme.spacing(5),
    marginBottom: theme.spacing(3),
}));

const StyledLoadingButtonTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.grey[900],
}));

const StyledApprveCircularProgress = styled(CircularProgress)(({ theme }) => ({
    color: theme.palette.grey[900],
    width:
        (theme.currentSize === "xs" ? "1.25rem" : theme.currentSize === "sm" ? "1.5rem" : theme.currentSize === "md" ? "1.75rem" : "2rem") +
        " !important",
    height:
        (theme.currentSize === "xs" ? "1.25rem" : theme.currentSize === "sm" ? "1.5rem" : theme.currentSize === "md" ? "1.75rem" : "2rem") +
        " !important",
}));

interface LoansCardContentStep4Props {
    handleButtons: {
        disableNextButton: () => void;
        enableNextButton: () => void;
        disablePrevButton: () => void;
        enablePrevButton: () => void;
        hidePrevButton: () => void;
        showPrevButton: () => void;
        hideNextButton: () => void;
        showNextButton: () => void;
        handleNext: () => void;
        handleBack: () => void;
        handleReset: () => void;
        handleTransactionFailedSnackbarClose: () => void;
        handleTransactionFailedSnackbarOpen: () => void;
    };
    loansWidgetAssetStates: {
        assets: Asset[];
        selectedAsset: Asset | null;
    };
    loansWidgetLoanTermStates: {
        loanTerms: LoanTerms;
        selectedLoanTerm: SelectedLoanTerm;
        settlementLayer: "NFTFI" | "ARCADE";
    };
    loansWidgetGetLoanStates: {
        transactionLoading : boolean; 
        getAndSetTransaction : (asset:Asset, loanTerms:LoanTerms, selectedLoanTerm:SelectedLoanTerm)=> Promise<void>;
        transaction: any;
        resetEverything: () => void;
    }
}

const LoansCardContentStep4 = ({ handleButtons,loansWidgetAssetStates,loansWidgetLoanTermStates,loansWidgetGetLoanStates }: LoansCardContentStep4Props) => {
    
    const { selectedAsset } = loansWidgetAssetStates;
    const { loanTerms, selectedLoanTerm, settlementLayer } = loansWidgetLoanTermStates;
    const {transactionLoading, getAndSetTransaction, transaction, resetEverything} = loansWidgetGetLoanStates;

    const getLoan = async  () => {
        if(selectedAsset && loanTerms && selectedLoanTerm){
            await getAndSetTransaction(selectedAsset,loanTerms,selectedLoanTerm);
        }
    };

    useEffect(()=>{
        handleButtons.hideNextButton();
        handleButtons.disableNextButton();
        handleButtons.showPrevButton();
        handleButtons.enablePrevButton();

        if(transactionLoading){
            handleButtons.showPrevButton();
            handleButtons.disablePrevButton();
            return;
        }


        if(transaction){
            handleButtons.handleNext();
        }

    },[transaction,handleButtons,transactionLoading])

    useEffect(()=>{
        resetEverything();
    },[])

    return (
        <Box
            id="loansCardContentStep4"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                padding: 0.5,
            }}
        >
            <Box id="loansCardContentStep4AssetImageBox" sx={{ display: "flex", flexDirection: "column" }}>
                <Box id="loansCardContentStep4AssetImageLabelBox" sx={{ display: "flex" }}>
                    <Typography id="loansCardContentStep4AssetImageLabelTypography" variant="body1">
                        Asset Image
                    </Typography>
                </Box>

                <Box id="loansCardContentStep4AssetImageValueBox" sx={{ display: "flex", width: "70%", borderRadius: (theme) => theme.spacing(1), aspectRatio:'1/1'}}>
                    <Box
                        component="img"
                        id="loansCardContentStep4AssetImageValueImg"
                        src={selectedAsset?.imageSrc}
                        alt="Loan NFT Image"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: (theme) => theme.spacing(1),
                        }}
                    ></Box>
                </Box>
            </Box>

            <Box id="loansCardContentStep4AssetLoanAndIDBox" sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                    id="loansCardContentStep4AssetLoanAndIDLabelBox"
                    sx={{
                        display: "flex",
                    }}
                >
                    <Typography id="loansCardContentStep4AssetLoanAndIDLabelTypography" variant="body1">
                        Asset Name and ID
                    </Typography>
                </Box>

                <Box
                    id="loansCardContentStep4AssetLoanAndIDValueBox"
                    sx={{
                        display: "flex",
                    }}
                >
                    <Typography id="loansCardContentStep4AssetLoanAndIDValueTypography" variant="h2" sx={{textTransform:'capitalize'}}>
                        {
                            selectedAsset?.collectionName && selectedAsset?.assetId ? (
                                selectedAsset?.collectionName + " #" + selectedAsset?.assetId
                            )
                            :
                                'N/A'
                        }
                    </Typography>
                </Box>
            </Box>

            <Box id="loansCardContentStep4SettlementLayer" sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                    id="loansCardContentStep4SettlementLayerLabelBox"
                    sx={{
                        display: "flex",
                    }}
                >
                    <Typography id="loansCardContentStep4SettlementLayerLabelTypography" variant="body1">
                        Settlement Layer
                    </Typography>
                </Box>

                <Box
                    id="loansCardContentStep4SettlementLayerValueBox"
                    sx={{
                        display: "flex",
                    }}
                >
                    <Typography id="loansCardContentStep4SettlementLayerValueTypography" variant="h2">
                        {settlementLayer ? settlementLayer : 'N/A'}
                    </Typography>
                </Box>
            </Box>

            <Box id="loansCardContentStep4DetailGridBox" sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box
                    id="loansCardContentStep4LoanDurationBox"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box id="loansCardContentStep4LoanDurationLabelBox">
                        <Typography id="loansCardContentStep4LoanDurationLabelTypography" variant="body1">
                            Loan Duration
                        </Typography>
                    </Box>

                    <Box id="loansCardContentStep4LoanDurationValueBox">
                        <Typography id="loansCardContentStep4LoanDurationValueTypography" variant="h2">
                            {selectedLoanTerm?.loanDuration ? selectedLoanTerm?.loanDuration : 'N/A'} Days
                        </Typography>
                    </Box>
                </Box>

                <Box
                    id="loansCardContentStep4LoanAmountBox"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box id="loansCardContentStep4LoanAmountLabelBox">
                        <Typography id="loansCardContentStep4LoanAmountLabelTypography" variant="body1">
                            Loan Amount
                        </Typography>
                    </Box>
                    <Box id="loansCardContentStep4LoanAmountValueBox">
                        <Typography id="loansCardContentStep4LoanAmountValueTypography" variant="h2">
                            {selectedLoanTerm?.loanAmount ? Number(Number(selectedLoanTerm?.loanAmount).toFixed(4)) : 'N/A'} ETH
                        </Typography>
                    </Box>
                </Box>

                <Box
                    id="loansCardContentStep4EstimateInterest"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box id="loansCardContentStep4EstimateInterestLabelBox">
                        <Typography id="loansCardContentStep4EstimateInterestLabelTypography" variant="body1">
                            Estimated Interest
                        </Typography>
                    </Box>

                    <Box id="loansCardContentStep4EstimateInterestValueBox">
                        <Typography id="loansCardContentStep4EstimateInterestValueTypography" variant="h2">
                        {loanTerms?.estimateInterest ? Number(loanTerms?.estimateInterest * 100).toFixed(4) : 'N/A'} %
                        </Typography>
                    </Box>
                </Box>

                <Box
                    id="loansCardContentStep4RepaymentAmountBox"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box id="loansCardContentStep4RepaymentAmountLabelBox">
                        <Typography id="loansCardContentStep4RepaymentAmountLabelTypography" variant="body1">
                            Repayment Amount
                        </Typography>
                    </Box>

                    <Box id="loansCardContentStep4RepaymentAmountValueBox">
                        <Typography id="loansCardContentStep4RepaymentAmountValueTypography" variant="h2" color="primary" fontWeight={900}>
                        {loanTerms?.repaymentAmount ? Number(loanTerms?.repaymentAmount).toFixed(4) : 'N/A'} ETH
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box id="loansCardContentStep4ButtonBox" sx={{ display: "flex", width: "100%" }}>
                <StyledGetLoanButton
                    id="loansCardContentStep4Button"
                    variant="contained"
                    color="primary"
                    onClick={getLoan}
                    disabled={transactionLoading}
                    sx={{ padding: 1.3, alignItems: "center", gap: 2, width: "100%" }}
                >
                    {transactionLoading ? (
                        <>
                            <StyledApprveCircularProgress />
                            <StyledLoadingButtonTypography variant="h2">Getting Loan</StyledLoadingButtonTypography>
                        </>
                    ) : (
                        <Typography variant="h2">Get Loan</Typography>
                    )}
                </StyledGetLoanButton>
            </Box>
        </Box>
    );
};

export default LoansCardContentStep4;
