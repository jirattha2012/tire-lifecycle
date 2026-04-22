import { Box, Typography, Stack, Chip } from "@mui/material";

const ChipField = ({ label, field, options, form, handleChange, sx }) => (
    <Box mb={2} sx={sx}>
        <Typography variant="body2" color="text.secondary" sx={{ pb: 2 }}>
            {label}
        </Typography>
        
        <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center" sx={{display: 'flex', justifyContent: 'center'}}>
            {options.map((opt, i) => (
                <Chip
                    key={opt}
                    label={opt}
                    variant={form[field] === i ? "filled" : "outlined"}
                    color={form[field] === i ? "primary" : "default"}
                    onClick={() => handleChange(field, i)}
                    sx={{
                        cursor: "pointer",
                        ml: 1,
                        width: '25vh',
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        p: 1
                    }}
                />
            ))}
        </Stack>
    </Box>
);

export default ChipField;