type Bahan = {
  id: string;
  nama: string;
  kalori_per_100g: number;
  protein_per_100g: number;
  lemak_per_100g: number;
  karbohidrat_per_100g: number;
};

type MenuDetail = {
  bahan: Bahan;
  porsi_gram: number;
  metode_masak: string;
};

type Standar = {
  kategori: string;
  nilai_min: number;
  nilai_max: number;
};

type NutritionResult = {
  kalori: number;
  protein: number;
  lemak: number;
  karbohidrat: number;
  status: 'sesuai' | 'kurang' | 'berlebih';
  details: {
    kategori: string;
    nilai: number;
    min: number;
    max: number;
    status: 'sesuai' | 'kurang' | 'berlebih';
  }[];
};

export function calculateNutrition(
  menuDetails: MenuDetail[],
  standarGizi: Standar[]
): NutritionResult {
  let totalKalori = 0;
  let totalProtein = 0;
  let totalLemak = 0;
  let totalKarbohidrat = 0;

  // Calculate totals
  menuDetails.forEach((detail) => {
    const { bahan, porsi_gram, metode_masak } = detail;
    const faktor = porsi_gram / 100;

    // Base nutrition
    let kalori = bahan.kalori_per_100g * faktor;
    let protein = bahan.protein_per_100g * faktor;
    let lemak = bahan.lemak_per_100g * faktor;
    let karbohidrat = bahan.karbohidrat_per_100g * faktor;

    // Adjust for cooking method
    if (metode_masak === 'goreng') {
      lemak *= 1.15; // +15% lemak untuk goreng
    } else if (metode_masak === 'panggang') {
      lemak *= 0.95; // -5% lemak untuk panggang
    }

    totalKalori += kalori;
    totalProtein += protein;
    totalLemak += lemak;
    totalKarbohidrat += karbohidrat;
  });

  // Round to 2 decimal places
  totalKalori = Math.round(totalKalori * 100) / 100;
  totalProtein = Math.round(totalProtein * 100) / 100;
  totalLemak = Math.round(totalLemak * 100) / 100;
  totalKarbohidrat = Math.round(totalKarbohidrat * 100) / 100;

  // Compare with standards
  const details = [];
  let overallStatus: 'sesuai' | 'kurang' | 'berlebih' = 'sesuai';

  const nutrisiMap: { [key: string]: number } = {
    kalori: totalKalori,
    protein: totalProtein,
    lemak: totalLemak,
    karbohidrat: totalKarbohidrat,
  };

  standarGizi.forEach((std) => {
    const nilai = nutrisiMap[std.kategori] || 0;
    let status: 'sesuai' | 'kurang' | 'berlebih' = 'sesuai';

    if (nilai < std.nilai_min) {
      status = 'kurang';
      overallStatus = 'kurang';
    } else if (nilai > std.nilai_max) {
      status = 'berlebih';
      if (overallStatus !== 'kurang') overallStatus = 'berlebih';
    }

    details.push({
      kategori: std.kategori,
      nilai,
      min: std.nilai_min,
      max: std.nilai_max,
      status,
    });
  });

  return {
    kalori: totalKalori,
    protein: totalProtein,
    lemak: totalLemak,
    karbohidrat: totalKarbohidrat,
    status: overallStatus,
    details,
  };
}
