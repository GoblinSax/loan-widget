import { useState, useEffect, useCallback } from "react";
import { Asset, IGSSDK } from "src/types/types";

const initialState = {
    assetApproval: false,
    loading: true,
    approving: false,
    error : {
        network: false,
        transaction: false,
    }
};


const useLoansWidgetApproval = (GSSDK:IGSSDK) => {
    const [assetApproval, setAssetApproval] = useState<boolean>(initialState.assetApproval);
    const [loading, setLoading] = useState<boolean>(initialState.loading);
    const [approving, setApproving] = useState<boolean>(initialState.approving);
    const [error, setError] = useState(initialState.error);

    const getLoansWidgetApproval = useCallback(async (asset:Asset): Promise<boolean> => {
        const approved = await GSSDK.getApprovalStatus(asset) as boolean;
        return approved;
    }, [GSSDK]);

    const getAndSetLoanWidgetApproval = useCallback(async (asset:Asset) => {
        resetEverything();
        setLoading(true);
        try{
            const tempApproval = await getLoansWidgetApproval(asset);
            
            setAssetApproval(tempApproval);
            setLoading(false);
        }
        catch(e){
            setError({
                transaction : false,
                network: true
            });
            setLoading(false);
        }
    }, [getLoansWidgetApproval, setAssetApproval, setLoading]);

    const approveAsset = useCallback(async (asset:Asset) => {
        setApproving(true);
        setError({
            transaction : false,
            network: false
        });

        try{
            await GSSDK.approveAssetViaSDK(asset,'NFTFI');
            setAssetApproval(true);
            setApproving(false);
        }
        catch(e){
            setError({
                transaction : true,
                network: false
            });
            setApproving(false);
        }
    }, [setAssetApproval, setApproving, GSSDK]);

    const resetEverything = () => {
        setAssetApproval(initialState.assetApproval);
        setLoading(initialState.loading);
        setApproving(initialState.approving);
        setError(initialState.error);
    };


    return {
        assetApproval,
        setAssetApproval,
        loading,
        setLoading,
        approving,
        setApproving,
        approveAsset,
        getAndSetLoanWidgetApproval,
        resetEverything,
        error,
        setError,
    };
}

export default useLoansWidgetApproval;