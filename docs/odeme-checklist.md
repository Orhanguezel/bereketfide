# Bereketfide Odeme Checklist

## Halk Ode Ozel Notu

- `[x]` Kart odeme akisinda provider adi `halkode` olarak destekleniyor.
- `[x]` Browser callback URL'leri:
  `POST /api/v1/orders/payment/card/halkode/ok`
  `POST /api/v1/orders/payment/card/halkode/fail`
- `[x]` Server-to-server webhook URL'i:
  `POST /api/v1/orders/payment/card/halkode/webhook`
- `[x]` Manuel `curl` testi ile dogrulandi:
  webhook bos payload -> `400 hash_mismatch`
  browser callback sahte hash -> `302 ...payment=fail&reason=hash_mismatch`
- `[x]` Otomatik test eklendi:
  `backend/src/test/halkode-callback.test.ts`

Bu dokuman, Bereketfide B2B siparis odeme akisinin kod uzerinden mevcut durumunu, risklerini ve test senaryolarini takip etmek icin hazirlandi.

Durum etiketleri:

- `[x]` Kodda var
- `[~]` Kismen var / riskli
- `[ ]` Eksik

## 1. Odeme Akisi

- `[x]` Siparis olusturulunca `orders.status = pending`, `orders.payment_status = unpaid` oluyor.
  Kod: `backend/src/modules/orders/controller.ts`, `backend/src/modules/orders/schema.ts`
- `[x]` Kredi odemesinde basarili sonuc `payment_status = paid`, `status = confirmed` olarak isleniyor.
  Kod: `backend/src/modules/orders/payment-credit.service.ts`
- `[x]` Iyzico ve kart callback'lerinde basarili sonuc `payment_status = paid`, `status = confirmed` olarak isleniyor.
  Kod: `backend/src/modules/orders/payment-callback.controller.ts`, `backend/src/modules/orders/payment-card-callback.controller.ts`
- `[x]` Basarisiz callback sonucunda `payment_status = failed` oluyor.
  Kod: `backend/src/modules/orders/payment-callback.controller.ts`, `backend/src/modules/orders/payment-card-callback.controller.ts`
- `[~]` Basarisiz odemede siparis status'u `pending` kalabiliyor; ayrica "payment_failed" gibi ayri bir siparis status'u yok.
  Etki: operasyon tarafinda "bekleyen siparis" ile "odemesi dusen siparis" ayrimi zayif.
- `[~]` Havale seceneginde sadece `payment_method = bank_transfer`, `payment_status = pending` isaretleniyor; manuel onay/mahsup akisi bu modulde yok.

## 2. Callback Dogrulama ve Guvenlik

- `[x]` Iyzico callback'inde sadece callback body'ye guvenilmiyor, `token + conversationId` ile Iyzico'dan tekrar sorgu cekiliyor.
  Kod: `backend/src/modules/orders/payment-callback.controller.ts`, `backend/src/modules/wallet/iyzico.ts`
- `[x]` Halk Ode callback/webhook akisinda hash dogrulamasi yapiliyor.
  Kod: `backend/src/modules/wallet/est3d.ts`
- `[x]` ZiraatPay callback'inde callback payload yerine server-side status sorgusu kullaniliyor.
  Kod: `backend/src/modules/orders/payment-card-callback.controller.ts`, `backend/src/modules/wallet/ziraatpay.ts`
- `[~]` Craftgate callback'inde dogrudan imza/hash kontrolu yok; checkout detayi Craftgate API'den tekrar okunuyor.
  Not: Bu yine de callback body'sine kor guvenmekten daha guvenli.
- `[x]` Fake callback gelirse ve `payment_ref` eslesmiyorsa siparis bulunmuyor, odeme confirm edilmiyor.
- `[x]` Halk Ode hash tutmazsa islem reddediliyor.
- `[x]` Gecerli hash ile gelen ama siparis eslesmeyen callback `order_not_found` olarak reddediliyor.
- `[~]` Callback endpoint'leri public; IP allowlist, imzali webhook katmani veya ayri audit kaydi yok.

