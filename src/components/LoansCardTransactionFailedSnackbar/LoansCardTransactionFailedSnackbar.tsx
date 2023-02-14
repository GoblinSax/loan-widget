import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import Alert from "@mui/material/Alert";

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
}

interface LoansCardTransactionFailedSnackbarProps {
    open: boolean;
    onClose: () => void;
}


const LoansCardTransactionFailedSnackbar = ({ open, onClose }: LoansCardTransactionFailedSnackbarProps) => {

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={() => {
                onClose();
            }}
            sx={{ width: "100%", alignItems: "center" }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            TransitionComponent={SlideTransition}
        >
            <Alert severity="error" sx={{
                alignItems: "center"
            }}>Transaction failed, please try again.</Alert>
        </Snackbar>
    );
};

export default LoansCardTransactionFailedSnackbar;
