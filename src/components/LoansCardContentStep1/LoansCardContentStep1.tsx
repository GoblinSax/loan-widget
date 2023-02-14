import { useEffect } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import LoansAssetCard from "../LoansAssetCard";
import { Asset } from "src/types/types";

interface LoansCardContentStep1Props {
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
        loading: boolean;
        selectedAsset: Asset | null;
        setSelectedAsset: (asset: Asset | null) => void;
        error: {
            network: boolean;
        };
        setError: (error: { network: boolean }) => void;
        getAndSetLoansWidgetAssets: () => Promise<void>;
        resetEverything: () => void;
    };
    openWhitelistPopup: () => void;
}

const LoansCardContentStep1 = ({ handleButtons, loansWidgetAssetStates,openWhitelistPopup }: LoansCardContentStep1Props) => {
    const {
        assets,
        loading: assetsLoading,
        selectedAsset,
        setSelectedAsset,
        error,
        setError,
        getAndSetLoansWidgetAssets,
        resetEverything: resetEverythingInAssets,
    } = loansWidgetAssetStates;

    const handleAssetCardClicked = (asset: Asset) => {
        if (selectedAsset?.assetAddress === asset.assetAddress) {
            setSelectedAsset(null);
        } else {
            setSelectedAsset(asset);
        }
    };

    useEffect(() => {
        handleButtons.showNextButton();
        handleButtons.hidePrevButton();
        handleButtons.disablePrevButton();
        handleButtons.enableNextButton();

        if (assetsLoading || error.network) {
            handleButtons.hideNextButton();
            handleButtons.hidePrevButton();
            return;
        }

        if (selectedAsset === null) {
            handleButtons.showNextButton();
            handleButtons.disableNextButton();
            return;
        }
    }, [selectedAsset, handleButtons, assetsLoading, error.network]);

    useEffect(() => {
        async function getandSetAssets() {
            await getAndSetLoansWidgetAssets();
        }
        getandSetAssets();
    }, [getAndSetLoansWidgetAssets]);

    if (assetsLoading) {
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
                <CircularProgress size={100} />
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
                            network: false,
                        });
                        await getAndSetLoansWidgetAssets();
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
            id="loanCardContentStep1"
            className="loanCardContent"
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
            }}
        >
            <Box sx={{ display: "flex", flexWrap:'wrap' }}>
                <Typography
                    variant="h2"
                    sx={{ /*textDecoration:'underline', cursor:'pointer',*/ width: "fit-content", my: 1, whiteSpace: "pre-wrap" }}
                >
                    {assets.length === 0 ? "No" : "Select a"}
                </Typography>
                <Typography
                    variant="h2"
                    sx={{
                        width: "fit-content",
                        my: 1,
                        color: (theme) => theme.palette.primary.main,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        cursor: "pointer",
                        animation: "pulse 1s infinite",
                        whiteSpace: "pre-wrap",
                        '&:hover': {
                            color: theme => theme.palette.primary.dark,
                        }
                    }}
                    onClick={openWhitelistPopup}
                >
                    {" whitelisted "}
                </Typography>
                <Typography variant="h2" sx={{ width: "fit-content", my: 1, whiteSpace: "pre-wrap" }}>
                    {assets.length === 0 ? "assets found" : "asset"}
                </Typography>
            </Box>
            <Box
                id="assetSelection"
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    mt: 1,
                    flexWrap: "wrap",
                    gap: 2,
                    pb: 2,
                    // justifyContent: 'space-between'
                }}
            >
                {assets.map((asset, index) => {
                    return (
                        <LoansAssetCard
                            key={index}
                            imageSrc={asset.imageSrc}
                            collectionName={asset.collectionName}
                            assetId={asset.assetId}
                            assetPrice={asset.assetPrice}
                            selected={selectedAsset?.assetAddress === asset.assetAddress}
                            assetAddress={asset.assetAddress}
                            openseaPermaLink={asset.openseaPermaLink}
                            onClick={handleAssetCardClicked}
                        />
                    );
                })}
            </Box>
        </Box>
    );
};

export default LoansCardContentStep1;
