# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



--------------------------------------------
// UI
<!-- MUI หรือ Ant Design -->
npm install @mui/material @emotion/react @emotion/styled

// Http API
<!-- HTTP APIHTTP API -->
npm install axios

<!-- Charts (สำคัญสำหรับ “อายุการใช้งาน”) -->
npm install recharts


<!-- วางโครงระบบ -->
ระบบ “ประเมินอายุยาง” ควรมี flow แบบนี้:
//Input
ประเภทยาง
ระยะทางที่ใช้งาน (km)
อายุการผลิต (DOT)
สภาพการใช้งาน (ถนน / บรรทุก / ความเร็ว)

// Process
สูตรคำนวณอายุที่เหลือ
เปรียบเทียบ baseline (เช่น 40,000 km)

// Output
อายุที่เหลือ (%)
กราฟ degradation
คำแนะนำ (ควรเปลี่ยน / ยังใช้ได้)

--------------------------------------------------

[Start]

   ↓

[User เข้าเว็บ]

   ↓

[หน้า Form Input]

   ↓
 ┌─────────────────────────────┐
 │ กรอกข้อมูล:             
 │ - ระยะเวลาใช้งาน       
 │ - ระยะทางสะสม         
 │ - ดอกยาง (4 ล้อ)       
 │ - ความเร็วเฉลี่ย         
 │ - พฤติกรรมเบรก         
 │ - สภาพถนน             
 │ - การบรรทุก            
 │ - สภาพยาง / ความเสียหาย
 └─────────────────────────────┘

   ↓

[กด Submit]

   ↓

[Validate Input]
   ↓
 ┌───────────────┐
 │ ข้อมูลครบไหม? │
 └───────────────┘
   ↓Yes                ↓No
   ↓                   ↓
[ไปต่อ]          [แจ้ง error + กลับไปแก้]

   ↓

[Normalize Data (0–1)]
- speed
- braking
- road
- load
- damage
- tread mapping

   ↓

[คำนวณ Usage Factor (UF)]

   ↓

[คำนวณ Current Tread Depth]
(จากสีเหรียญบาท)

   ↓

[คำนวณ Base Wear Rate]
WR = (8.5 - current tread) / mileage

   ↓

[Adjust Wear Rate]
Adjusted WR = WR × (1 + α × UF)

   ↓

[คำนวณ Remaining Tread]
= current tread - 1.6

   ↓

[คำนวณ RUL (km)]
= Remaining Tread / Adjusted WR

   ↓

[คำนวณ RUL (year)]
= RUL_km / km_per_year

   ↓

[คำนวณ Age Limit]
= 5 ปี - อายุยาง

   ↓

[เลือกค่าที่ต่ำสุด]
RUL_final = MIN(wear, age)

   ↓

[คำนวณ Damage Index]

   ↓

[คำนวณ Component Score]
CS = 0.35UF + 0.20Age + 0.45Damage

   ↓

[Decision Logic]
 ┌──────────────────────────────┐
 │ ถ้า tread ≤1.6 → Replace Now │
 │ ถ้า age >5 → Replace         │
 │ ถ้า CS >0.7 → High Risk      │
 │ ถ้า CS 0.4–0.7 → Warning     │
 │ else → Safe                  │
 └──────────────────────────────┘

   ↓

[แสดงผลลัพธ์]
- ระยะทางที่เหลือ (km)
- ระยะเวลาที่เหลือ (year)
- Risk Level
- Recommendation

   ↓

[End]

🧩 (เสริม) Flow แบบสั้นสำหรับ Dev Logic
Input → Validate → Normalize → 
UF → Wear Rate → Adjust WR → 
RUL_km → RUL_year → Apply Age Limit → 
Score (CS) → Decision → Output