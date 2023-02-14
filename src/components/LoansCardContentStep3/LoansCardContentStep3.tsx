import { Box, Typography, CircularProgress, Chip, Button } from "@mui/material";
import { useState, useEffect, useLayoutEffect } from "react";
import styled from "@mui/material/styles/styled";
import {Asset} from "src/types/types";

const StyledSpan = styled("span")(({ theme }) => ({
    color: theme.palette.primary.main,
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

interface LoansCardContentStep3Props {
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
    },
    loansWidgetApprovalStates:{
        assetApproval: boolean,
        loading: boolean,
        approving: boolean,
        approveAsset: (asset:Asset) => void,
        error : {
            network: boolean,
            transaction: boolean,
        },
        setError: (error: { network: boolean, transaction: boolean }) => void,
        getAndSetLoanWidgetApproval : (asset:Asset) => void,
    },
    loansWidgetAssetStates: {
        selectedAsset: Asset | null;
    }
}

const LoansCardContentStep3 = ({ handleButtons,loansWidgetApprovalStates,loansWidgetAssetStates }: LoansCardContentStep3Props) => {
    const { assetApproval, loading:assetApprovalLoading, approving, approveAsset, getAndSetLoanWidgetApproval, error, setError } = loansWidgetApprovalStates;
    const { selectedAsset } = loansWidgetAssetStates;

    useEffect(() => {
        handleButtons.showNextButton();
        handleButtons.showPrevButton();
        handleButtons.enableNextButton();
        handleButtons.enablePrevButton();

        if(assetApprovalLoading || error.network){
            handleButtons.hideNextButton();
            handleButtons.hidePrevButton();
            return;
        }

        if(approving){
            handleButtons.disablePrevButton();
            handleButtons.showNextButton();
            handleButtons.showPrevButton();
            return;
        }

        if (!assetApproval) {
            handleButtons.showNextButton();
            handleButtons.disableNextButton();
            handleButtons.showPrevButton();
            handleButtons.enablePrevButton();
            return;
        } 
    }, [assetApproval, handleButtons, assetApprovalLoading, error.network, approving]);

    useLayoutEffect(() => {
        async function getandSetAssetApproval() {
            if(selectedAsset === null) return;
            await getAndSetLoanWidgetApproval(selectedAsset);
        }
        getandSetAssetApproval();
    }, [getAndSetLoanWidgetApproval]);

        

    if (assetApprovalLoading) {
        return (
            <Box
                id="loanCardContentStep3LoadingBox"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                }}
            >
                <CircularProgress id="loanCardContentStep3LoadingCircularProgress" size={100} />
            </Box>
        );
    }

    if (error.network) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                }}
            >
                <Button
                    variant="contained"
                    onClick={async () => {
                        setError({
                            ...error,
                            network: false,
                        });
                        if(selectedAsset === null) return;
                        await getAndSetLoanWidgetApproval(selectedAsset);
                    }}
                    sx={{
                        display: "flex",
                        p: 1
                    }}
                >
                    <Typography variant="h1">Refresh</Typography>
                </Button>
            </Box>
        );
    }

    const failedApproval = (
        <>
            <Box
                id="loansCardContentStep3AssetApprovalDetailsBox"
                sx={{ display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap", alignItems: "center" }}
            >

                <Typography variant="h2" sx={{ whiteSpace: "pre-wrap" }}>
                    Please first approve<StyledSpan style={{ color: "primary.main", textTransform:'capitalize' }}> {selectedAsset?.collectionName} </StyledSpan>
                    collection with your wallet to continue the loan process.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                }}
            >
                <Typography variant="subtitle1">
                    You just need to approve this collection once! After this approval, the next loans with this collection are already set to go.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        padding: 1.3,
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                    }}
                    color="primary"
                    disabled={approving}
                    onClick={() => {
                        if(selectedAsset === null) return;
                        approveAsset(selectedAsset);
                    }}
                >
                    {approving ? (
                        <>
                            <StyledApprveCircularProgress />
                            <StyledLoadingButtonTypography variant="h2">Approving</StyledLoadingButtonTypography>
                        </>
                    ) : (
                        <Typography variant="h2">Approve Asset</Typography>
                    )}
                </Button>
            </Box>
        </>
    );

    const successApproval = (
        <Box>
            <Typography variant="h2">The asset is approved, please proceed to the next page to accept loan offer.</Typography>
        </Box>
    );

    return (
        <>
            <Box
                id="loansCardContentStep3"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    padding: 0.5,
                }}
            >
                <Box id="loansCardContentStep3AssetApprovalBox" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography id="loansCardContentStep3AssetApprovalTypography" variant="h2">
                        Asset Approval
                    </Typography>
                    {assetApproval ? (
                        <Chip
                            id="loansCardContentStep3AssetApprovalSuccessChip"
                            label="Approved"
                            sx={{
                                backgroundColor: "success.main",
                                borderRadius: 1,
                                "&:hover": {
                                    backgroundColor: "success.main",
                                },
                            }}
                            clickable={false}
                        />
                    ) : (
                        <Chip
                            id="loansCardContentStep3AssetApprovalFailedChip"
                            label="Not Approved"
                            sx={{
                                backgroundColor: "error.main",
                                borderRadius: 1,
                                "&:hover": {
                                    backgroundColor: "error.main",
                                },
                            }}
                        />
                    )}
                </Box>

                {assetApproval ? successApproval : failedApproval}
            </Box>
        </>
    );
};

export default LoansCardContentStep3;
