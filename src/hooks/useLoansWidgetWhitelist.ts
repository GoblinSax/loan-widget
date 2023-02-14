import { useState, useEffect, useCallback } from "react";
import { Asset, IGSSDK, WhitelistDetailed } from "src/types/types";

const initialState = {
    whitelist: []
};


const useLoansWhitelist = (GSSDK:IGSSDK) => {
    const [whitelist, setWhitelist] = useState<Array<WhitelistDetailed>>(initialState.whitelist);

    const getLoansWhitelist = useCallback(async (): Promise<void> => {
        const whitelist = await GSSDK.getDetailedWhitelist();
        setWhitelist(whitelist);
    }, [GSSDK]);


    const resetEverything = () => {

    };

    return {
        whitelist,
        getLoansWhitelist
    };
}

export default useLoansWhitelist;