import { useState, useEffect, useCallback } from "react";
import { LoanTerms, Asset, IGSSDK } from "src/types/types";

const initialState = {
    loanTerms: {
        loanDurations: [],
        loanAmounts: [],
        estimateInterest: 0,
        repaymentAmount: 0,
        valuation: 0,
        valuationInUSD: 0,
    },
    loading: true,
    selectedLoanTerm: {
        loanDuration: null,
        loanAmount: null,
    },
    settlementLayer: "NFTFI" as "ARCADE" | "NFTFI",
    error: {
        network: false,
    }
};


const useLoansWidgetLoanTerms = (GSSDK:IGSSDK)  => {
    const [loanTerms, setLoanTerms] = useState<LoanTerms>(initialState.loanTerms);

    const [loading, setLoading] = useState<boolean>(initialState.loading);

    const [settlementLayer, setSettlementLayer] = useState<"ARCADE" | "NFTFI">(initialState.settlementLayer);
    const [selectedLoanTerm, setSelectedLoanTerm] = useState<{
        loanDuration: number | null;
        loanAmount: number | null;
    }>(initialState.selectedLoanTerm);
    const [error, setError] = useState(initialState.error);

    const getLoansWidgetLoanTerms = useCallback(async (asset: Asset): Promise<LoanTerms> => {
        const loanTerms = await GSSDK.getLoanTerms(asset);
        if(loanTerms){
            // console.log("loanTerms", loanTerms)
            return loanTerms;
        }
        else{
            throw new Error("Error fetching loan terms");
        }
    }, [GSSDK]);

    const getAndSetLoansWidgetLoanTerms = useCallback(async (asset: Asset) => {
        resetEverything();
        setLoading(true);
        try{
            const tempLoanTerms = await getLoansWidgetLoanTerms(asset);
            setLoanTerms(tempLoanTerms);
            if(tempLoanTerms.loanDurations.length > 0){
                setSelectedLoanTerm((prev)=>{
                    return {
                        loanDuration: tempLoanTerms.loanDurations[0],
                        loanAmount: tempLoanTerms.loanAmounts[0]
                    }
                })
            }

            setLoading(false);
        }
        catch(e){
            setError({
                network: true
            });
            setLoading(false);
        }
    }, [getLoansWidgetLoanTerms, setLoanTerms, setLoading]);

    useEffect(()=>{
        if(selectedLoanTerm.loanDuration === null || selectedLoanTerm.loanAmount === null) return;
        const loanAmount = selectedLoanTerm.loanAmount;
        const loanDuration = selectedLoanTerm.loanDuration;
        const APRdict = loanTerms.APRdict;
        if(!APRdict) return;
        const APR = APRdict[loanDuration][loanAmount];
            setLoanTerms((prev)=>{
                if(prev.repaymentAmountDict){
                    return {
                        ...prev,
                        repaymentAmount: prev.repaymentAmountDict[loanDuration][loanAmount],
                        estimateInterest: APR/100 * loanDuration/365 * loanAmount
                    }
                }
                else{
                    throw new Error("Error fetching repayment amount.");
                }

            })
    },[selectedLoanTerm, loanTerms.repaymentAmountDict, loanTerms.APRdict])

    useEffect(()=>{
        if(selectedLoanTerm.loanDuration === null) return;
        const loanDuration = selectedLoanTerm.loanDuration;
        setLoanTerms((prev)=>{
            if(prev.loanAmountDict){
                return {
                    ...prev,
                    loanAmounts: prev.loanAmountDict[loanDuration]
                }
            }
            else{
                throw new Error("Error fetching loan amounts");
            }
        })
        setSelectedLoanTerm((prev)=>{
            const loanDuration = selectedLoanTerm.loanDuration;
            const loanAmount = prev.loanAmount;
            if(!loanTerms.loanAmountDict || loanDuration === null || !loanAmount || loanTerms.loanAmountDict[loanDuration].length === 0) {
                return {
                    ...prev,
                    loanAmount: null
                };
            }

            if(loanTerms.loanAmountDict[loanDuration].includes(loanAmount)) {
                return {
                    ...prev,
                    loanAmount: loanAmount
                };
            }

            return {
                ...prev,
                loanAmount: loanTerms.loanAmountDict[loanDuration][0]
            }

        })
    },[selectedLoanTerm.loanDuration, loanTerms.loanAmountDict])

    const resetEverything = () => {
        setLoanTerms(initialState.loanTerms);
        setLoading(initialState.loading);
        setSelectedLoanTerm(initialState.selectedLoanTerm);
        setSettlementLayer(initialState.settlementLayer);
        setError(initialState.error);
    }

    return {
        loanTerms,
        loading,
        setLoading,
        selectedLoanTerm,
        setSelectedLoanTerm,
        settlementLayer,
        setSettlementLayer,
        getAndSetLoansWidgetLoanTerms,
        resetEverything,
        error,
        setError
    };
};

export default useLoansWidgetLoanTerms;
