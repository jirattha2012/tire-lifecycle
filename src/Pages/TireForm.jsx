import { useState } from "react";
import { useTireCalculator } from "../hooks/useTireCalculator";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, TextField, Slider, Button,
    Chip, Stack, Paper, Divider, InputAdornment, MenuItem
} from "@mui/material";

// Mock Data
const chipOptions = {
    braking: ["นุ่มนวล ค่อยๆเหยียบเบรก", "เบรกแรง/กะทันหันบ่อยครั้ง"],   // Smooth braking, Strong braking
    road: ["ถนนเรียบ", "ถนนขรุขระ/ฝุ่นเยอะ", "เต็มไปด้วยหลุม"],        // Smooth road, Rough road/Dusty Road, There are many holes
    load: ["น้อยกว่า 400-500 กก.", "มากกว่า 500 กก."],             // Less than 400-500 kg, More than 5500 kg
    rubberCondition: ["นุ่ม/ยืดหยุ่น", "เริ่มแข็ง", "แข็ง/ตาย"],         // สภาพเนื้อยาง
    crackLevel: ["ไม่มี", "มีเล็กน้อย", "แตกชัดเจน"],                 // รอยแตกลายงา
    bulge: ["ไม่มี", "พบรอยบวม"],                                 // การบวม/พอง
    damage: ["ไม่มี", "มีรอยตื้น", "แผลลึก/เห็นโครงสร้าง"],             // บาด/ตำ/ฉีก/ขาด
};

