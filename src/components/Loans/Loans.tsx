
import { useMemo, useState, useEffect, useCallback, useContext, createContext } from "react";
import { useResizeDetector } from 'react-resize-detector';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {Typography, Box} from '@mui/material'
import { ethers } from "ethers";

import {Theme, Platte} from 'src/types/types'
import LoansCard from "src/components/LoansCard";
// import SizeContext from "../context/size";

import goblinSaxSDK from "src/utils/loans/goblinSaxSDK";

export interface LoansProps {
    lightOrDark: "light" | "dark";
    mainColor: string;
    signer: ethers.providers.JsonRpcSigner;
    GS_API_KEY: string;
};

const widthToSize = (width:number) => {
    if (width < 600) {
        return "xs";
    }
    if (width < 960) {
        return "sm";
    }
    if (width < 1280) {
        return "md";
    }
    if (width < 1920){
        return "lg";
    }
    return "xl";

}


let defaultPlatte = {
    light: {
        foregroundColor: "#2C2C2C",
        backgroundColor: "#FFFFFF",
        actionColor: "#00D092",
        // actionColor: "#FF6161",
        buttonTextColor: "#FFFFFF",
        inactiveColor: "#9EA4A0",
        cardColor : "#E4E4E4",
        errorColor: "#FF6161",
        successColor: "#0aad5a",
        borederColor: "#7D7D7D",
    },
    dark: {
        foregroundColor: "#FFFFFF",
        backgroundColor: "#1E1E1E",
        actionColor: "#00D092",
        // actionColor: "#FF6161",
        buttonTextColor: "#FFFFFF",
        inactiveColor: "#363636",
        cardColor : "#1a1a1a",
        errorColor: "#FF6161",
        successColor: "#0aad5a",
        borederColor: "#ffffff",
    }
}

declare module '@mui/material/styles' {
    interface ThemeOptions {
        currentSize ?: string;
    }

    interface Theme {
        currentSize ?: string;
    }
}

