import { Paper, Typography, Divider } from "@mui/material";

const SectionCard = ({ title, children }) => (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 2 }}>
        <Typography variant="overline" color="text.secondary" fontWeight={600}>
            {title}
        </Typography>

        <Divider sx={{ my: 1.5 }} />
        
        {children}
    </Paper>
);

export default SectionCard;