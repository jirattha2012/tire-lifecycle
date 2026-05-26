import { useState, useEffect } from "react";
import { useTireCalculator } from "../hooks/useTireCalculator";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, TextField, Slider, Button,
    Chip, Stack, Paper, Divider, InputAdornment, MenuItem
} from "@mui/material";
import SectionCard from '../components/SectionCard'
import ChipField from '../components/ChipField'
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import th from "../locales/th.json";
import en from "../locales/en.json";

// Mock Data
const chipOptions = {
    rubberCondition: ["นุ่ม/ยืดหยุ่น", "เริ่มแข็ง", "แข็ง/ตาย"],         // สภาพเนื้อยาง
    crackLevel: ["ไม่มี", "มีเล็กน้อย", "แตกชัดเจน"],                 // รอยแตกลายงา
    bulge: ["ไม่มี", "พบรอยบวม"],                                 // การบวม/พอง
    damage: ["ไม่มี", "มีรอยตื้น", "แผลลึก/เห็นโครงสร้าง"],             // บาด/ตำ/ฉีก/ขาด
    braking: ["นุ่มนวล ค่อยๆเหยียบเบรก", "เบรกแรง/กะทันหันบ่อยครั้ง"],   // Smooth braking, Strong braking
    road: ["ถนนเรียบ", "ถนนขรุขระ/ฝุ่นเยอะ", "เต็มไปด้วยหลุม"],        // Smooth road, Rough road/Dusty Road, There are many holes
    speed: ["ต่ำ (<60)", "ปานกลาง (80-100)", "สูง (>120)"],       // Low (<60), Medium (80-100), High (>120)
    load: ["น้อยกว่า 400-500 กก.", "มากกว่า 500 กก."],             // Less than 400-500 kg, More than 5500 kg
};

