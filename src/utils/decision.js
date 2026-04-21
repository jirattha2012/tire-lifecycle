export const getRiskLevel = (cs, tread, age) => {
  // if (tread <= 1.6 || age > 5) return "REPLACE NOW";
  if (rubberHard || crackSevere || bulge || deepCut) {
    risk = "REPLACE NOW";
  }

  if (cs > 0.7) return "HIGH RISK";
  
  if (cs >= 0.4) return "WARNING";
  return "SAFE";
};