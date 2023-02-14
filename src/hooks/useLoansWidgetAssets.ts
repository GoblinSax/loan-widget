import { Asset, IGSSDK } from "../types/types";
import { useEffect, useState, useCallback } from "react";


const initialState = {
    assets: [],
    loading: true,
    selectedAsset: null,
    error: {
        network: false
    },
};



const useLoansWidgetAssets = (GSSDK:IGSSDK) => {
    const [assets, setAssets] = useState<Array<Asset>>(initialState.assets);
    const [loading, setLoading] = useState<boolean>(initialState.loading);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(initialState.selectedAsset);
    const [error, setError] = useState<any>(initialState.error);

    

    const getLoansWidgetAssets = useCallback(async ():Promise<Array<Asset>> => {
        const assets = await GSSDK.getAssets();
        return assets;
    },[GSSDK]);

    const getAndSetLoansWidgetAssets = useCallback(async () => {
        resetEverything();
        setLoading(true);
            try{
                const tempAssets = await getLoansWidgetAssets();
                setAssets(tempAssets);
                setLoading(false);
            }
            catch(e){
                setError({
                    network: true
                });
                setLoading(false);
                console.error(e);
            }
    },[getLoansWidgetAssets]);

    const resetEverything = () => {
        setAssets(initialState.assets);
        setLoading(initialState.loading);
        setSelectedAsset(initialState.selectedAsset);
        setError(initialState.error);
    }

    return {
        assets,
        loading,
        selectedAsset,
        setSelectedAsset,
        getAndSetLoansWidgetAssets,
        resetEverything,
        error,
        setError,
    }
}

export default useLoansWidgetAssets;