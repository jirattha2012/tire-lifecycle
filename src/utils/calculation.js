// calculation.js
// สูตรจาก PDF: y = 8 - 0.00009×Mileage, RULkm = (tread-1.6)/(0.00009×UF)

const WEAR_RATE_COEFFICIENT = 0.00009; // มม./กม. (จาก PDF)
const TREAD_START = 8;                  // ดอกยางเริ่มต้น มม.
const MIN_TREAD = 1.6;                  // ดอกยางต่ำสุด มม.
const MAX_TIRE_AGE = 5;                 // อายุยางสูงสุด ปี

/**
 * คำนวณดอกยางตามการคาดการณ์ (Linear Model จาก PDF)
 * สูตร: y = 8 - 0.00009 × Mileage  (r = 0.8999)
 *
 * @param {number} mileage - ระยะทางสะสม (กม.)
 * @param {number} treadStart - ดอกยางเริ่มต้น (มม.) default = 8
 * @returns {number} ดอกยางที่คาดการณ์ (มม.)
 */
export const calculatePredictedTread = (mileage, treadStart = TREAD_START) => {
  return treadStart - WEAR_RATE_COEFFICIENT * mileage;
};

/**
 * คำนวณ Wear Rate จากข้อมูลจริง (สำหรับ display เปรียบเทียบ)
 *
 * @param {number} treadStart - ดอกยางเริ่มต้น (มม.)
 * @param {number} treadCurrent - ดอกยางปัจจุบัน (มม.)
 * @param {number} mileage - ระยะทางสะสม (กม.)
 * @returns {number} อัตราการสึก (มม./กม.)
 */
export const calculateActualWearRate = (treadStart, treadCurrent, mileage) => {
  if (mileage <= 0) return 0;
  return (treadStart - treadCurrent) / mileage;
};

/**
 * คำนวณ RULkm ตามสูตร PDF
 * สูตร: RULkm = (Tread depth - 1.6) / (0.00009 × UF)
 *
 * @param {number} treadCurrent - ดอกยางปัจจุบันที่วัดจริง (มม.)
 * @param {number} UF - Usage Factor (1 + BS + RS + SS + LS)
 * @returns {number} ระยะทางที่เหลือ (กม.)
 */
export const calculateRULkm = (treadCurrent, UF) => {
  const treadRemaining = Math.max(0, treadCurrent - MIN_TREAD);
  if (UF <= 0) return 0;
  return treadRemaining / (WEAR_RATE_COEFFICIENT * UF);
};

/**
 * คำนวณ RULyear ตามสูตร PDF
 * สูตร: RULyear = RULkm / (Mileage / Tire age)
 *
 * @param {number} RULkm - ระยะทางที่เหลือ (กม.)
 * @param {number} mileagePerYear - ระยะทางต่อปี (กม./ปี)
 * @returns {number} อายุการใช้งานที่เหลือ (ปี)
 */
export const calculateRULyear = (RULkm, mileagePerYear) => {
  if (mileagePerYear <= 0) return 0;
  return RULkm / mileagePerYear;
};

/**
 * ปรับ RUL ตามข้อจำกัดอายุยาง (จาก PDF)
 * ถ้าคำนวณเกิน 5 ปี ให้ใช้: RULyear = 5 - age
 *
 * @param {number} RULyear - อายุที่คำนวณได้ (ปี)
 * @param {number} age - อายุยางปัจจุบัน (ปี)
 * @param {number} mileagePerYear - ระยะทางต่อปี (กม./ปี)
 * @returns {{ finalRULyear: number, finalRULkm: number, isAgeCapped: boolean }}
 */
export const applyAgeCap = (RULyear, age, mileagePerYear) => {
  if (RULyear + age > MAX_TIRE_AGE) {
    const finalRULyear = Math.max(0, MAX_TIRE_AGE - age);
    return {
      finalRULyear,
      finalRULkm: Math.round(finalRULyear * mileagePerYear),
      isAgeCapped: true,
    };
  }
  return {
    finalRULyear: RULyear,
    finalRULkm: Math.round(RULyear * mileagePerYear),
    isAgeCapped: false,
  };
};