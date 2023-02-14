import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import Alert from "@mui/material/Alert";

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
}

interface LoansCardNetowrkFailedSnackbarProps {
    open: boolean;
    onClose: () => void;
}


const LoansCardNetowrkFailedSnackbar = ({ open, onClose }: LoansCardNetowrkFailedSnackbarProps) => {

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={() => {onClose()}}
            sx={{ width: "100%", alignItems: "center" }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            TransitionComponent={SlideTransition}
        >
            <Alert severity="error" sx={{
                alignItems: "center"
            }}>Network failure, please try again.</Alert>
        </Snackbar>
    );
};

export default LoansCardNetowrkFailedSnackbar;
