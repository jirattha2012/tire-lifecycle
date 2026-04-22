import { useEffect, useState, useCallback } from "react";
import { useTireCalculator } from "../hooks/useTireCalculator";

export default function Result() {
  const [data, setData] = useState(null);
  const { result, calculate } = useTireCalculator();

  useEffect(() => {
    const saved = localStorage.getItem("tireData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed);
      calculate(parsed);  // คำนวณทันที
    }
  }, [calculate]);

  if (!data || !result) return <div> Loading... </div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>ผลการประเมิน</h2>
      <h3>ข้อมูลที่ใช้คำนวณ</h3>
      <p>ระยะทางสะสม: {data.mileage} กม.</p>
      <p>อายุยาง: {data.age} ปี</p>
      <p>ดอกยางเริ่มต้น: {data.treadStart} มม.</p>
      <p>ดอกยางปัจจุบัน: {data.treadCurrent} มม.</p>

      <hr />

      <h3>ผลลัพธ์</h3>
      <p>🔹 Usage Factor (UF): {result.UF.toFixed(3)}</p>
      <p>🔹 Wear Rate (WR adj): {result.WRadj.toExponential(3)}</p>
      <p>🔹 ใช้ได้อีกประมาณ: <b>{result.finalRULkm.toFixed(0)} กม.</b></p>
      <p>🔹 หรือประมาณ: <b>{result.finalRULyear.toFixed(2)} ปี</b></p>
      <p>🔹 Component Score: {result.CS.toFixed(2)}</p>
      <p>🔹 ความเสี่ยง: <b style={{
          color: result.risk === "REPLACE NOW" ? "red" :
                 result.risk === "HIGH RISK" ? "orange" :
                 result.risk === "WARNING" ? "gold" : "green"
        }}>
          {result.risk}
        </b>
      </p>
    </div>
  );
}