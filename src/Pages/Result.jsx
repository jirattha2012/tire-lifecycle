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

import th from "../locales/th.json";
import en from "../locales/en.json";

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

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );
  const translations = { th, en };
  const t = translations[language];


  if (!data || !result) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography> {t.result.loading} </Typography>
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
          📊 {t.resulttitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t.result.subtitle}
        </Typography>
      </Box>

      {/* Input Summary */}
      <Card sx={{ mb: 3, backgroundColor: "#f5f5f5" }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            📝 {t.result.inputSummary}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {t.result.mileage}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.mileage.toLocaleString()} {t.km}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {t.result.tireAge}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.age} {t.year}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {t.result.initialTread}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.treadCurrent} {t.mm}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {t.result.mileagePerYear}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.mileageYear.toLocaleString()} {t.result.kmPerYear}
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
            result.risk === "UNSAFE"
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
                {t.result.riskStatus}
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
                🔍 {t.result.treadStatus}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography variant="body2"> {t.result.initialTread} </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {result.treadCurrent} {t.mm}
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
                  {t.result.minimum}: 1.6 {t.mm} | {t.result.initial}: {result.treadStart} {t.mm}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t.result.estimatedTread} (Linear Model)
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {result.predictedTread} {t.mm}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {/* y = 8 − 0.00009 × {result.mileage.toLocaleString()} */}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t.result.remainingTread}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {result.treadRemaining} {t.mm}
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
                ⏱️ {t.result.rul} (RUL)
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography variant="body2"> {t.result.estimated} </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {result.finalRULyear.toFixed(1)} {t.year}
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
                  {t.and} {result.finalRULkm.toLocaleString()} {t.km}
                </Typography>
              </Box>

              {/* แสดง note ถ้าถูก cap ด้วย age */}
              {result.isAgeCapped && (
                <Alert severity="warning" sx={{ mb: 2, py: 0.5 }}>
                  <Typography variant="caption">
                    {t.result.maxAgeLimit}
                    {/* (ใช้สูตร RULyear = 5 − {result.age} = {result.finalRULyear.toFixed(1)} ปี) */}
                  </Typography>
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t.result.rulFromWear}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {result.RULyear.toFixed(1)} {t.year} ({result.RULkm.toLocaleString()} {t.km})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {/* RULkm = ({result.treadCurrent} − 1.6) / (0.00009 × {result.UF.toFixed(1)}) */}
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
            🎯 {t.result.usageFactors}
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, backgroundColor: "#e3f2fd", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  BS ({t.result.break})
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {result.BS}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, backgroundColor: "#f3e5f5", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  RS ({t.result.road})
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {result.RS}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, backgroundColor: "#e0f2f1", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  SS ({t.result.speed})
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {result.SS}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, backgroundColor: "#fce4ec", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  LS ({t.result.load})
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {result.LS}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ p: 2, backgroundColor: "#fff9c4", borderRadius: 1 }}>
            {/* <Typography variant="body2" color="text.secondary">
              Usage Factor (UF) = 1 + BS + RS + SS + LS
            </Typography> */}
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
            📉 {t.result.wearCalculation}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} size={{ xs: 6 }}>
              <Paper sx={{ p: 2, backgroundColor: "#f1f8e9" }}>
                <Typography variant="body2" color="text.secondary">
                  Base Wear Rate
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {result.WEAR_RATE_COEFFICIENT}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t.result.mmPerkm} (r = 0.8999)
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} size={{ xs: 6 }}>
              <Paper sx={{ p: 2, backgroundColor: "#ede7f6" }}>
                <Typography variant="body2" color="text.secondary">
                  Adjusted Wear Rate 
                  {/* (รวม UF + Condition) */}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {result.adjustedWearRate}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t.result.displayOnly}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="body2" color="text.secondary">
              {t.result.conditionPenalty}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {(result.conditionPenalty * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t.result.conditionPenaltyDesc}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Scoring */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            📊 {t.result.componentScore}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} size={{ xs: 6 }}>
              <Paper sx={{ p: 2, backgroundColor: "#fcf3d8" }}>
                <Typography variant="body2" color="text.secondary">
                  {t.result.ageIndex}
                  {/* × 0.3 */}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={result.ageIndex * 100}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {result.ageIndex.toFixed(1)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} size={{ xs: 6 }}>
              <Paper sx={{ p: 2, backgroundColor: "#e8d5f2" }}>
                <Typography variant="body2" color="text.secondary">
                  {t.result.wearIndex}
                  {/* × 0.4 */}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={result.wearIndex * 100}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {result.wearIndex.toFixed(1)}
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
              {/* CS = 0.3 × Age Index + 0.4 × Wear Index + 0.3 × Condition Penalty */}
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
            result.risk === "UNSAFE"
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
            💡 {t.result.recommendation}
          </Typography>
          {result.risk === "UNSAFE" && (
            <Typography variant="body2">
              ⚠️ {t.result.unsafeMessage}
            </Typography>
          )}
          {result.risk === "HIGH RISK" && (
            <Typography variant="body2">
              ⚠️ {t.result.highRiskMessage}
            </Typography>
          )}
          {result.risk === "WARNING" && (
            <Typography variant="body2">
              ⚠️ {t.result.warningMessage}
            </Typography>
          )}
          {result.risk === "SAFE" && (
            <Typography variant="body2">
              ✅ {t.result.safeMessage}{" "}
              {result.finalRULyear.toFixed(1)} {t.year}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button variant="outlined" fullWidth onClick={() => navigate("/")}>
          {t.result.refill}
        </Button>
        <Button variant="contained" fullWidth onClick={() => window.print()}>
          {t.result.print}
        </Button>
      </Stack>
    </Box>
  );
}