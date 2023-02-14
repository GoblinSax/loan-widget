import {Box, Card, CircularProgress, Typography, styled} from "@mui/material";
import {WhitelistDetailed} from 'src/types/types';
import { useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';


interface LoansCardWhitelistPopupProps {
    loansWidgetGetWhitelistStates: {
        whitelist: Array<WhitelistDetailed>;
        getLoansWhitelist: () => Promise<void>; 
    },
    whitelistPopupOpen: boolean,
    closeWhitelistPopup: () => void,
}

const StyledAnchor = styled("a")(({ theme }) => ({
    color: theme.palette.common.white,
    textDecoration: "none",
}));

const LoansCardWhitelistPopup = ({loansWidgetGetWhitelistStates,whitelistPopupOpen,closeWhitelistPopup}: LoansCardWhitelistPopupProps) => {
    const {whitelist,getLoansWhitelist} = loansWidgetGetWhitelistStates;


    useEffect(() => {
        getLoansWhitelist();
    }, [getLoansWhitelist])

    let returnContent = (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            height:'85%',
            overflow:'auto',
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
        }}>
            {
                whitelist.map((item, index:number) => {
                    return(
                        <Box key={index} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent:'center',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            borderRadius: theme => theme.spacing(2),
                            paddingX: 1,
                            paddingY: 0.5,
                            '&:hover': {
                                cursor: 'pointer',
                                backgroundColor: 'primary.dark',
                            }
                        }}>                            
                        <StyledAnchor href={item.opensea_url} target="_blank" rel="noreferrer">
                            <Box 
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent:'center',
                                gap: 1
                            }}>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    <Box
                                        component="img"
                                        src={item.img_src}
                                        sx={{
                                            width: theme => theme.spacing(2),
                                            height: theme => theme.spacing(2),
                                            borderRadius: '50%',
                                        }}
                                    >
                                    </Box>
                                </Box>
                                <Typography variant="body1">
                                    {item.slug}  
                                </Typography>
                            </Box>
                            </StyledAnchor>
                        </Box>
                    )
                })
            }
        </Box>
    )

    if(whitelist.length === 0) {
        returnContent = (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
            }}>
                <CircularProgress size={100} />
            </Box>
        )
    }



    return(
        <Card sx={{
            display: `${whitelistPopupOpen ? 'flex' : 'none'}`,
            flexDirection: 'column',
            position:'absolute',
            width:'90%',
            height:'90%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: theme => theme.palette.background.default,
            '&:hover': {
                cursor: 'default',
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
            },
            gap: 1
        }}>
            <Box sx={{
                display:'flex',
                height:'10%',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Typography variant="h2" sx={{
                    width: 'fit-content',
                    my: 1,
                }}
                >
                    Whitelisted Collections [{whitelist.length}]
                </Typography>
                <Box 
                onClick={() => {
                    closeWhitelistPopup();
                }}
                sx={{
                    '&:hover': {
                        cursor: 'pointer',
                    }
                }}>
                    <CloseIcon/>
                </Box>

            </Box>
            {returnContent}
        </Card>
    )
}

export default LoansCardWhitelistPopup;