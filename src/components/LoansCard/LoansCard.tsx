//import { Theme, Platte } from "../../types/types";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { useState, useMemo, useCallback, useEffect } from "react";
import LoansCardTransactionFailedSnackbar from "src/components/LoansCardTransactionFailedSnackbar";
import LoansCardNetworkFailedSnackbar from "src/components/LoansCardNetowrkFailedSnackbar";
import LoansCardWhitelistPopup from "../LoansCardWhitelistPopup";

//Card Contents
import LoanCardContentStep1 from "src/components/LoansCardContentStep1";
import LoanCardContentStep2 from "src/components/LoansCardContentStep2";
import LoanCardContentStep3 from "src/components/LoansCardContentStep3";
import LoansCardContentStep4 from "src/components/LoansCardContentStep4";
import LoansCardContentStep5 from "src/components/LoansCardContentStep5";

//Asset states, loan terms states, approval states
import useLoansWidgetAssets from "src/hooks/useLoansWidgetAssets";
import useLoansWidgetLoanTerms from "src/hooks/useLoansWidgetLoanTerms";
import useLoansWidgetApproval from "src/hooks/useLoansWidgetApproval";
import useLoansWidgetGetLoan from "src/hooks/useLoansWidgetGetLoan";
import useLoansWhitelist from "src/hooks/useLoansWidgetWhitelist";

import {IGSSDK} from 'src/types/types';


interface LoansCardProps {
    // theme: Theme;
    // platte: Platte;
    refreshComponent: () => void;
    GSSDK: IGSSDK;
}

const LoansCardBox = styled(Box)(({ theme }) => {
    return {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        height: "100%",
        width: "100%",
        padding: theme.spacing(1),
        borderRadius: theme.spacing(2),
        boxShadow: `0px 4px 10px ${theme.palette.grey[500]}`,
        display: "flex",
        flexDirection: "column",
        minHeight:"590px",
        minWidth:'350px',
        position:'relative'
        // border: `1px solid ${theme.palette.divider}`,
    };
});

const StyledAnchor = styled("a")(({ theme }) => ({
    color: theme.palette.text.primary,
    textDecoration: "none",
}));


const steps = ["Select Asset", "Loan Terms", "Asset Approval", "Accept Loan"];

