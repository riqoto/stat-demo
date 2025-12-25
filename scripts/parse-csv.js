const fs = require('fs');
const path = require('path');

// CSV file mapping to section titles
const sectionMapping = {
  'oma_csv_1': 'İyileştirme Çalışmaları',
  'oma_csv_3': 'Akademik Danışmanlık Hizmetleri',
  'oma_csv_6': 'Öğrenme Ortamları ve Kaynakları',
  'oma_csv_7': 'Ders İçeriği ve Uygulaması',
  'oma_csv_8': 'Öğretim Elemanlarının Nitelikleri',
  'oma_csv_9': 'Ölçme ve Değerlendirme',
  'oma_csv_10': 'Kariyer Rehberliği',
  'oma_csv_11': 'Sosyal ve Kültürel Faaliyetler',
  'oma_csv_12': 'Engelli Öğrenci Destekleri',
  'oma_csv_13': 'İdari ve Mali Hizmetler',
  'oma_csv_14': 'Kütüphane Hizmetleri',
  'oma_csv_15': 'Bilgi İşlem ve Teknoloji',
  'oma_csv_16': 'Yurtdışı Öğrenme Fırsatları',
  'oma_csv_17': 'Gözlemci Öğrenci Perspektifi',
  'oma_csv_18': 'Kalite Güvence Sistemi',
  'oma_csv_19': 'Araştırma Desteği',
  'oma_csv_20': 'Üniversite-Sanayi İşbirliği',
  'oma_csv_21': 'Uluslararası İlişkiler ve Değişim Programları',
};

function parseCSVFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  
  if (lines.length < 2) return null;

  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim());
  
  // Detect CSV type based on headers
  const isLikertScale = headers.includes('Kesinlikle Katilmiyorum') || 
                       headers.includes('Katilmiyorum') ||
                       headers.includes('Toplam');
  
  const rows = [];
  let participantCount = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim());
    if (values.length < 2) continue;

    const rowObj = {};
    headers.forEach((header, idx) => {
      const value = values[idx];
      // Try to parse as number
      if (value && !isNaN(value) && value !== '') {
        rowObj[header] = parseFloat(value);
      } else {
        rowObj[header] = value;
      }
    });

    // Filter out metadata rows
    if (rowObj['Program'] === 'Toplam' || 
        rowObj['Kategori'] === 'Toplam' ||
        rowObj['Program'] === 'Genel Chi2 Prob.' ||
        rowObj['Kategori'] === 'Fikrim yok') {
      continue;
    }

    rows.push(rowObj);
    
    // Count participants (rough estimate from first column after Program)
    if (rowObj['Program'] && rowObj['Program'] !== 'Toplam') {
      participantCount++;
    }
  }

  return {
    headers,
    rows,
    participantCount: Math.max(participantCount, 1),
  };
}

function main() {
  const dataDir = path.join(__dirname, '../data');
  const sections = [];

  Object.entries(sectionMapping).forEach(([fileBase, title], idx) => {
    const fileName = `${fileBase}.txt`;
    const filePath = path.join(dataDir, fileName);

    if (fs.existsSync(filePath)) {
      const data = parseCSVFile(filePath);
      if (data) {
        sections.push({
          id: `section_${idx + 1}`,
          title,
          description: `${title} ile ilgili anket sonuçları`,
          participantCount: data.participantCount,
          totalSurveys: 100,
          rows: data.rows.map(row => ({
            Program: row['Program'] || row['Kategori'] || 'Bilgi Yok',
            'kesinlikle_katilmiyorum': row['Kesinlikle Katilmiyorum'] || row['Kesinlikle katilmiyorum'] || 0,
            'katilmiyorum': row['Katilmiyorum'] || row['Katilmiyorum'] || 0,
            'kararsizim': row['Kararsizim'] || row['Kararsizim'] || 0,
            'katiliyorum': row['Katiliyorum'] || row['Katiliyorum'] || 0,
            'kesinlikle_katiliyorum': row['Kesinlikle Katiliyorum'] || row['Kesinlikle katiliyorum'] || 0,
            'toplam': row['Toplam'] || 100,
          })),
        });
        console.log(`✓ Loaded: ${title} (${data.rows.length} rows)`);
      }
    }
  });

  const output = JSON.stringify(sections, null, 2);
  const outputPath = path.join(dataDir, 'sections.json');
  fs.writeFileSync(outputPath, output, 'utf-8');
  console.log(`\n✓ Generated: ${outputPath} (${sections.length} sections)`);
}

main();
