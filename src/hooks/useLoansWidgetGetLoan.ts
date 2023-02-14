import {useState, useEffect, useCallback} from 'react';
import { LoanTerms, Asset,SelectedLoanTerm, IGSSDK } from "src/types/types";

const initialState = {
    transactionLoading: false,
    transaction : null,
    error : {
        transaction: false
    }
}

const useLoansWidgetGetLoans = (GSSDK:IGSSDK) => {
    const [transactionLoading, setTransactionLoading] = useState<boolean>(initialState.transactionLoading);
    const [transaction, setTransaction] = useState<any>(initialState.transaction);
    const [error, setError] = useState(initialState.error);

    const initializeTransaction = useCallback(async (asset:Asset, loanTerms:LoanTerms, selectedLoanTerm:SelectedLoanTerm) => {
        const receipt = await GSSDK.getLoan(asset, loanTerms, selectedLoanTerm);
        return receipt;
    }, [GSSDK]);

    const getAndSetTransaction = useCallback(async (asset:Asset, loanTerms:LoanTerms, selectedLoanTerm:SelectedLoanTerm) => {
        setTransactionLoading(true);
        setError({transaction: false});
        setTransaction(null);

        try{
            const receipt = await initializeTransaction(asset, loanTerms, selectedLoanTerm);
            // console.log(receipt);
            setTransaction(receipt);
            setTransactionLoading(false);
        }
        catch(e){
            setError({
                transaction : true
            });
            console.error(e);
            setTransaction(null);
            setTransactionLoading(false);
        }

    }, [initializeTransaction, setTransaction, setError]); 

    const resetEverything = () => {
        setTransactionLoading(initialState.transactionLoading);
        setTransaction(initialState.transaction);
        setError(initialState.error);
    }


    return{
        transactionLoading,
        transaction,
        error,
        resetEverything,
        getAndSetTransaction
    }
}

export default useLoansWidgetGetLoans;