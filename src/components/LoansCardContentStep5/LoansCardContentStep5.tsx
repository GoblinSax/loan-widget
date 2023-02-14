import { Box, Typography, Button, styled } from "@mui/material";
import { useEffect } from "react";
import { ContractReceipt } from "ethers";

interface LoansCardContentStep5Props {
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
    loansWidgetGetLoanStates:{
        transaction : ContractReceipt | null
    }

}

const StyledAnchor = styled("a")(({ theme }) => ({
    color: theme.palette.text.primary,
    textDecoration: "none",
}));

const LoansCardContentStep5 = ({ handleButtons,loansWidgetGetLoanStates }: LoansCardContentStep5Props) => {
    const receipt = loansWidgetGetLoanStates.transaction;

    useEffect(() => {
        handleButtons.hidePrevButton();
        handleButtons.disablePrevButton();
        handleButtons.disableNextButton();
        handleButtons.hideNextButton();
    }, [handleButtons])

    return(
        <Box
            id="loansCardContentStep5"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                padding: 0.5,
            }}
        >
            <Box
                id="loansCardContentStep5Title"
            >
                <Typography variant="h1" color="primary.light">Congratulations! 🎉</Typography>
            </Box>
            <Box
                id="loansCardContentStep5Subtitle"
            >
                <Typography variant="h2">You have successfully applied for a loan!</Typography>
            </Box>
            <Box
                id="loansCardContentStep5EtherscanLink"
            >
                <StyledAnchor href={`https://etherscan.io/tx/${receipt?.transactionHash}`} target="_blank" rel="noreferrer">
                    <Typography variant="body2" sx={{textDecoration:'underline'}}>View your transaction on Etherscan</Typography>
                </StyledAnchor>
            </Box>
            <Box
                id="loansCardContentStep5RepayLoan"
            >
                <StyledAnchor href={`https://loans.goblinsax.xyz/`} target="_blank" rel="noreferrer">
                    <Typography variant="body2" sx={{textDecoration:'underline'}}>Repay your loan in the Instant Loan App from GS</Typography>
                </StyledAnchor>
            </Box>
            <Box
                id="loansCardContentStep5GetAnotherLoanButton"
            >
                <Button variant="contained" color="primary" onClick={() => {handleButtons.handleReset()}} sx={{
                    paddingX: 2,
                    paddingY: 1
                }}>
                    Get another loan
                </Button>
            </Box>

        </Box>
    )
}

export default LoansCardContentStep5;