const Loans = ({ mainColor : mainColorFromProps, lightOrDark : lightOrDarkFromProps, signer, GS_API_KEY   }:LoansProps) => {

    const [theme, setTheme] = useState<Theme>({
        size : 'xs',
        mainColor: mainColorFromProps ? mainColorFromProps : defaultPlatte.light.actionColor,
        lightOrDark: lightOrDarkFromProps ? lightOrDarkFromProps : 'light',
        // lightOrDark: lightOrDarkFromProps ? lightOrDarkFromProps : 'dark',
    });

    const [key, setKey] = useState(0);
    const [platte, setPlatte] = useState(theme.lightOrDark === 'light' ? defaultPlatte.light : defaultPlatte.dark);

    useEffect(() => {
        if(theme.lightOrDark === 'light'){
            setPlatte(defaultPlatte.light);
        }else{
            setPlatte(defaultPlatte.dark);
        }
    }, [theme.lightOrDark]);

    useEffect(()=>{
        setPlatte((prev)=>{
            return {
                ...prev,
                actionColor: theme.mainColor,
            }
        })
        defaultPlatte.light.actionColor = theme.mainColor;
        defaultPlatte.dark.actionColor = theme.mainColor;
    },[theme.mainColor])

    const refreshComponent = () => {
        setKey((prev) => prev + 1);
    }

    const onResize = useCallback((width:number|undefined) => {
        if(width){
            setTheme({
                ...theme,
                size: widthToSize(width),
            });
        }
    }, [theme]);

    const MUITheme = useMemo(() => {
        return createTheme({
            palette: {
                mode: theme.lightOrDark === 'light' ? 'light' : 'dark',
                primary: {
                    main: theme.mainColor,
                },
                background: {
                    default: platte.backgroundColor,
                    
                },
                text: {
                    primary: platte.foregroundColor,
                },
                error: {
                    main: platte.errorColor,
                },
                success: {
                    main: platte.successColor,
                },
                action: {
                    disabledBackground: platte.inactiveColor,
                    disabled: platte.buttonTextColor,
                },
                divider: platte.borederColor,
                grey: {
                    500: 'rgba(0, 0, 0, 0.5)',
                    900: '#ffffffc7'
                },
                common:{
                    white: '#ffffff',
                },
            },
            typography: {
                fontFamily: "Roboto",
                // Widget Title
                h1: {
                    fontSize: theme.size === "xs" ? "1.5rem" : theme.size === "sm" ? "3rem" : theme.size === "md" ? "3.5rem" : "4rem",
                    fontWeight: 900,
                },

                // Widget extra large
                h2: {
                    fontSize: theme.size === "xs" ? "1.25rem" : theme.size === "sm" ? "1.5rem" : theme.size === "md" ? "1.75rem" : "2rem",
                    fontWeight: 600,
                },

                h3: {
                    fontSize: theme.size === "xs" ? "1rem" : theme.size === "sm" ? "1.5rem" : theme.size === "md" ? "1.75rem" : "2rem",
                    fontWeight: 700,
                },

                //Widget regular
                body1: {
                    fontSize: theme.size === "xs" ? "1rem" : theme.size === "sm" ? "1.25rem" : theme.size === "md" ? "1.5rem" : "1.75rem",
                    fontWeight: 600,
                },

                //Widget regular extra bold
                body2: {
                    fontSize: theme.size === "xs" ? "1rem" : theme.size === "sm" ? "1.25rem" : theme.size === "md" ? "1.5rem" : "1.75rem",
                    fontWeight: 700,
                },

                //Widget small
                subtitle1: {
                    fontSize: theme.size === "xs" ? "0.75rem" : theme.size === "sm" ? "1rem" : theme.size === "md" ? "1.25rem" : "1.5rem",
                    fontWeight: 600
                },

                //Widget extra small
                subtitle2: {
                    fontSize: theme.size === "xs" ? "0.5rem" : theme.size === "sm" ? "1rem" : theme.size === "md" ? "1.25rem" : "1.5rem",
                    fontWeight: 600
                },

                //Widget extra extral small
                caption: {
                    fontSize: theme.size === "xs" ? "0.25rem" : theme.size === "sm" ? "0.5rem" : theme.size === "md" ? "0.75rem" : "1rem",
                    fontWeight: 600
                }
            },
            spacing: theme.size === "xs" ? 8 : theme.size === "sm" ? 16 : theme.size === "md" ? 20 : 24,
            shape: {
                borderRadius: theme.size === "xs" ? 4 : theme.size === "sm" ? 8 : theme.size === "md" ? 12 : 16,
            },
            currentSize: theme.size,
            components: {
                MuiStepIcon: {
                    styleOverrides: {
                        text: {
                            fontSize: theme.size === "xs" ? "1rem" : theme.size === "sm" ? "1rem" : theme.size === "md" ? "1rem" : "1rem",
                            fill: platte.buttonTextColor,
                            fontWeight: 900
                        },
                        root: {
                            width: theme.size === "xs" ? "1.5rem" : theme.size === "sm" ? "2rem" : theme.size === "md" ? "2.5rem" : "3rem",
                            height: theme.size === "xs" ? "1.5rem" : theme.size === "sm" ? "2rem" : theme.size === "md" ? "2.5rem" : "3rem",
                            color: platte.inactiveColor
                        },
                    }
                },
                MuiStepLabel: {
                    styleOverrides: {
                        label: {
                            fontWeight: "900 !important",
                            color: platte.foregroundColor
                        }
                    }
                },
                MuiStepConnector:{
                    styleOverrides: {
                        line: {
                            height: "0px",
                            display:'none'
                        }
                    }
                },
                MuiButton: {
                    styleOverrides: {
                        contained: {
                            textTransform: "capitalize",
                            color: `${platte.buttonTextColor}`,
                            fontSize: theme.size === "xs" ? "1rem" : theme.size === "sm" ? "1.25rem" : theme.size === "md" ? "1.5rem" : "1.75rem",
                            fontWeight: '900',
                            borderRadius:"10px",
                            paddingInline: theme.size === "xs" ? "0.5rem" : theme.size === "sm" ? "1rem" : theme.size === "md" ? "1.5rem" : "2rem",
                            paddingTop:'0px',
                            paddingBottom:'0px',
                        },
                        root: {
                            "&.Mui-disabled": {
                                "backgroundColor": platte.inactiveColor,
                                "color": platte.buttonTextColor,
                            }
                        }
                    }
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            backgroundColor: platte.cardColor,
                            color: platte.foregroundColor,
                            borderRadius: "10px",
                            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
                            border: `1px solid ${platte.borederColor}`,
                            padding: theme.size === "xs" ? "0.5rem" : theme.size === "sm" ? "1rem" : theme.size === "md" ? "1.5rem" : "2rem",
                            width: theme.size === "xs" ? "100%" : theme.size === "sm" ? "44%" : theme.size === "md" ? "30%" : theme.size === "lg" ? "30%" : "22%",
                            "&:hover":{
                                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.9)",
                                cursor:'pointer'
                            }
                        }
                    }
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            backgroundColor: platte.inactiveColor,
                            color: platte.buttonTextColor,
                            padding: theme.size === "xs" ? "1rem" : theme.size === "sm" ? "1.25rem" : theme.size === "md" ? "1.5rem" : "1.75rem",
                            '&:hover': {
                                backgroundColor: platte.actionColor,
                            },
                        },
                        label : {
                            fontWeight: 700,
                            fontSize: theme.size === "xs" ? "1rem" : theme.size === "sm" ? "1.5rem" : theme.size === "md" ? "1.75rem" : "2rem",
                            padding: '0px'
                        }

                    }
                }
            }
        });
    }, [theme.lightOrDark, theme.mainColor, theme.size, platte]);

    // I don't want to update the theme on every resize, so I'm using a debounce function
    const { width, height, ref} = useResizeDetector({onResize, refreshMode: "debounce", refreshRate: 50});

    const GSSDK = useMemo(()=>{
        return goblinSaxSDK(signer,GS_API_KEY)
    },[
        signer,
        GS_API_KEY,
    ])


    return (
            <Box ref={ref} style={{height:'100%',width:'100%'}}>
                <ThemeProvider theme={MUITheme}>
                        {
                            GSSDK ? <LoansCard key={key} refreshComponent={refreshComponent} GSSDK={GSSDK}/> : 
                            <Box sx={{
                                backgroundColor: (theme)=>theme.palette.background.default,
                                color: (theme)=>theme.palette.text.primary,
                                height: "100%",
                                width: "100%",
                                padding: (theme)=>theme.spacing(1),
                                borderRadius: (theme)=>theme.spacing(2),
                                boxShadow: (theme)=>`0px 4px 10px ${theme.palette.grey[500]}`,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <Typography variant="h1">Please Connect Your Wallet.</Typography>
                            </Box>

                        }
                </ThemeProvider>
            </Box>
    );
};

export default Loans;
