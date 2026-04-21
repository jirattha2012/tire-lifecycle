import { useState } from "react";
import { normalize } from "../utils/normalize";
import {
  calculateWearRate,
  adjustWearRate,
  calculateRULkm,
  calculateRULyear
} from "../utils/calculation";
import { getRiskLevel } from "../utils/decision";

export const useTireCalculator = () => {
  const [result, setResult] = useState(null);

  const calculate = (data) => {
    const {
      mileage,
      tread,
      speed,
      braking,
      road,
      load,
      rubberCondition,
      crackLevel,
      bulge,
      damage,
      age
    } = data;

    const TREAD_START = 8.5;
    const alpha = 0.4;

    // ✅ map severity (ต้องแก้ให้ตรง index ของ chip)
    const BS = [0.3, 0.8][braking];
    const RS = [0.3, 0.6, 1.0][road];
    const SS = [0.3, 0.6, 1.0][speed];
    const LS = [0.4, 0.9][load];

    // 1. Mileage per year
    const mileageYear = mileage / age;

    // 2. MR
    const MR = mileageYear / 30000;

    // 3. UF
    const UF =
      0.25 * BS +
      0.3 * RS +
      0.2 * MR +
      0.1 * SS +
      0.15 * LS;

    // 4. WR
    const WRbase = (TREAD_START - tread) / mileage;
    const WRadj = WRbase * (1 + alpha * UF);

    // 5. RUL
    const treadRemaining = tread - 1.6;
    const RULkm = treadRemaining / WRadj;
    const RULyear = RULkm / mileageYear;

    // 6. Index
    const ageIndex = age / 5;
    const damageIndex = 1 - (tread / TREAD_START);

    // 7. Component Score
    const CS =
      0.35 * UF +
      0.2 * ageIndex +
      0.45 * damageIndex;

    // 8. Final RUL (limit อายุ)
    const finalRULkm = Math.min(RULkm, (5 - age) * mileageYear);
    const finalRULyear = finalRULkm / mileageYear;

    // ✅ 9. Risk - เพิ่มเงื่อนไขตรวจสอบสภาพยางร้ายแรง
    let risk = "SAFE";
    
    // 🔴 ตรวจสภาพยางที่ร้ายแรง
    // แข็ง/ตาย || แตกชัดเจน || พบรอยบวม || แผลลึก/เห็นโครงสร้าง
    const isCriticalCondition = (rubberCondition === 2 || crackLevel === 2 || bulge === 1 || damage === 2)

    if (
      tread <= 1.6 ||
      age > 5 ||
      isCriticalCondition  // ✅ เพิ่มเงื่อนไขนี้
    ) {
      risk = "REPLACE NOW";
    } else if (CS > 0.7) {
      risk = "HIGH RISK";
    } else if (CS >= 0.4) {
      risk = "WARNING";
    }

    setResult({
      UF,
      WRbase,
      WRadj,
      RULkm,
      RULyear,
      finalRULkm,
      finalRULyear,
      CS,
      risk,
      isCriticalCondition  // ✅ ส่งค่านี้ไปด้วยถ้าต้องการแสดงใน Result
    });
  };

  return { result, calculate };
};