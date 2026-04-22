// useTireCalculator.js
import { useState } from "react";

export const useTireCalculator = () => {
  const [result, setResult] = useState(null);

  const calculate = (data) => {
    const {
      mileage,
      treadStart,
      treadCurrent,
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

    // 🛑 กัน error (สำคัญ)
    if (!mileage || !age || mileage <= 0 || age <= 0) return;

    const alpha = 0.4;

    // ✅ helper
    const clamp = (v, min = 0, max = 1) =>
      Math.min(max, Math.max(min, v));

    // -------------------------
    // 1. Usage Scores
    // -------------------------
    const BS = [0.3, 0.8][braking] ?? 0.3;
    const RS = [0.3, 0.6, 1.0][road] ?? 0.3;
    const SS = [0.3, 0.6, 1.0][speed] ?? 0.3;
    const LS = [0.4, 0.9][load] ?? 0.4;

    // -------------------------
    // 2. Mileage
    // -------------------------
    const mileageYear = mileage / age;
    const MR = clamp(mileageYear / 30000);

    // -------------------------
    // 3. Usage Factor
    // -------------------------
    const UF =
      0.25 * BS +
      0.3 * RS +
      0.2 * MR +
      0.1 * SS +
      0.15 * LS;

    // -------------------------
    // 4. Wear Rate
    // -------------------------
    const WRbase =
      (treadStart - treadCurrent) / mileage;

    // damage index
    const damageIndex =
      treadStart > 0
        ? 1 - treadCurrent / treadStart
        : 0;

    // ✅ เพิ่ม realism
    const damageFactor = 1 + 0.5 * damageIndex;

    const conditionFactor =
      1 +
      0.3 * crackLevel +
      0.5 * bulge +
      0.7 * damage;

    const WRadj =
      WRbase *
      (1 + alpha * UF) *
      damageFactor *
      conditionFactor;

    // -------------------------
    // 5. RUL
    // -------------------------
    const treadRemaining = Math.max(
      0,
      treadCurrent - 1.6
    );

    const RULkm =
      WRadj > 0 ? treadRemaining / WRadj : 0;

    const RULyear =
      mileageYear > 0 ? RULkm / mileageYear : 0;

    // -------------------------
    // 6. Index
    // -------------------------
    const ageIndex = clamp(age / 5);

    const CS =
      0.35 * UF +
      0.2 * ageIndex +
      0.45 * damageIndex;

    // -------------------------
    // 7. จำกัดอายุยาง
    // -------------------------
    const remainingYears = Math.max(0, 5 - age);

    const finalRULkm = Math.min(
      RULkm,
      remainingYears * mileageYear
    );

    const finalRULyear =
      mileageYear > 0
        ? finalRULkm / mileageYear
        : 0;

    // -------------------------
    // 8. Risk
    // -------------------------
    let risk = "SAFE";

    const isCriticalCondition =
      rubberCondition === 2 ||
      crackLevel === 2 ||
      bulge === 1 ||
      damage === 2;

    if (
      treadCurrent <= 1.6 ||
      age > 5 ||
      isCriticalCondition
    ) {
      risk = "REPLACE NOW";
    } else if (CS > 0.7) {
      risk = "HIGH RISK";
    } else if (CS >= 0.4) {
      risk = "WARNING";
    }

    // -------------------------
    // 9. Result
    // -------------------------
    setResult({
      mileageYear,
      UF,
      WRbase,
      WRadj,
      RULkm,
      RULyear,
      finalRULkm,
      finalRULyear,
      CS,
      risk,
      isCriticalCondition
    });
  };

  return { result, calculate };
};