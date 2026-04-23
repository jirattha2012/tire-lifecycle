import { useState } from "react";
import { useTireCalculator } from "../hooks/useTireCalculator";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, TextField, Slider, Button,
    Chip, Stack, Paper, Divider, InputAdornment, MenuItem
} from "@mui/material";
import SectionCard from '../components/SectionCard'
import ChipField from '../components/ChipField'

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


    return (
        <Box maxWidth={600} mx="auto" p={3}>
            <Box mb={3}>
                <Typography variant="h6" fontWeight={500}>
                    ระบบประเมินอายุการใช้งานยาง 𖥕
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    กรอกข้อมูลให้ครบเพื่อคำนวณระยะเวลาที่เหลือของยาง  
                </Typography>
            </Box>

            {/* ข้อมูลการใช้งาน */}
            <SectionCard title={<Typography fontSize={20}><span style={{fontWeight: 'bold'}}> ข้อมูลการใช้งาน </span></Typography>}>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                    {/* TreadStart -> treadStart */}
                    {/* <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            ดอกยางเฉลี่ย (4 ล้อ): {form.treadStart} มม. (เริ่มต้น)
                        </Typography>
                        <Slider
                            min={0} max={8.5} step={0.5}
                            value={form.treadStart}
                            onChange={(_, val) => handleChange("treadStart", val)}
                            marks={[
                                { value: 0, label: "0" },
                                { value: 1.6, label: "1.6" },
                                { value: 8, label: "8" },
                            ]}
                            valueLabelDisplay="auto"
                        />
                    </Box> */}

                    {/* TreadCurrent -> treadCurrent */}
                    <Box mb={2}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            ดอกยางเฉลี่ย (4 ล้อ): {form.treadCurrent} มม. (ปัจจุบัน)
                        </Typography>
                        <Slider
                            min={0} max={8.5} step={0.5}
                            value={form.treadCurrent}
                            onChange={(_, val) => handleChange("treadCurrent", val)}
                            marks={[
                                { value: 0, label: "0" },
                                { value: 1.6, label: "1.6" },
                                { value: 8, label: "8" },
                            ]}
                            valueLabelDisplay="auto"
                        />
                    </Box>

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
                    <TextField
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
                    />

                    <TextField
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
                    />
                </Box>
            </SectionCard>

            {/* สภาพยาง */}
            <SectionCard title={<Typography fontSize={20}><span style={{fontWeight: 'bold'}}> ความเสียหาย / สภาพยาง </span></Typography>}>
                <ChipField label="สภาพเนื้อยาง" field="rubberCondition" options={chipOptions.rubberCondition} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label="รอยแตกลายงา" field="crackLevel" options={chipOptions.crackLevel} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label="การบวม/พอง" field="bulge" options={chipOptions.bulge} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label="บาด/ตำ/ฉีก/ขาด" field="damage" options={chipOptions.damage} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
            </SectionCard>

            {/* ปัจจัยการใช้งาน */}
            <SectionCard title={<Typography fontSize={20}><span style={{fontWeight: 'bold'}}>ปัจจัยการใช้งาน</span></Typography>}>
                <ChipField label="พฤติกรรมการเบรค" field="braking" options={chipOptions.braking} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label="สภาพถนน" field="road" options={chipOptions.road} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label="ความเร็วเฉลี่ย (กม./ชม.)" field="speed" options={chipOptions.speed} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
                <ChipField label="การบรรทุก" field="load" options={chipOptions.load} form={form} handleChange={handleChange} sx={{ mt: 2 }} />
            </SectionCard>

            <Box display="flex" gap={4} width="100%">
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
                    ล้างข้อมูล
                </Button>
            
                <Button variant="contained" sx={{ width: '18vh', borderRadius: '8px' }} onClick={handleSubmit} disableElevation>
                    คำนวณ
                </Button>
            </Box>

            <div style={{ padding: '4px', width: '70vh', marginTop: '4vh', marginBottom: '2vh' }}>
                <div style={{textAlign: 'left', color: 'red', fontSize: '16px'}}><u> สูตรคำนวณ </u></div>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>Mileage<span style={{fontSize: '12px'}}>year</span> = Mileage<span style={{fontSize: '12px'}}>acc</span> / Tireage </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>• MR = Mileage<span style={{fontSize: '12px'}}>year</span> / 30,000 </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>• SS = </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>• LS = </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>• α = 0.4 (Constant) </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>Age<span style={{fontSize: '12px'}}>Index</span>= TireAge / 5 </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>Damage<span style={{fontSize: '12px'}}>Index</span> = 1 – (Tread<span style={{fontSize: '12px'}}>Current</span> / Tread<span style={{fontSize: '12px'}}>Start</span>) </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>Component Score = (a₁UF) + (a₂Age<span style={{fontSize: '12px'}}>Index</span>) + (a₃Damage<span style={{fontSize: '12px'}}>Index</span>) </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>UF = (w₁·BS) + (w₂·RS) + (w₃·MR) + (w₄·SS) + (w5·LS) </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>WRbase = (TreadStart − TreadCurrent) / MileageAcc </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>WRadj = WRbase × (1 + αUF) </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>TreadRemaining = TreadCurrent − 1.6 mm </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>RULkm = TreadRemaining / WRadj </p>
                <p style={{textAlign: 'left', color: 'red', fontSize: '16px'}}>RULyear = RULkm / Mileageyear </p>
            </div>
        </Box>
    );
}