const LoansCard = ({refreshComponent, GSSDK}: LoansCardProps) => {
    const [prevButtonProperties, setPrevButtonProperties] = useState({
        disabled: true,
        visible: true,
    });

    const [nextButtonProperties, setNextButtonProperties] = useState({
        disabled: false,
        visible: true,
    });

    const [activeStep, setActiveStep] = useState(0);

    const [transactionFailedSnackbarOpen, setTransactionFailedSnackbarOpen] = useState(false);
    const [networkFailedSnackbarOpen, setNetworkFailedSnackbarOpen] = useState(false);
    const [whitelistPopupOpen, setWhitelistPopupOpen] = useState(false);

    // State and setters for the assets
    const loansWidgetAssetStates = useLoansWidgetAssets(GSSDK);

    // State and setters for the loan terms
    const loansWidgetLoanTermStates = useLoansWidgetLoanTerms(GSSDK);

    // State and setters for the approval
    const loansWidgetApprovalStates = useLoansWidgetApproval(GSSDK);

    // State and setters for the get loan
    const loansWidgetGetLoanStates = useLoansWidgetGetLoan(GSSDK);

    // State and setters for the get whitelist
    const loansWidgetGetWhitelistStates = useLoansWhitelist(GSSDK);

    const { error: assetError } = loansWidgetAssetStates;
    const { error: loanTermError } = loansWidgetLoanTermStates;
    const { error: approvalError } = loansWidgetApprovalStates;
    const { error: getLoanError } = loansWidgetGetLoanStates;

    useEffect(() => {
        if (assetError.network || loanTermError.network || approvalError.network) {
            setNetworkFailedSnackbarOpen(true);
            return;
        }
    }, [assetError.network, loanTermError.network, approvalError.network]);

    useEffect(() => {
        if (approvalError.transaction || getLoanError.transaction) {
            setTransactionFailedSnackbarOpen(true);
            return;
        }
    }, [approvalError.transaction, getLoanError.transaction]);

    const handleNetowrkErrors = () => {
        setNetworkFailedSnackbarOpen(false);
    };

    const handleTransactionErrors = () => {
        setTransactionFailedSnackbarOpen(false);
    };

    const showNextButton = useCallback(() => {
        setNextButtonProperties((prev) => {
            return {
                ...prev,
                visible: true,
            };
        });
    }, []);

    const hideNextButton = useCallback(() => {
        setNextButtonProperties((prev) => {
            return {
                ...prev,
                visible: false,
            };
        });
    }, []);

    const showPrevButton = useCallback(() => {
        setPrevButtonProperties((prev) => {
            return {
                ...prev,
                visible: true,
            };
        });
    }, []);

    const hidePrevButton = useCallback(() => {
        setPrevButtonProperties((prev) => {
            return {
                ...prev,
                visible: false,
            };
        });
    }, []);

    const enablePrevButton = useCallback(() => {
        setPrevButtonProperties((prev) => {
            return {
                ...prev,
                disabled: false,
            };
        });
    }, []);

    const disablePrevButton = useCallback(() => {
        setPrevButtonProperties((prev) => {
            return {
                ...prev,
                disabled: true,
            };
        });
    }, []);

    const enableNextButton = useCallback(() => {
        setNextButtonProperties((prev) => {
            return {
                ...prev,
                disabled: false,
            };
        });
    }, []);

    const disableNextButton = useCallback(() => {
        setNextButtonProperties((prev) => {
            return {
                ...prev,
                disabled: true,
            };
        });
    }, []);

    const handleNext = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }, []);

    const handleReset = useCallback(() => {
        refreshComponent();
        setActiveStep(0);
    }, [refreshComponent]);

    const handleTransactionFailedSnackbarClose = useCallback(() => {
        setTransactionFailedSnackbarOpen(false);
    }, []);

    const handleTransactionFailedSnackbarOpen = useCallback(() => {
        setTransactionFailedSnackbarOpen(true);
    }, []);

    const handleButtons = useMemo(() => {
        return {
            disableNextButton,
            enableNextButton,
            disablePrevButton,
            enablePrevButton,
            hidePrevButton,
            showPrevButton,
            hideNextButton,
            showNextButton,
            handleNext,
            handleBack,
            handleReset,
            handleTransactionFailedSnackbarClose,
            handleTransactionFailedSnackbarOpen,
        };
    }, [
        disableNextButton,
        enableNextButton,
        disablePrevButton,
        enablePrevButton,
        hidePrevButton,
        showPrevButton,
        hideNextButton,
        showNextButton,
        handleNext,
        handleBack,
        handleReset,
        handleTransactionFailedSnackbarClose,
        handleTransactionFailedSnackbarOpen,
    ]);

    return (
        <LoansCardBox>

            <Box
                id="loansCardTitle"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h1">Sax Loan</Typography>
            </Box>

            <Box
                id="loansCardStepper"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                }}
            >
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{
                        width: "100%",
                    }}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <Box
                id="loansCardContent"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                    flexGrow: 1,
                    px: 1.5,
                    overflowY: "auto",
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
                }}
            >
                {activeStep === 0 && <LoanCardContentStep1 handleButtons={handleButtons} loansWidgetAssetStates={loansWidgetAssetStates} openWhitelistPopup={()=>{
                    setWhitelistPopupOpen(true);
                }}/>}
                {activeStep === 1 && (
                    <LoanCardContentStep2
                        handleButtons={handleButtons}
                        loansWidgetLoanTermStates={loansWidgetLoanTermStates}
                        loansWidgetAssetStates={loansWidgetAssetStates}
                    />
                )}
                {activeStep === 2 && (
                    <LoanCardContentStep3
                        handleButtons={handleButtons}
                        loansWidgetApprovalStates={loansWidgetApprovalStates}
                        loansWidgetAssetStates={loansWidgetAssetStates}
                    />
                )}
                {activeStep === 3 && (
                    <LoansCardContentStep4
                        handleButtons={handleButtons}
                        loansWidgetAssetStates={loansWidgetAssetStates}
                        loansWidgetLoanTermStates={loansWidgetLoanTermStates}
                        loansWidgetGetLoanStates={loansWidgetGetLoanStates}
                    />
                )}
                {activeStep === 4 && <LoansCardContentStep5 handleButtons={handleButtons} loansWidgetGetLoanStates={loansWidgetGetLoanStates}/>}
            </Box>

            <Box
                id="loansCardFooter"
                sx={{
                    display: "flex",
                    width: "100%",
                    height: "10%",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    mt: 1,
                }}
            >
                <Button
                    id="loansCardPrevButton"
                    variant="contained"
                    sx={{
                        visibility: prevButtonProperties.visible ? "visible" : "hidden",
                    }}
                    disabled={prevButtonProperties.disabled}
                    onClick={handleBack}
                >
                    prev
                </Button>

                <StyledAnchor href="https://loans.goblinsax.xyz/" target="_blank" rel="noreferrer">
                    <Typography
                        variant="subtitle1"
                        sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            userSelect: "none",
                        }}
                    >
                        Powered by Goblin Sax
                    </Typography>
                </StyledAnchor>

                <Button
                    variant="contained"
                    id="loansCardNextButton"
                    sx={{
                        visibility: nextButtonProperties.visible ? "visible" : "hidden",
                    }}
                    disabled={nextButtonProperties.disabled}
                    onClick={handleNext}
                >
                    next
                </Button>
            </Box>
            <LoansCardTransactionFailedSnackbar open={transactionFailedSnackbarOpen} onClose={handleTransactionErrors} />
            <LoansCardNetworkFailedSnackbar open={networkFailedSnackbarOpen} onClose={handleNetowrkErrors} />
            <LoansCardWhitelistPopup loansWidgetGetWhitelistStates={loansWidgetGetWhitelistStates} whitelistPopupOpen={whitelistPopupOpen} closeWhitelistPopup={()=>{
                setWhitelistPopupOpen(false);
            }}/>
        </LoansCardBox>
    );
};

export default LoansCard;
