import { Box, Typography, CircularProgress, Select, MenuItem, Chip, Button } from "@mui/material";
import { useState, useEffect } from "react";
import styled from "@mui/material/styles/styled";
import useLoanWidgetLoanTerms from "src/hooks/useLoansWidgetLoanTerms";
import { LoanTerms } from "src/types/types";
import { Asset } from "src/types/types";

interface LoansCardContentStep2Props {
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
    loansWidgetLoanTermStates: {
        loanTerms: LoanTerms;
        loading: boolean;
        selectedLoanTerm: {
            loanDuration: number | null;
            loanAmount: number | null;
        };
        setSelectedLoanTerm: (loanTerm: { loanDuration: number | null; loanAmount: number | null }) => void;
        settlementLayer: "NFTFI" | "ARCADE";
        setSettlementLayer: (settlementLayer: "NFTFI" | "ARCADE") => void;
        error: {
            network: boolean;
        };
        setError: (error: { network: boolean }) => void;
        getAndSetLoansWidgetLoanTerms: (asset: Asset) => Promise<void>;
    };
    loansWidgetAssetStates: {
        selectedAsset: Asset | null;
        setSelectedAsset: (asset: Asset | null) => void;
    };
}

const ChipBox = styled(Box)(({ theme }) => {
    return {
        display: "flex",
        gap: theme.spacing(1),
        overflowX: "auto",
        paddingBottom: theme.spacing(1),
        "&::-webkit-scrollbar": {
            width: "0.4em",
            height: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
            WebkitBoxShadow: "inset 0 0 0px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "10px",
        },
    };
});

const StyledAnchor = styled("a")(({ theme }) => ({
    color: theme.palette.text.primary,
    textDecoration: "none",
}));


