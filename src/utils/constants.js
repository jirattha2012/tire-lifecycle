// constants.js
// ค่าคงที่สำหรับการคำนวณอายุยาง

/**
 * ========================================
 * TIRE WEAR CONSTANTS
 * ========================================
 */

// Wear Rate Coefficient
// จากสูตร: y = 8 - 0.00009 × Mileage
// หน่วย: มม./กม.
export const WEAR_RATE_COEFFICIENT = 0.00009;

// Initial Tread Depth (ดอกยางเริ่มต้น)
// หน่วย: มม.
export const INITIAL_TREAD_DEPTH = 8;

// Minimum Tread Depth (ดอกยางต่ำสุดตามกฎหมาย)
// หน่วย: มม.
export const MIN_TREAD_DEPTH = 1.6;

// Maximum Tire Age (อายุยางสูงสุด)
// หน่วย: ปี
// ยางไม่ควรใช้เกินนี้แม้ดอกยางยังดี
export const MAX_TIRE_AGE = 5;

/**
 * ========================================
 * SEVERITY FACTORS
 * ========================================
 */

// Braking Severity
export const BRAKING_SEVERITY = {
  SMOOTH: 0,        // "นุ่มนวล ค่อยๆเหยียบเบรก"
  STRONG: 0.1       // "เบรกแรง/กะทันหันบ่อยครั้ง"
};

// Road Severity
export const ROAD_SEVERITY = {
  SMOOTH: 0,        // "ถนนเรียบ"
  ROUGH_DUSTY: 0.1, // "ถนนขรุขระ/ฝุ่นเยอะ"
  MANY_HOLES: 0.2   // "เต็มไปด้วยหลุม"
};

// Speed Severity
export const SPEED_SEVERITY = {
  LOW: 0,           // "ต่ำ (<60)"
  MEDIUM: 0.05,     // "ปานกลาง (80-100)"
  HIGH: 0.1         // "สูง (>120)"
};

// Load Severity
export const LOAD_SEVERITY = {
  LIGHT: 0,         // "น้อยกว่า 400-500 กก."
  HEAVY: 0.1        // "มากกว่า 500 กก."
};

/**
 * ========================================
 * CONDITION PENALTIES
 * ========================================
 */

// Rubber Condition Penalty
export const RUBBER_CONDITION_PENALTY = {
  SOFT: 0,          // "นุ่ม/ยืดหยุ่น" (0)
  HARDENING: 0.05,  // "เริ่มแข็ง" (1)
  HARD_DEAD: 0.15   // "แข็ง/ตาย" (2)
};

// Crack Level Penalty
export const CRACK_LEVEL_PENALTY = {
  NONE: 0,          // "ไม่มี" (0)
  SMALL: 0.10,      // "มีเล็กน้อย" (1)
  SEVERE: 0.20      // "แตกชัดเจน" (2)
};

// Bulge Penalty
export const BULGE_PENALTY = {
  NONE: 0,          // "ไม่มี" (0)
  PRESENT: 0.25     // "พบรอยบวม" (1)
};

// Damage Penalty
export const DAMAGE_PENALTY = {
  NONE: 0,          // "ไม่มี" (0)
  SHALLOW: 0.15,    // "มีรอยตื้น" (1)
  DEEP: 0.30        // "แผลลึก/เห็นโครงสร้าง" (2)
};

/**
 * ========================================
 * COMPONENT SCORE WEIGHTS
 * ========================================
 */

// CS = w1 × Age Index + w2 × Wear Index + w3 × Condition Penalty
export const CS_WEIGHTS = {
  AGE_INDEX: 0.3,
  WEAR_INDEX: 0.4,
  CONDITION_PENALTY: 0.3
};

/**
 * ========================================
 * RISK THRESHOLDS
 * ========================================
 */

export const RISK_LEVELS = {
  SAFE: {
    label: "SAFE",
    color: "green",
    csThreshold: 0.4,
    description: "ยางสามารถใช้ได้ต่อไป"
  },
  WARNING: {
    label: "WARNING",
    color: "#FFB800",
    csThreshold: 0.7,
    description: "ยางควรเข้าการบำรุงรักษา"
  },
  HIGH_RISK: {
    label: "HIGH RISK",
    color: "orange",
    csThreshold: Infinity,
    description: "ยางอยู่ในสภาพเสี่ยงสูง"
  },
  REPLACE_NOW: {
    label: "REPLACE NOW",
    color: "red",
    csThreshold: -Infinity,
    description: "ต้องเปลี่ยนยางทันที"
  }
};

// Tread Critical Levels
export const TREAD_LEVELS = {
  CRITICAL: 1.6,   // Must replace
  HIGH_RISK: 3.0,  // High risk threshold
  WARNING: 4.0     // Warning threshold
};

/**
 * ========================================
 * HELPER FUNCTIONS
 * ========================================
 */

/**
 * Get severity factor value
 * @param {string} type - 'braking' | 'road' | 'speed' | 'load'
 * @param {number} index - 0, 1, 2, etc.
 * @returns {number} severity factor value
 */
export const getSeverityFactor = (type, index) => {
  const map = {
    braking: BRAKING_SEVERITY,
    road: ROAD_SEVERITY,
    speed: SPEED_SEVERITY,
    load: LOAD_SEVERITY
  };
  const values = Object.values(map[type] || {});
  return values[index] ?? 0;
};

/**
 * Get condition penalty
 * @param {string} type - 'rubber' | 'crack' | 'bulge' | 'damage'
 * @param {number} level - 0, 1, 2, etc.
 * @returns {number} penalty value
 */
export const getConditionPenalty = (type, level) => {
  const map = {
    rubber: RUBBER_CONDITION_PENALTY,
    crack: CRACK_LEVEL_PENALTY,
    bulge: BULGE_PENALTY,
    damage: DAMAGE_PENALTY
  };
  const values = Object.values(map[type] || {});
  return values[level] ?? 0;
};

/**
 * Clamp value between min and max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (value, min = 0, max = 1) => {
  return Math.min(max, Math.max(min, value));
};

/**
 * Get risk level based on Component Score
 * @param {number} cs - Component Score (0-1)
 * @param {number} tread - Current tread depth (มม.)
 * @param {number} age - Tire age (ปี)
 * @returns {object} risk level object
 */
export const getRiskLevel = (cs, tread, age, isCritical = false) => {
  if (isCritical || tread <= TREAD_LEVELS.CRITICAL || age > MAX_TIRE_AGE) {
    return RISK_LEVELS.REPLACE_NOW;
  }
  
  if (cs > RISK_LEVELS.HIGH_RISK.csThreshold || tread <= TREAD_LEVELS.HIGH_RISK) {
    return RISK_LEVELS.HIGH_RISK;
  }
  
  if (cs >= RISK_LEVELS.WARNING.csThreshold || tread <= TREAD_LEVELS.WARNING) {
    return RISK_LEVELS.WARNING;
  }
  
  return RISK_LEVELS.SAFE;
};

/**
 * Format number with Thai locale
 * @param {number} num
 * @param {number} decimals
 * @returns {string}
 */
export const formatNumber = (num, decimals = 0) => {
  return num.toLocaleString('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Get color based on value and threshold
 * @param {number} value
 * @param {number} low - yellow threshold
 * @param {number} high - red threshold
 * @returns {string} color
 */
export const getStatusColor = (value, low = 0.4, high = 0.7) => {
  if (value >= high) return "#f44336"; // red
  if (value >= low) return "#ff9800";  // orange
  return "#4caf50"; // green
};