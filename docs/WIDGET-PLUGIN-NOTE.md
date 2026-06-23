# Widget Plugin Notu — Tarımİklim Hava Widget’ı

Bu proje, Tarımİklim’in embed widget’ını iframe ile tüketiyor.

## Yeni ortak paket

- Paket: `@agro/ecosystem-weather-widget`
- Kaynak: `packages/ecosystem-weather-widget`
- Amaç: Widget bileşenini Tarımİklim repo’sundan bağımsız, ekosistemde yeniden kullanılabilir hale getirmek.

## Neden önemli?

- Widget tarafında **client’ta env mutate etmeden** `apiBase` ile backend’e bağlanma standardı.
- Brand token’ları (`bereketfide`, `vistaseed`, `haldefiyat`) tek yerde tutuluyor.

## Bu projede ileride yapılacak güncelleme (TODO)

- İframe kullanımı devam edecekse değişiklik şart değil.
- Eğer bu projede “native component widget” kullanılacaksa:
  - `@agro/ecosystem-weather-widget` paketi eklenir (workspace zaten var).
  - `WeatherWidget` direkt kullanılabilir.
  - `apiBase` olarak `https://tarimiklim.com/api/v1` verilir.

## Not

Tarımİklim tarafında “BereketFide widget’ı mevcut davranışta kalır” istisnası var. BereketFide yeni dinamik marka sistemine adapte edildikten sonra bu istisna kaldırılacak ve ilgili notlar buraya taşınacak.