const LoansCardContentStep2 = ({ handleButtons, loansWidgetLoanTermStates, loansWidgetAssetStates }: LoansCardContentStep2Props) => {
    const [useHorizontalScroll, setUseHorizontalScroll] = useState(false);

    const {
        loanTerms,
        loading: loanTermsLoading,
        selectedLoanTerm,
        setSelectedLoanTerm,
        settlementLayer,
        setSettlementLayer,
        error,
        setError,
        getAndSetLoansWidgetLoanTerms,
    } = loansWidgetLoanTermStates;
    const { selectedAsset } = loansWidgetAssetStates;

    useEffect(() => {
        handleButtons.showNextButton();
        handleButtons.showPrevButton();
        handleButtons.enableNextButton();
        handleButtons.enablePrevButton();

        if (loanTermsLoading || error.network) {
            handleButtons.hideNextButton();
            handleButtons.hidePrevButton();
            return;
        }

        if (selectedLoanTerm.loanAmount === null || selectedLoanTerm.loanDuration === null) {
            handleButtons.showNextButton();
            handleButtons.disableNextButton();
            handleButtons.showPrevButton();
            handleButtons.enablePrevButton();
            return;
        }
    }, [selectedLoanTerm, handleButtons, loanTermsLoading, error.network]);

    useEffect(() => {
        async function getandSetLoanTerms() {
            if (selectedAsset) {
                await getAndSetLoansWidgetLoanTerms(selectedAsset);
            }
        }
        getandSetLoanTerms();
    }, [getAndSetLoansWidgetLoanTerms, selectedAsset]);

    if (loanTermsLoading) {
        return (
            <Box
                id="loanCardContentStep2LoadingBox"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                }}
            >
                <CircularProgress id="loanCardContentStep2LoadingCircularProgress" size={100} />
            </Box>
        );
    } else if (error.network) {
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
                            network: false,
                        });
                        if (selectedAsset) await getAndSetLoansWidgetLoanTerms(selectedAsset);
                    }}
                    sx={{
                        display: "flex",
                        p: 1,
                    }}
                >
                    <Typography variant="h1">Refresh</Typography>
                </Button>
            </Box>
        );
    }

    return (
        <Box
            id="loanCardContentStep2"
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "100%",
                gap: 2,
                overflowX: "hidden",
                padding: 0.5,
                "&::-webkit-scrollbar": {
                    width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                    WebkitBoxShadow: "inset 0 0 0px rgba(0,0,0,0)",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "primary.main",
                    borderRadius: "10px",
                },
                overflowY: "auto",
            }}
        >
            <Box
                id="loansCardContentStep2AssetBox"
                sx={{
                    display: "flex",
                    flexDirection: (theme) => {
                        return theme.currentSize == "xs" ? "column" : "row";
                    },
                    width: "100%",
                    gap: 2,
                }}
            >
                <Box
                    id="loansCardContentStep2AssetImageBox"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: (theme) => {
                            return theme.currentSize == "xs" ? "100%" : "50%";
                        },
                    }}
                >
                    <Box id="loansCardContentStep2AssetImageLabelBox" sx={{ display: "flex" }}>
                        <Typography id="loansCardContentStep2AssetImageLabelTypography" variant="body1">
                            Asset Image
                        </Typography>
                    </Box>

                    <Box
                        id="loansCardContentStep2AssetImageValueBox"
                        sx={{
                            display: "flex",
                            aspectRatio: "1/1",
                            width: (theme) => {
                                return theme.currentSize == "xs" ? "70%" : "100%";
                            },
                        }}
                    >
                        <Box
                            component="img"
                            id="loansCardContentStep2AssetImageValueImg"
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

                <Box
                    id="loansCardContentStep2DetailsColumnBox"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: (theme) => {
                            return theme.currentSize == "xs" ? "100%" : "50%";
                        },
                    }}
                >
                    <Box
                        id="loanCardContentStep2AssetNameAndIdBox"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box id="loanCardContentStep2AssetNameAndIdLabelBox">
                            <Typography id="loanCardContentStep2AssetNameAndIdLabel" variant="body2">
                                Asset Name and ID
                            </Typography>
                        </Box>
                        <Box id="loanCardContentStep2AssetNameAndIdValueBox">
                            <Typography
                                id="loanCardContentStep2AssetValuationValue"
                                variant="h2"
                                color="text.main"
                                sx={{ textTransform: "capitalize" }}
                            >
                                {`${selectedAsset?.collectionName} #${selectedAsset?.assetId}`}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        id="loanCardContentStep2AssetValuationInEthBox"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box id="loanCardContentStep2AssetValuationInEthLabelBox">
                            <Typography id="loanCardContentStep2AssetValuationLabel" variant="body2">
                                Asset Valuation (ETH)
                            </Typography>
                        </Box>
                        <Box id="loanCardContentStep2AssetValuationInEthValueBox">
                            <Typography id="loanCardContentStep2AssetValuationValueInEth" variant="h2" color="text.main">
                                {loanTerms?.valuation ? Number(Number(loanTerms?.valuation).toFixed(4)) : "N/A"} ETH
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        id="loanCardContentStep2AssetValuationInUSD"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box id="loanCardContentStep2AssetValuationInUSDLabelBox">
                            <Typography id="loanCardContentStep2AssetValuationLabel" variant="body2">
                                Asset Valuation (USD)
                            </Typography>
                        </Box>
                        <Box id="loanCardContentStep2AssetValuationValueInUSDBox">
                            <Typography id="loanCardContentStep2AssetValuationValueInUSD" variant="h2" color="text.main">
                                $ {loanTerms?.valuationInUSD ? Number(Number(loanTerms?.valuationInUSD).toFixed(4)) : "N/A"}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        id="loanCardContentStep2AssetLinksBox"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box id="loanCardContentStep2AssetLinksLabelBox">
                            <Typography id="loanCardContentStep2AssetLinksLabel" variant="body2">
                                Asset Links
                            </Typography>
                        </Box>
                        <Box
                            id="loanCardContentStep2AssetLinksValueBox"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            <StyledAnchor href={selectedAsset?.openseaPermaLink} target="_blank" rel="noreferrer">
                                <Typography
                                    id="loanCardContentStep2AssetLinksValue"
                                    variant="h2"
                                    color="text.main"
                                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                                >
                                    OpenSea
                                </Typography>
                            </StyledAnchor>

                            <StyledAnchor href={`https://etherscan.io/address/${selectedAsset?.assetAddress}`} target="_blank" rel="noreferrer">
                                <Typography
                                    id="loanCardContentStep2AssetLinksValue"
                                    variant="h2"
                                    color="text.main"
                                    sx={{ textDecoration: "underline" }}
                                >
                                    Etherscan
                                </Typography>
                            </StyledAnchor>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box
                id="loanCardContentStep2SettlementLayerBox"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    id="loanCardContentStep2SettlementLayerLabelBox"
                    sx={{
                        display: "flex",
                    }}
                >
                    <Typography id="loanCardContentStep2SettlementLayerLabel" variant="body2">
                        Settlement Layer
                    </Typography>
                </Box>

                <Box
                    id="loanCardContentStep2SettlementLayerSelectBox"
                    sx={{
                        display: "flex",
                    }}
                >
                    <Select
                        id="loanCardContentStep2SettlementLayerSelect"
                        value={settlementLayer}
                        onChange={(e) => {
                            setSettlementLayer(e.target.value as "ARCADE" | "NFTFI");
                        }}
                        fullWidth
                        sx={{
                            "& .MuiSelect-select": {
                                color: "text.primary",
                                paddingBottom: 1,
                                paddingTop: 1.6,
                                paddingLeft: 1,
                                typography: "h3",
                            },
                        }}
                    >
                        <MenuItem value={"ARCADE"} disabled>
                            ARCADE
                        </MenuItem>
                        <MenuItem value={"NFTFI"}>NFTFI</MenuItem>
                    </Select>
                </Box>
            </Box>

            <Box
                id="loanCardContentStep2LoanDurationBox"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 0,
                    mt: 1,
                }}
            >
                <Box
                    id="loanCardContentStep2LoanDurationLabelBox"
                    sx={{
                        display: "flex",
                    }}
                >
                    <Typography id="loanCardContentStep2LoanDurationLabel" variant="body2">
                        Loan Duration
                    </Typography>
                </Box>
                <ChipBox
                    id="loanCardContentStep2LoanDurationChipsBox"
                    sx={{
                        flexWrap: useHorizontalScroll ? "nowrap" : "wrap",
                    }}
                >
                    {loanTerms.loanDurations.map((loanDuration, index) => {
                        return (
                            <Chip
                                key={index}
                                className="loanCardContentStep2LoanDurationChhip"
                                label={`${loanDuration} Days`}
                                variant={"filled"}
                                sx={{
                                    backgroundColor: selectedLoanTerm.loanDuration === loanDuration ? "primary.main" : "action.disabledBackground",
                                }}
                                onClick={(e) => {
                                    setSelectedLoanTerm({
                                        ...selectedLoanTerm,
                                        loanDuration: loanDuration,
                                    });
                                }}
                            />
                        );
                    })}
                </ChipBox>
            </Box>

            <Box
                id="loanCardContentStep2LoanAmountBox"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    id="loanCardContentStep2LoanAmountLabelBox"
                    sx={{
                        display: "flex",
                    }}
                >
                    <Typography id="loanCardContentStep2LoanAmountLabel" variant="body2">
                        Loan Amount
                    </Typography>
                </Box>
                <ChipBox id="loanCardContentStep2LoanAmountChipsBox" sx={{ flexWrap: useHorizontalScroll ? "nowrap" : "wrap" }}>
                    {loanTerms.loanAmounts.map((loanAmount, index) => {
                        return (
                            <Chip
                                key={index}
                                className="loanCardContentStep2LoanAmountChhip"
                                label={`${Number(loanAmount.toFixed(4))} ETH`}
                                variant={"filled"}
                                sx={{
                                    backgroundColor: selectedLoanTerm.loanAmount === loanAmount ? "primary.main" : "action.disabledBackground",
                                }}
                                onClick={(e) => {
                                    setSelectedLoanTerm({
                                        ...selectedLoanTerm,
                                        loanAmount: loanAmount,
                                    });
                                }}
                            />
                        );
                    })}
                </ChipBox>
            </Box>

            <Box
                id="loanCardContentStep2EstimateInterestAndRepaymentAmountBox"
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    gap: 2,
                }}
            >
                <Box
                    id="loanCardContentStep2EstimateInterestBox"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box id="loanCardContentStep2EstimateInterestLabelBox">
                        <Typography variant="body2">Estimate Interest (ES)</Typography>
                    </Box>
                    <Box id="loanCardContentStep2EstimateInterestValueBox">
                        <Typography variant="h1" color="primary.main">
                            {loanTerms?.estimateInterest ? Number(loanTerms?.estimateInterest * 100).toFixed(4) : "N/A"} %
                        </Typography>
                    </Box>
                </Box>

                <Box
                    id="loanCardContentStep2RepaymentAmountBox"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box id="loanCardContentStep2RepaymentAmountLabelBox">
                        <Typography id="loanCardContentStep2RepaymentAmountLabel" variant="body2">
                            Repayment Amount
                        </Typography>
                    </Box>
                    <Box id="loanCardContentStep2RepaymentAmountValueBox">
                        <Typography id="loanCardContentStep2RepaymentAmountValue" variant="h1" color="primary.main">
                            {!Number.isNaN(loanTerms?.repaymentAmount) ? Number(loanTerms?.repaymentAmount).toFixed(4) : "N/A"} ETH
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default LoansCardContentStep2;
