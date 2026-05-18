import { useEffect, useState, useCallback } from "react";
import { useTireCalculator } from "../hooks/useTireCalculator";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  LinearProgress,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const [data, setData] = useState(null);
  const { result, calculate } = useTireCalculator();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("tireData");

    if (saved) {
      const parsed = JSON.parse(saved);

      setData(parsed);
      calculate(parsed);
    }
  }, []);

  if (!data || !result) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>กำลังโหลด...</Typography>
      </Box>
    );
  }

  // -------------------------
  // Tread Progress
  // -------------------------
  const treadProgress = Math.max(
    0,
    Math.min(100, ((result.treadCurrent - 1.6) / (result.treadStart - 1.6)) * 100)
  );

  // -------------------------
  // RUL Progress (Year-based, max display = 5 ปี)
  // -------------------------
  const maxDisplayYear = 5;
  const rulYearProgress = Math.max(
    0,
    Math.min(100, (result.finalRULyear / maxDisplayYear) * 100)
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          📊 ผลการประเมินอายุการใช้งานยาง
        </Typography>
        <Typography variant="body2" color="text.secondary">
          วิเคราะห์จากข้อมูลที่คุณกรอก
        </Typography>
      </Box>

      {/* Input Summary */}
      <Card sx={{ mb: 3, backgroundColor: "#f5f5f5" }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            📝 ข้อมูลที่ใช้คำนวณ
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ระยะทางสะสม
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.mileage.toLocaleString()} กม.
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                อายุยาง
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.age} ปี
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ดอกยางปัจจุบัน
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.treadCurrent} มม.
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ระยะทาง/ปี
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.mileageYear.toLocaleString()} กม./ปี
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card
        sx={{
          mb: 3,
          backgroundColor:
            result.risk === "REPLACE NOW"
              ? "#ffebee"
              : result.risk === "HIGH RISK"
              ? "#fff3e0"
              : result.risk === "WARNING"
              ? "#fffde7"
              : "#e8f5e9",
          borderLeft: `5px solid ${result.riskColor}`,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                สถานะความเสี่ยง
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: result.riskColor }}
              >
                {result.risk}
              </Typography>
            </Box>
            <Chip
              label={result.risk}
              sx={{
                backgroundColor: result.riskColor,
                color: "white",
                fontWeight: "bold",
                ml: "auto",
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Main Results Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Tread Depth Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                🔍 สถานะดอกยาง
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography variant="body2">ดอกยางปัจจุบัน</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {result.treadCurrent} มม.
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={treadProgress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        treadProgress < 20
                          ? "#f44336"
                          : treadProgress < 50
                          ? "#ff9800"
                          : "#4caf50",
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  ต่ำสุด: 1.6 มม. | เริ่มต้น: {result.treadStart} มม.
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ดอกยางตามการคาดการณ์ (Linear Model)
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {result.predictedTread} มม.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  y = 8 − 0.00009 × {result.mileage.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ดอกยางเหลือ (ก่อนถึงจุดต้องเปลี่ยน 1.6 มม.)
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {result.treadRemaining} มม.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RUL Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                ⏱️ อายุการใช้งานที่เหลือ (RUL)
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography variant="body2">ประมาณ</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {result.finalRULyear.toFixed(2)} ปี
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={rulYearProgress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        rulYearProgress < 20
                          ? "#f44336"
                          : rulYearProgress < 50
                          ? "#ff9800"
                          : "#4caf50",
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  หรือ {result.finalRULkm.toLocaleString()} กม.
                </Typography>
              </Box>

              {/* แสดง note ถ้าถูก cap ด้วย age */}
              {result.isAgeCapped && (
                <Alert severity="warning" sx={{ mb: 2, py: 0.5 }}>
                  <Typography variant="caption">
                    ถูกจำกัดด้วยอายุยางสูงสุด 5 ปี
                    (ใช้สูตร RULyear = 5 − {result.age} = {result.finalRULyear.toFixed(2)} ปี)
                  </Typography>
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  RUL จากอัตราการสึก (ก่อน cap อายุ)
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {result.RULyear.toFixed(2)} ปี ({result.RULkm.toLocaleString()} กม.)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  RULkm = ({result.treadCurrent} − 1.6) / (0.00009 × {result.UF.toFixed(2)})
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Usage Factors */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            🎯 ปัจจัยการใช้งาน (Severity Factors)
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, backgroundColor: "#e3f2fd", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  BS (เบรก)
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {result.BS}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, backgroundColor: "#f3e5f5", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  RS (ถนน)
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {result.RS}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, backgroundColor: "#e0f2f1", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  SS (ความเร็ว)
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {result.SS}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, backgroundColor: "#fce4ec", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  LS (การบรรทุก)
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {result.LS}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ p: 2, backgroundColor: "#fff9c4", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Usage Factor (UF) = 1 + BS + RS + SS + LS
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {result.UF.toFixed(4)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Wear Calculation */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            📉 การคำนวณอัตราการสึก
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, backgroundColor: "#f1f8e9" }}>
                <Typography variant="body2" color="text.secondary">
                  Base Wear Rate (จาก PDF)
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {result.WEAR_RATE_COEFFICIENT}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  มม./กม. (r = 0.8999)
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, backgroundColor: "#ede7f6" }}>
                <Typography variant="body2" color="text.secondary">
                  Adjusted Wear Rate (รวม UF + Condition)
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {result.adjustedWearRate}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ใช้สำหรับ display เท่านั้น
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="body2" color="text.secondary">
              Condition Penalty (ความเสียหาย)
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {(result.conditionPenalty * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              สะสมจาก: ยางแข็ง / รอยแตก / บวม / บาด
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Scoring */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            📊 คะแนนประเมิน (Component Score)
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, backgroundColor: "#fcf3d8" }}>
                <Typography variant="body2" color="text.secondary">
                  Age Index (อายุ) × 0.3
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={result.ageIndex * 100}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {result.ageIndex.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, backgroundColor: "#e8d5f2" }}>
                <Typography variant="body2" color="text.secondary">
                  Wear Index (การสึก) × 0.4
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={result.wearIndex * 100}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {result.wearIndex.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              p: 2,
              backgroundColor: "#f3e5f5",
              borderRadius: 1,
              border: "2px solid #9c27b0",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              CS = 0.3 × Age Index + 0.4 × Wear Index + 0.3 × Condition Penalty
            </Typography>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                color:
                  result.CS > 0.7
                    ? "#d32f2f"
                    : result.CS >= 0.4
                    ? "#f57c00"
                    : "#388e3c",
              }}
            >
              {result.CS.toFixed(3)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • &gt; 0.7 = HIGH RISK | 0.4–0.7 = WARNING | &lt; 0.4 = SAFE
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card
        sx={{
          mb: 4,
          backgroundColor:
            result.risk === "REPLACE NOW"
              ? "#ffcdd2"
              : result.risk === "HIGH RISK"
              ? "#ffe0b2"
              : result.risk === "WARNING"
              ? "#fff9c4"
              : "#c8e6c9",
          borderLeft: `5px solid ${result.riskColor}`,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            💡 คำแนะนำ
          </Typography>
          {result.risk === "REPLACE NOW" && (
            <Typography variant="body2">
              ⚠️ <strong>ต้องเปลี่ยนยางทันที!</strong> ดอกยางไม่เหลือ หรือยางมีอายุ
              เกิน 5 ปี หรือมีความเสียหายวิกฤต
            </Typography>
          )}
          {result.risk === "HIGH RISK" && (
            <Typography variant="body2">
              ⚠️ <strong>เตือน!</strong> ยางอยู่ในสภาพเสี่ยงสูง ควรจัดการเปลี่ยนในเร็วๆ นี้
            </Typography>
          )}
          {result.risk === "WARNING" && (
            <Typography variant="body2">
              ⚠️ <strong>ตั้งสติ!</strong> ยางควรเข้าการบำรุงรักษา และเตรียมตัวเปลี่ยนในอีกไม่นาน
            </Typography>
          )}
          {result.risk === "SAFE" && (
            <Typography variant="body2">
              ✅ <strong>ปลอดภัย!</strong> ยางยังสามารถใช้ได้ มีอายุการใช้งานเหลือประมาณ{" "}
              {result.finalRULyear.toFixed(1)} ปี
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button variant="outlined" fullWidth onClick={() => navigate("/")}>
          กรอกข้อมูลใหม่
        </Button>
        <Button variant="contained" fullWidth onClick={() => window.print()}>
          พิมพ์ผลลัพธ์
        </Button>
      </Stack>
    </Box>
  );
}