## 3. Siparis - Odeme Eslesmesi

- `[x]` Her odeme baslatmada yeni bir `payment_ref` uretiliyor ve `orders.payment_ref` alanina yaziliyor.
  Kod: `backend/src/modules/orders/payment.controller.ts`, `backend/src/modules/orders/payment-card.controller.ts`
- `[x]` Callback'ler siparisi `payment_ref` uzerinden buluyor.
  Kod: `backend/src/modules/orders/payment.repository.ts`
- `[x]` Siparis id ile odeme referansi ayrik tutuluyor.
  Not: `order.id` siparis anahtari, `payment_ref` banka/odeme akisi referansi.
- `[~]` `orders.payment_ref` icin index var ama unique constraint yok.
  Risk: teorik olarak ayni referansin tekrar yazilmasi engellenmiyor.
- `[x]` "Ayni siparis 2 kere odensin" kontrolu artik `pending` durumunu da kapsiyor; ikinci init backend tarafinda reddediliyor.
- `[~]` Harici idempotency key yok, fakat backend artik tek aktif odeme denemesini transaction ile koruyor.
- `[x]` DB seviyesinde tekil `payment_ref` garantisi `payment_attempts.payment_ref` alaninda tutuluyor.

## 4. Hata Senaryolari

- `[~]` Kullanici 3D ekranini kapatirsa callback gelmeyebilir; siparis `pending` + `payment_status = pending` olarak takili kalabilir.
- `[~]` Banka timeout/init hatasinda bazi akislarda `payment_status = failed` yapiliyor, ama her senaryo icin retry/polling mekanizmasi yok.
- `[x]` Callback hic gelmeyen dis odemeler icin timeout cleanup isi eklendi.
- `[x]` Yari kalan odemeleri `expired` olarak isaretleyen ve siparisi `failed` durumuna ceken job eklendi.
- `[ ]` Kullaniciya "odeme sureci yarim kaldi" icin ayrik bir ekran/aksiyon akisi yok.

## 5. Loglama ve Izleme

- `[~]` Kritik callback hatalari ve dogrulama problemleri `req.log.warn/error` ile loglaniyor.
  Kod: `backend/src/modules/orders/payment-callback.controller.ts`, `backend/src/modules/orders/payment-card-callback.controller.ts`
- `[x]` Dis odeme init request bilgileri, callback payload'lari ve hata notlari `payment_attempts` tablosunda tutuluyor.
- `[x]` Banka/odeme saglayicisi callback sonucuna dair temel audit trail artik kalici tutuluyor.
- `[ ]` Odeme denemeleri icin ayri izleme paneli veya rapor ekranı yok.
- `[ ]` "Hatalari nereden takip edecegiz?" sorusuna cevap veren payment-specific dashboard yok.

## 6. Test Senaryolari Checklist

### 6.1 Basarili Odeme

- `[ ]` Siparis olustur.
- `[ ]` Kredi ile odeme yap.
- `[ ]` Beklenen sonuc: `status = confirmed`, `payment_status = paid`, `payment_method = dealer_credit`
- `[ ]` Iyzico ile odeme yap.
- `[ ]` Beklenen sonuc: callback sonrasi `status = confirmed`, `payment_status = paid`, `payment_method = iyzico`
- `[ ]` Halk Ode ile 3D odeme yap.
- `[ ]` Beklenen sonuc: callback sonrasi `status = confirmed`, `payment_status = paid`, `payment_method = halkode`
- `[ ]` Diger aktif kart saglayicilari icin ayri ayri 3D odeme yap.
- `[ ]` Beklenen sonuc: callback sonrasi `status = confirmed`, `payment_status = paid`, `payment_method = craftgate | nestpay_isbank | ziraatpay`

### 6.2 Basarisiz Odeme

