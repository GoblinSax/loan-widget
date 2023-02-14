import { Box, Card, Typography } from "@mui/material";
import {Asset} from "src/types/types";
import {useCallback} from "react";

export interface LoansAssetCardProps {
    imageSrc: string;
    collectionName: string;
    assetId: string;
    assetPrice: number;
    selected: boolean;
    assetAddress: string;
    openseaPermaLink: string;
    onClick: (asset:Asset) => void;
}

const LoansAssetCard = ({ imageSrc, collectionName, assetId, assetPrice, selected, assetAddress, openseaPermaLink, onClick:onClickSetSelectedAsset }: LoansAssetCardProps) => {

    const onClickHandler = useCallback(() => {
        const selectedAsset: Asset = {
            imageSrc,
            collectionName,
            assetId,
            assetPrice,
            assetAddress,
            openseaPermaLink
        }
        onClickSetSelectedAsset(selectedAsset);
    }, [onClickSetSelectedAsset, imageSrc, collectionName, assetId, assetPrice,assetAddress, openseaPermaLink]);

    return (
        <Card
            className="assetCard"
            sx={{
                position: "relative",
                userSelect: "none",
            }}
            onClick={onClickHandler}
        >
            <Box
                className="assetCardBox"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    className="assetImageBox"
                    sx={{
                        width: "100%",
                        aspectRatio: "1/1",
                        position: "relative",
                    }}
                >
                    <Box component="img" className="assetImage" alt="Asset Image" src={imageSrc} sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: (theme) => theme.spacing(1),
                    }} />
                </Box>
                <Box
                    className="assetCollectionBox"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 1,
                        gap: 0.5,
                        flexWrap: 'wrap',
                        flexDirection:'column'
                    }}
                >
                    <Typography variant="body1" textAlign={'center'} sx={{
                        textTransform: 'capitalize'
                    }}>{collectionName}</Typography>
                    <Typography variant="body1">#{assetId ? assetId : 'N/A'}</Typography>
                </Box>
                {/* <Box
                    className="assetPriceBox"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        mt: 0.5,
                        gap: 0.5,
                        flexWrap: 'wrap'
                    }}
                >
                    <Typography variant="body1" color="primary.main" textAlign={'center'}>
                        {assetPrice ? Number(assetPrice).toFixed(4) : 'N/A'} ETH
                    </Typography>
                </Box> */}
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    height: "50px",
                    width: "50px",
                    display: selected ? "flex" : "none",
                }}
            >
                <Box component="img" src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="checked" />
            </Box>
        </Card>
    );
};

export default LoansAssetCard;