export default function TireForm() {
    const { calculate } = useTireCalculator();
    const navigate = useNavigate();
    const [touched, setTouched] = useState({});

    const [form, setForm] = useState({
        mileage: "",
        treadStart: 8,   
        treadCurrent: 8, 
        treadFrontLeft: 8, 
        treadFrontRight: 8, 
        treadBackLeft: 8, 
        treadBackRight: 8, 
        speed: 0,
        braking: 0,
        road: 0,
        load: 0,
        rubberCondition: 0,
        crackLevel: 0,
        bulge: 0,
        damage: 0,
        age: "",
        ageMonth: 0,
        kmPerYear: "",
    });


    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const isError = (field) => {
        if (!touched[field]) return false;
        const value = form[field];
        return value === "" || value === null || value === undefined;
        // ไม่ต้องเช็ค === 0 เพราะ 0 เป็นค่าที่ valid
    };

    const handleChange = (field, value) => {
        console.log('value ==> ', value);
        
        // ถ้าเป็น number field ให้แปลงเป็น number ก่อน
        const numberFields = ["mileage", "age"];
        const finalValue = numberFields.includes(field) 
            ? (value === "" ? "" : Number(value))  // เก็บ "" ถ้าว่าง, แปลงเป็น number ถ้ามีค่า
            : value;
        
        setForm((prev) => ({ ...prev, [field]: finalValue }));
    };

    const handleSubmit = () => {
        try {
            console.log('ประเมินอายุการใช้งานยาง')
            const requiredFields = ["mileage", "age"];
            
            setTouched(Object.fromEntries(requiredFields.map((f) => [f, true])));

            // เช็คว่าว่างหรือเป็น 0 (ถ้าไม่ต้องการให้กรอก 0)
            const hasError = requiredFields.some((f) => {
                const val = form[f];
                return val === "" || val === null || val === undefined || val <= 0;
            });
            
            if (hasError) return;

            calculate(form);
            localStorage.setItem("tireData", JSON.stringify(form));
            navigate("/result");
        } catch (err) {
            console.error('error ==> ', err)
        }
    };

    useEffect(() => {
        const {
            treadFrontLeft = 0,
            treadFrontRight = 0,
            treadBackLeft = 0,
            treadBackRight = 0,
        } = form;

        const avg = (
            treadFrontLeft +
            treadFrontRight +
            treadBackLeft +
            treadBackRight
        ) / 4;

        handleChange("treadCurrent", Number(avg.toFixed(2)));
    }, [
        form.treadFrontLeft,
        form.treadFrontRight,
        form.treadBackLeft,
        form.treadBackRight
    ]);

    // เปลี่ยนภาษา
    // const [language, setLanguage] = useState("th");
    const [language, setLanguage] = useState(
        localStorage.getItem("language") || "th"
    );
    const translations = {
        th,
        en
    };
    const t = translations[language];

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };


    return (
        <Box maxWidth={600} mx="auto" p={3}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: "999px",
                        p: 0.5,
                        bgcolor: "#f3f4f6",
                    }}
                >
                    <ToggleButtonGroup
                        exclusive
                        value={language}
                        onChange={(_, value) => {
                            if (value !== null) {
                                handleLanguageChange(value);
                            }
                        }}
                        sx={{
                            "& .MuiToggleButton-root": {
                                border: 0,
                                borderRadius: "999px !important",
                                px: 2,
                                py: 0.5,
                                textTransform: "none",
                                fontWeight: 600,
                                color: "#555",
                                transition: "all .2s ease",
                            },

                            "& .Mui-selected": {
                                bgcolor: "#1976d2 !important",
                                color: "#fff !important",
                                boxShadow: "0 2px 8px rgba(25,118,210,.25)",
                            },
                        }}
                    >
                        <ToggleButton value="th" sx={{mr: '5px'}}>
                            🇹🇭 ไทย
                        </ToggleButton>

                        <ToggleButton value="en">
                            🇺🇸 EN
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Paper>
            </Box>

            <Box mb={3}>
                <Typography variant="h6" fontWeight={500}>
                    {t.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t.subtitle}  
                </Typography>
            </Box>

            {/* ข้อมูลการใช้งาน */}
            <SectionCard title={<Typography fontSize={20}><span style={{fontWeight: 'bold'}}> {t.usageInfo} </span></Typography>}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, }}>
                    {/* TreadCurrent */}
                    {/* <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            ดอกยางเฉลี่ย (4 ล้อ): {form.treadCurrent} มม. (ปัจจุบัน)
                        </Typography>
                        <Slider
                            min={0} max={8} step={0.5}
                            value={form.treadCurrent}
                            onChange={(_, val) => handleChange("treadCurrent", val)}
                            marks={[
                                { value: 0, label: "0" },
                                { value: 1.6, label: "1.6" },
                                { value: 8, label: "8" },
                            ]}
                            valueLabelDisplay="auto"
                        />
                    </Box> */}

                    {/* <Box mb={2} sx={{pb: 2}}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            ดอกยางเฉลี่ย (4 ล้อ): {form.treadCurrent} มม. (ปัจจุบัน)
                        </Typography>
                    </Box> */}

                    {/* ล้อหน้าซ้าย */}
                    {/* <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            ล้อหน้าซ้าย: {form.treadFrontLeft ?? 0} มม.
                        </Typography>
                        <Slider
                            min={0} max={8} step={0.5}
                            value={form.treadFrontLeft}
                            onChange={(_, val) => handleChange("treadFrontLeft", val)}
                            marks={[
                                { value: 0, label: "0" },
                                { value: 1.6, label: "1.6" },
                                { value: 8, label: "8" },
                            ]}
                            valueLabelDisplay="auto"
                        />
                    </Box> */}
                    {/* ล้อหน้าขวา */}
                    {/* <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            ล้อหน้าขวา: {form.treadFrontRight ?? 0} มม.
                        </Typography>
                        <Slider
                            min={0} max={8} step={0.5}
                            value={form.treadFrontRight}
                            onChange={(_, val) => handleChange("treadFrontRight", val)}
                            marks={[
                                { value: 0, label: "0" },
                                { value: 1.6, label: "1.6" },
                                { value: 8, label: "8" },
                            ]}
                            valueLabelDisplay="auto"
                        />
                    </Box> */}
                    {/* ล้อหลังซ้าย */}
                    {/* <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            ล้อหลังซ้าย: {form.treadBackLeft ?? 0} มม.
                        </Typography>
                        <Slider
                            min={0} max={8} step={0.5}
                            value={form.treadBackLeft}
                            onChange={(_, val) => handleChange("treadBackLeft", val)}
                            marks={[
                                { value: 0, label: "0" },
                                { value: 1.6, label: "1.6" },
                                { value: 8, label: "8" },
                            ]}
                            valueLabelDisplay="auto"
                        />
                    </Box> */}
                    {/* ล้อหลังขวา */}
                    {/* <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            ล้อหลังขวา: {form.treadBackRight ?? 0} มม.
                        </Typography>
                        <Slider
                            min={0} max={8} step={0.5}
                            value={form.treadBackRight}
                            onChange={(_, val) => handleChange("treadBackRight", val)}
                            marks={[
                                { value: 0, label: "0" },
                                { value: 1.6, label: "1.6" },
                                { value: 8, label: "8" },
                            ]}
                            valueLabelDisplay="auto"
                        />
                    </Box> */}

                    {/* <TextField
                        label="ระยะทางต่อปี"
                        type="number"
                        value={form.kmPerYear}
                        onChange={(e) => handleChange("kmPerYear", e.target.value)}
                        onBlur={() => handleBlur("kmPerYear")}
                        error={isError("kmPerYear")}
                        helperText={isError("kmPerYear") ? "กรุณากรอกระยะทางต่อปี" : ""}
                        InputProps={{ endAdornment: <InputAdornment position="end"> กม./ปี </InputAdornment> }}
                        size="small"
                        fullWidth
                        sx={{ pb: 2 }}
                    /> */}

                    {/* MileageAccumulated */}
                    {/* <TextField
                        label="ระยะทางสะสม (กม.)"
                        type="number"
                        value={form.mileage}
                        onChange={(e) => handleChange("mileage", e.target.value)}
                        onBlur={() => handleBlur("mileage")}
                        error={isError("mileage")}
                        helperText={isError("mileage") ? "กรุณากรอกระยะทางสะสม (กม.)" : ""}
                        InputProps={{ endAdornment: <InputAdornment position="end"> กม. </InputAdornment> }}
                        size="small"
                        fullWidth
                        sx={{ pb: 2 }}
                    /> */}
                    <TextField
                        label={t.mileage}
                        type="number"
                        value={form.mileage}
                        onChange={(e) => handleChange("mileage", e.target.value)}
                        onBlur={() => handleBlur("mileage")}
                        error={isError("mileage")}
                        helperText={isError("mileage") ? t.requiredMileage : ""}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {t.km}
                                    </InputAdornment>
                                )
                            }
                        }}
                        size="small"
                        fullWidth
                        sx={{ pb: 2 }}
                    />

                    {/* <TextField
                        label="ระยะเวลาใช้งาน / อายุยาง (ปี)"
                        type="number"
                        value={form.age}
                        onChange={(e) => handleChange("age", e.target.value)}
                        onBlur={() => handleBlur("age")}
                        error={isError("age")}
                        helperText={isError("age") ? "กรุณากรอกระยะเวลาใช้งาน" : ""}
                        InputProps={{ endAdornment: <InputAdornment position="end"> ปี </InputAdornment> }}
                        size="small"
                        fullWidth
                        sx={{ pb: 2 }}
                    /> */}
                    <TextField
                        label={t.age}
                        type="number"
                        value={form.age}
                        onChange={(e) => handleChange("age", e.target.value)}
                        onBlur={() => handleBlur("age")}
                        error={isError("age")}
                        helperText={isError("age") ? t.requiredAge : ""}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {t.year}
                                    </InputAdornment>
                                )
                            }
                        }}
                        size="small"
                        fullWidth
                        sx={{ pb: 2 }}
                    />
                </Box>
            </SectionCard>

            {/* สภาพยาง */}
            <SectionCard title={<Typography fontSize={20}><span style={{fontWeight: 'bold'}}> {t.tireCondition} </span></Typography>}>
                <ChipField label={t.rubberCondition} field="rubberCondition" options={t.options.rubberCondition} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label={t.crackLevel} field="crackLevel" options={t.options.crackLevel} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label={t.bulge} field="bulge" options={t.options.bulge} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label={t.damage} field="damage" options={t.options.damage} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
            </SectionCard>

            {/* ปัจจัยการใช้งาน */}
            <SectionCard title={<Typography fontSize={20}><span style={{fontWeight: 'bold'}}> {t.usageFactor} </span></Typography>}>
                <ChipField label={t.braking} field="braking" options={t.options.braking} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label={t.road} field="road" options={t.options.road} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label={t.speed} field="speed" options={t.options.speed} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label={t.load} field="load" options={t.options.load} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
            </SectionCard>

            <Box display="flex" gap={4} width="100%" sx={{ mb: 4 }}>
                <Button 
                    variant="outlined" 
                    sx={{ width: '18vh', borderRadius: '8px', mr: 2 }} 
                    onClick={() => setForm({ 
                        mileage: "", 
                        treadStart: 8,   
                        treadCurrent: 8, 
                        speed: 0, 
                        braking: 0, 
                        road: 0, 
                        load: 0, 
                        rubberCondition: 0, 
                        crackLevel: 0, 
                        bulge: 0, 
                        damage: 0, 
                        age: "", 
                        kmPerYear: "" 
                    })}
                >
                    {t.clear}
                </Button>
            
                <Button variant="contained" sx={{ width: '18vh', borderRadius: '8px' }} onClick={handleSubmit} disableElevation>
                    {t.calculate}
                </Button>
            </Box>
        </Box>
    );
}