- `[ ]` Iyzico fail callback senaryosu test et.
- `[ ]` Halk Ode webhook'unda banka red senaryosu test et.
- `[ ]` Halk Ode browser callback'inde banka red senaryosu test et.
- `[ ]` Diger kart saglayicilarinda bankadan red al.
- `[ ]` Beklenen sonuc: `payment_status = failed`
- `[ ]` Beklenen sonuc: siparis kaydi silinmiyor.
- `[ ]` Beklenen sonuc: siparisin tekrar odemeye alinmasi karari netlestirildi.

### 6.3 Iptal / Vazgecme

- `[ ]` Kullanici 3D sayfasini kapatsin.
- `[ ]` Halk Ode 3D ekraninda geri/iptal ile cikis davranisini test et.
- `[ ]` Callback gelmediginde siparisin ne kadar sure `pending` kalacagi belirlensin.
- `[ ]` Manuel iptal islemi sadece `status = pending` iken calisiyor mu kontrol et.
- `[ ]` Baslamis ama tamamlanmamis odeme varken siparis iptali politikasi netlestirilsin.

### 6.4 Iade

- `[ ]` Teknik olarak payment provider tarafinda refund endpoint'i var mi teyit et.
- `[x]` Backend'de ilk surum refund API/servisi eklendi.
- `[ ]` Siparis, cari hareket ve stok etkisi tasarlandi mi kontrol et.
- `[ ]` Iade test senaryosu yaz ve uygula.

Mevcut durum:

- `[~]` Admin tarafinda `dealer_credit` odemeleri icin ilk surum refund akisi eklendi; banka/provider iadesi henuz yok.

### 6.5 Taksitli Odeme

- `[x]` Iyzico `enabledInstallments` artik secilen taksit sayisiyla gonderilebiliyor.
- `[x]` NestPay/ZiraatPay icin taksit parametresi backend akisina eklendi.
- `[x]` Halk Ode akisi secilen taksit bilgisini callback URL'leriyle birlikte uretiyor.
- `[x]` Frontend'de taksit secim UI'i eklendi.
- `[ ]` Taksitli odeme sonucu tutar/komisyon kaydi dogru mu kontrol et.

Mevcut durum:

- `[~]` Taksit secimi UI ve backend akisina eklendi; provider bazli sandbox dogrulamasi hala gerekli.

## 7. Bu Incelemede Tespit Edilen Somut Bulgular

- `[x]` Duzeltildi: kart callback'lerinde odeme basarili oldugunda `payment_method` her zaman `iyzico` yaziliyordu; bu durum saglayici bazli raporlama ve takipte yanlis veri uretiyordu.
- `[x]` Duzeltildi: ayni siparis icin `pending` odeme varken ikinci init backend tarafinda engelleniyor.
- `[x]` Duzeltildi: dis odemeler icin kalici `payment_attempts` audit kaydi eklendi.
- `[x]` Duzeltildi: callback gelmeyen dis odemeler icin timeout cleanup job eklendi.
- `[x]` Eklendi: payment attempts icin admin API listeleme/detay endpointleri.
- `[x]` Eklendi: payment denemeleri icin admin UI listeleme ve detay ekranlari.
- `[x]` Eklendi: Halk Ode webhook ve callback testleri.

## 8. Onerilen Sirali Aksiyonlar

- `[x]` "pending odeme varsa ikinci init'i engelle" kurali eklendi.
- `[x]` `payment_attempts` audit tablosu eklendi.
- `[x]` Yari kalan odemeler icin timeout/abandon cron tanimlandi.
- `[x]` `payment_attempts` icin admin listeleme / filtreleme API'i eklendi.
- `[x]` `payment_attempts` icin admin listeleme / filtreleme UI'i eklendi.
- `[ ]` Refund ve taksit kapsam kararini netlestir.
- `[ ]` Halk Ode panelinden gercek sandbox/canli teknik alanlari ile success/fail/refund senaryolarini tamamla.
- `[ ]` Sandbox test verileri ile bu dokumandaki checklist'i adim adim doldur.