export default function TireForm() {
    const { calculate } = useTireCalculator();
    const navigate = useNavigate();
    const [touched, setTouched] = useState({});
    const [form, setForm] = useState({
        mileage: 0,    // ระยะทาง
        tread: 8.5,     // ดอกยาง
        speed: 0,      // ความเร็ว
        braking: 0,     // เบรก
        road: 0,
        load: 0,
        rubberCondition: 0,
        crackLevel: 0,
        bulge: 0,
        damage: 0,
        age: 0,
        ageMonth: 0,
        kmPerYear: 20000,
    });


    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const isError = (field) => touched[field] && (form[field] === "" || form[field] === 0);

    const handleChange = (field, value) => {
        console.log('value ==> ', value)
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        const requiredFields = ["mileage", "kmPerYear", "age", "speed"];
        
        // Mark ทุก field ว่า touched แล้ว
        setTouched(Object.fromEntries(requiredFields.map((f) => [f, true])));

        const hasError = requiredFields.some((f) => form[f] === "" || form[f] === 0);
        if (hasError) return;  // หยุดถ้ายังมี field ว่าง

        calculate(form);
        localStorage.setItem("tireData", JSON.stringify(form));
        navigate("/result");
    };

    const SectionCard = ({ title, children }) => (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 2 }}>
        <Typography variant="overline" color="text.secondary" fontWeight={600}>
            {title}
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        {children}
        </Paper>
    );

    const ChipField = ({ label, field, options, sx }) => (
    <Box mb={2} sx={sx}>
        <Typography variant="body2" color="text.secondary" sx={{ pb: 2 }}>
            {label}
        </Typography>
        
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ display: 'flex', justifyContent: 'center'}}>
            {options.map((opt, i) => (
                <Chip
                    key={opt}
                    label={opt}
                    variant={form[field] === i ? "filled" : "outlined"}
                    color={form[field] === i ? "primary" : "default"}
                    onClick={() => handleChange(field, i)}
                    sx={{ cursor: "pointer", ml: 1, width: '30vh', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", p: 1 }}
                />
            ))}
        </Stack>
    </Box>
  );


    return (
        <Box maxWidth={600} mx="auto" p={3}>
            <Box mb={3}>
                <Typography variant="h6" fontWeight={500}>
                    ระบบประเมินอายุการใช้งานยาง 𖥕 ×͜×
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    กรอกข้อมูลให้ครบเพื่อคำนวณระยะเวลาที่เหลือของยาง 🏁 
                </Typography>
            </Box>

            {/* ข้อมูลการใช้งาน */}
            <SectionCard title={<Typography fontSize={20}><span style={{fontWeight: 'bold'}}> ข้อมูลการใช้งาน </span></Typography>}>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                    <TextField
                        label="ระยะทางสะสม (กม.)"
                        type="number"
                        value={form.mileage ?? ""}
                        onChange={(e) => handleChange("mileage", e.target.value)}
                        onBlur={() => handleBlur("mileage")}
                        error={isError("mileage")}
                        helperText={isError("mileage") ? "กรุณากรอกระยะทางสะสม (กม.)" : ""}
                        InputProps={{ endAdornment: <InputAdornment position="end"> กม. </InputAdornment> }}
                        size="small"
                        fullWidth
                        sx={{ pb: 2 }}
                    />

                    <TextField
                        label="ระยะทางต่อปี"
                        type="number"
                        value={form.kmPerYear ?? ""}
                        onChange={(e) => handleChange("kmPerYear", e.target.value)}
                        onBlur={() => handleBlur("kmPerYear")}
                        error={isError("kmPerYear")}
                        helperText={isError("kmPerYear") ? "กรุณากรอกระยะทางต่อปี" : ""}
                        InputProps={{ endAdornment: <InputAdornment position="end"> กม./ปี </InputAdornment> }}
                        size="small"
                        fullWidth
                        sx={{ pb: 2 }}
                    />

                    <TextField
                        label="ระยะเวลาใช้งาน"
                        type="number"
                        value={form.age ?? ""}
                        onChange={(e) => handleChange("age", e.target.value)}
                        onBlur={() => handleBlur("age")}
                        error={isError("age")}
                        helperText={isError("age") ? "กรุณากรอกระยะเวลาใช้งาน" : ""}
                        InputProps={{ endAdornment: <InputAdornment position="end"> ปี </InputAdornment> }}
                        size="small"
                        fullWidth
                        sx={{ pb: 2 }}
                    />

                    <TextField
                        label="ความเร็วเฉลี่ย (กม./ชม.)"
                        type="number"
                        value={form.speed ?? ""}
                        onChange={(e) => handleChange("speed", e.target.value)}
                        onBlur={() => handleBlur("speed")}
                        error={isError("speed")}
                        helperText={isError("speed") ? "กรุณากรอกความเร็วเฉลี่ย (กม./ชม.)" : ""}
                        InputProps={{ endAdornment: <InputAdornment position="end"> กม./ชม. </InputAdornment> }}
                        size="small"
                        fullWidth
                        sx={{ pb: 2 }}
                    />
                </Box>
            </SectionCard>

            {/* สภาพยาง */}
            <SectionCard title={<Typography fontSize={20}><span style={{fontWeight: 'bold'}}> ความเสียหาย / สภาพยาง </span></Typography>}>
                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        ดอกยางเฉลี่ย (4 ล้อ): {form.tread} มม.
                    </Typography>
                    <Slider
                        min={0} max={10} step={0.5}
                        value={form.tread}
                        onChange={(_, val) => handleChange("tread", val)}
                        marks={[
                        { value: 0, label: "0" },
                        { value: 1.6, label: "1.6" },
                        { value: 10, label: "10" },
                        ]}
                        valueLabelDisplay="auto"
                    />
                </Box>

                <ChipField label="สภาพเนื้อยาง" field="rubberCondition" options={chipOptions.rubberCondition} sx={{ mt: 2 }} />
                <ChipField label="รอยแตกลายงา" field="crackLevel" options={chipOptions.crackLevel} sx={{ mt: 2 }} />
                <ChipField label="การบวม/พอง" field="bulge" options={chipOptions.bulge} sx={{ mt: 2 }} />
                <ChipField label="บาด/ตำ/ฉีก/ขาด" field="damage" options={chipOptions.damage} sx={{ mt: 2 }} />
            </SectionCard>

            {/* ปัจจัยการใช้งาน */}
            <SectionCard title={<Typography fontSize={20}><span style={{fontWeight: 'bold'}}>ปัจจัยการใช้งาน</span></Typography>}>
                <ChipField label="พฤติกรรมการเบรค" field="braking" options={chipOptions.braking} sx={{ mt: 2}} />
                <ChipField label="สภาพถนน" field="road" options={chipOptions.road} sx={{ mt: 2}} />
                <ChipField label="การบรรทุก" field="load" options={chipOptions.load} sx={{ mt: 2}} />
            </SectionCard>

            <Box display="flex" gap={4} width="100%">
                <Button variant="outlined" sx={{ width: '18vh', borderRadius: '8px', mr: 2 }} onClick={() => setForm({ mileage: "", tread: 8.5, speed: "", braking: 0, road: 0, load: 0, rubberCondition: 0, crackLevel: 0, bulge: 0, damage: 0, age: "", kmPerYear: 20000 })}>
                    ล้างข้อมูล
                </Button>
            
                <Button variant="contained" sx={{ width: '18vh', borderRadius: '8px' }} onClick={handleSubmit} disableElevation>
                    คำนวณ
                </Button>
            </Box>
        </Box>
    );
}