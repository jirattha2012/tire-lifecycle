// useTireCalculator.js
import { useState } from "react";

export const useTireCalculator = () => {
  const [result, setResult] = useState(null);

  const calculate = (data) => {
    const {
      mileage,
      treadStart = 8,
      treadCurrent,
      speed,
      braking,
      road,
      load,
      rubberCondition,
      crackLevel,
      bulge,
      damage,
      age,
    } = data;

    // 🛑 กัน error
    if (!mileage || !age || mileage <= 0 || age <= 0) return;

    // ✅ Helper function
    const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

    // -------------------------
    // 1. Severity Factors (จากสูตร PDF)
    // -------------------------
    // Braking Severity: Smooth = 0, Strong = 0.1
    const BS = [0, 0.1][braking] ?? 0;

    // Road Severity: Smooth = 0, Rough/Dusty = 0.1, Many holes = 0.2
    const RS = [0, 0.1, 0.2][road] ?? 0;

    // Speed Severity: Low(<60) = 0, Medium(80-100) = 0.05, High(>120) = 0.1
    const SS = [0, 0.05, 0.1][speed] ?? 0;

    // Load Severity: Less than 400-500kg = 0, More than 500kg = 0.1
    const LS = [0, 0.1][load] ?? 0;

    // -------------------------
    // 2. Usage Factor (UF)
    // จากสูตร PDF: UF = 1 + BS + RS + SS + LS
    // -------------------------
    const UF = 1 + BS + RS + SS + LS;

    // -------------------------
    // 3. Mileage per Year
    // -------------------------
    const mileageYear = mileage / age;

    // -------------------------
    // 4. Predicted Tread (Linear Model จาก PDF)
    // สูตร: y = 8 - 0.00009 × Mileage  (r = 0.8999)
    // -------------------------
    const WEAR_RATE_COEFFICIENT = 0.00009; // มม./กม.
    const predictedTread = treadStart - WEAR_RATE_COEFFICIENT * mileage;

    // -------------------------
    // 5. Condition Penalty (ความเสียหายของยาง)
    // ใช้สำหรับ Component Score เท่านั้น
    // ไม่ได้นำไปใช้ใน RULkm ตาม PDF
    // -------------------------
    let conditionPenalty = 0;

    // สภาพเนื้อยาง: 0=นุ่ม(0), 1=เริ่มแข็ง(0.05), 2=แข็ง/ตาย(0.15)
    if (rubberCondition === 2) conditionPenalty += 0.15;
    else if (rubberCondition === 1) conditionPenalty += 0.05;

    // รอยแตกลายงา: 0=ไม่มี(0), 1=เล็กน้อย(0.10), 2=แตกชัดเจน(0.20)
    if (crackLevel === 2) conditionPenalty += 0.20;
    else if (crackLevel === 1) conditionPenalty += 0.10;

    // การบวม/พอง: 0=ไม่มี(0), 1=พบรอยบวม(0.25)
    if (bulge === 1) conditionPenalty += 0.25;

    // บาด/ตำ/ฉีก/ขาด: 0=ไม่มี(0), 1=รอยตื้น(0.15), 2=แผลลึก(0.30)
    if (damage === 2) conditionPenalty += 0.30;
    else if (damage === 1) conditionPenalty += 0.15;

    // -------------------------
    // 6. Remaining Useful Life (RULkm)
    // จากสูตร PDF: RULkm = (Tread depth - 1.6) / (0.00009 × UF)
    // ใช้ treadCurrent (ดอกยางที่วัดจริง) ไม่ใช่ predictedTread
    // -------------------------
    const treadRemaining = Math.max(0, treadCurrent - 1.6);
    const RULkm =
      UF > 0 ? treadRemaining / (WEAR_RATE_COEFFICIENT * UF) : 0;

    // -------------------------
    // 7. Remaining Useful Life (RULyear)
    // จากสูตร PDF: RULyear = RULkm / (Mileage / Tire age)
    // -------------------------
    const RULyear = mileageYear > 0 ? RULkm / mileageYear : 0;

    // -------------------------
    // 8. Max Age Constraint (จาก PDF)
    // ไม่ควรใช้เกิน 5 ปี
    // ถ้าคำนวณเกิน 5 ปี ให้ใช้: RULyear = 5 - age
    // -------------------------
    const MAX_TIRE_AGE = 5;
    let finalRULyear;
    let finalRULkm;

    if (RULyear + age > MAX_TIRE_AGE) {
      // เกินอายุสูงสุด → ตัดด้วยสูตร PDF: RULyear = 5 - age
      finalRULyear = Math.max(0, MAX_TIRE_AGE - age);
      finalRULkm = Math.round(finalRULyear * mileageYear);
    } else {
      finalRULyear = RULyear;
      finalRULkm = Math.round(RULkm);
    }

    // -------------------------
    // 9. Adjusted Wear Rate (ใช้แสดงผลเพิ่มเติม)
    // รวม conditionPenalty สำหรับ display
    // -------------------------
    const adjustedWearRate =
      WEAR_RATE_COEFFICIENT * UF * (1 + conditionPenalty);

    // -------------------------
    // 10. Component Score (CS)
    // CS = 0.3 × Age Index + 0.4 × Wear Index + 0.3 × Condition Penalty
    // -------------------------
    const ageIndex = clamp(age / MAX_TIRE_AGE);
    const wearIndex = clamp(
      (treadStart - treadCurrent) / (treadStart - 1.6)
    );
    const CS = 0.3 * ageIndex + 0.4 * wearIndex + 0.3 * conditionPenalty;

    // -------------------------
    // 11. Risk Assessment
    // -------------------------
    let risk = "SAFE";
    let riskColor = "green";

    // ⚠️ Warning Conditions
    const hasWarningCondition =
      rubberCondition === 1 || // เริ่มแข็ง
      crackLevel === 1 ||      // มีเล็กน้อย
      damage === 1;            // มีรอยตื้น

    // 🚨 Unsafe Conditions (รวมถึง mileage > 80,000 km หรือ age > 5 ปี)
    const MAX_MILEAGE = 80000; // กม.
    const hasUnsafeCondition =
      treadCurrent <= 1.6 ||
      age > MAX_TIRE_AGE ||
      mileage > MAX_MILEAGE ||  // เพิ่มเงื่อนไข: ระยะทาง > 80,000 km
      rubberCondition === 2 || // แข็ง/ตาย
      crackLevel === 2 ||      // แตกชัดเจน
      bulge === 1 ||           // พบรอยบวม
      damage === 2;            // แผลลึก/เห็นโครงสร้าง

    if (hasUnsafeCondition) {
      risk = "UNSAFE";
      riskColor = "red";
    } else if (
      hasWarningCondition ||
      CS >= 0.4 ||
      treadCurrent <= 4
    ) {
      risk = "WARNING";
      riskColor = "#FFB800";
    } else {
      risk = "SAFE";
      riskColor = "green";
    }

    // Critical conditions → REPLACE NOW (รวมถึง mileage > 80,000 km หรือ age > 5 ปี)
    const isCriticalCondition =
      treadCurrent <= 1.6 ||
      age > MAX_TIRE_AGE ||
      mileage > MAX_MILEAGE ||  // เพิ่มเงื่อนไข: ระยะทาง > 80,000 km
      rubberCondition === 2 ||
      crackLevel === 2 ||
      bulge === 1 ||
      damage === 2;

    if (isCriticalCondition) {
      risk = "REPLACE NOW";
      riskColor = "red";
    } else if (CS > 0.7 || treadCurrent <= 3) {
      risk = "HIGH RISK";
      riskColor = "orange";
    } else if (CS >= 0.4 || treadCurrent <= 4) {
      risk = "WARNING";
      riskColor = "#FFB800";
    }

    // -------------------------
    // 12. Result Object
    // -------------------------
    setResult({
      // Input Data
      mileage,
      age,
      treadCurrent,
      treadStart,
      mileageYear: parseFloat(mileageYear.toFixed(2)),

      // Severity Factors
      BS,
      RS,
      SS,
      LS,
      UF: parseFloat(UF.toFixed(4)),

      // Condition
      conditionPenalty: parseFloat(conditionPenalty.toFixed(3)),

      // Wear Calculation
      WEAR_RATE_COEFFICIENT,
      predictedTread: parseFloat(predictedTread.toFixed(2)),
      adjustedWearRate: parseFloat(adjustedWearRate.toExponential(3)),

      // RUL (ตาม PDF)
      treadRemaining: parseFloat(treadRemaining.toFixed(2)),
      RULkm: parseFloat(RULkm.toFixed(0)),
      RULyear: parseFloat(RULyear.toFixed(2)),
      finalRULkm,
      finalRULyear: parseFloat(finalRULyear.toFixed(2)),
      isAgeCapped: RULyear + age > MAX_TIRE_AGE, // บอกว่าถูก cap ด้วย age หรือเปล่า

      // Scoring
      ageIndex: parseFloat(ageIndex.toFixed(2)),
      wearIndex: parseFloat(wearIndex.toFixed(2)),
      CS: parseFloat(CS.toFixed(3)),

      // Risk
      risk,
      riskColor,
      // isCriticalCondition,
      hasUnsafeCondition,
      hasWarningCondition,
    });
  };

  return { result, calculate };
};