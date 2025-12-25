# İnteraktif Kalite Raporu Demo

Bu küçük demo projesi, PDF/Statik raporların daha interaktif ve modern bir web sunumuna dönüştürülmesinin bir örneğini sunar.

Özellikler
- TanStack Table tabanlı interaktif tablo (sıralama, arama, sayfalama).
- Basit VisX tabanlı yatay bar grafiği (seçilen satır için).

Nasıl çalıştırılır

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

3. Tarayıcıda şu adrese gidin:

```
http://localhost:3000/reports
```

Notlar
- `data/report.json` içindeki örnek veriler, kullanıcının sağladığı görsel tabloda görünene benzeyen özet yüzdeleri içerir.
- Bu demo hızlı bir başlangıç amaçlıdır; gerçek projede PDF'den otomatik veri çıkarmak için OCR veya manuel veri girişi iş akışı eklenebilir.

Geliştirme fikirleri
- Radix UI ile daha sağlam ve erişilebilir kontroller ekleyin (Tabs, Dialogs, Switches).
- VisX ile zaman serileri veya daha zengin tooltip'ler ekleyin.
- PDF -> JSON veri boru hattı (server-side OCR veya manuel CSV yükleme).
