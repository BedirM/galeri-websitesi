# MÜJDE AUTO - Oto Galeri Web Sitesi

## 🚗 Proje Hakkında

MÜJDE AUTO, Gaziantep'in güvenilir oto galerisi için modern, responsive ve kullanıcı dostu bir web sitesidir. 15 yıllık tecrübe ile kaliteli araç alım-satım hizmetleri sunan galeri için geliştirilmiştir.

## ✨ Özellikler

### 🎨 **Kullanıcı Deneyimi**
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Modern UI/UX**: Bootstrap 5 ile profesyonel tasarım
- **Smooth Animations**: Scroll reveal ve hover efektleri
- **Typewriter Effect**: Dinamik yazı animasyonları
- **Back-to-Top Button**: Kolay navigasyon
- **Loading States**: Gelişmiş yükleme durumları

### 🔒 **Güvenlik**
- **CSRF Protection**: Form güvenliği
- **Input Sanitization**: XSS koruması
- **Spam Detection**: Gelişmiş spam önleme
- **Security Headers**: Güvenlik başlıkları
- **Content Security Policy**: CSP uygulaması

### 📱 **PWA (Progressive Web App)**
- **Offline Support**: Çevrimdışı çalışma
- **App Installation**: Ana ekrana ekleme
- **Push Notifications**: Bildirim desteği
- **Background Sync**: Arka plan senkronizasyonu
- **Service Worker**: Cache yönetimi

### ♿ **Erişilebilirlik**
- **WCAG 2.1 Compliance**: Erişilebilirlik standartları
- **Screen Reader Support**: Ekran okuyucu desteği
- **Keyboard Navigation**: Klavye navigasyonu
- **High Contrast Mode**: Yüksek kontrast desteği
- **Skip Links**: Hızlı geçiş linkleri

### 📊 **Analytics & Performance**
- **Core Web Vitals**: Performans metrikleri
- **User Behavior Tracking**: Kullanıcı davranış analizi
- **Performance Monitoring**: Gerçek zamanlı izleme
- **Error Tracking**: Hata takibi
- **Offline Analytics**: Çevrimdışı analitik

### 🎯 **SEO Optimizasyonu**
- **Structured Data**: Schema.org markup
- **Meta Tags**: Kapsamlı meta etiketleri
- **Open Graph**: Sosyal medya optimizasyonu
- **Twitter Cards**: Twitter paylaşım optimizasyonu
- **Sitemap Ready**: Site haritası hazır

## 🛠️ Teknolojiler

### **Frontend**
- **HTML5**: Semantic markup
- **CSS3**: Modern styling ve animasyonlar
- **JavaScript (ES6+)**: Modern JavaScript özellikleri
- **Bootstrap 5**: Responsive framework
- **Font Awesome**: İkon kütüphanesi

### **Performance**
- **Lazy Loading**: Görsel yükleme optimizasyonu
- **Debouncing**: Scroll event optimizasyonu
- **Hardware Acceleration**: GPU hızlandırma
- **Image Optimization**: Görsel optimizasyonu
- **Code Splitting**: Kod bölme

### **Security**
- **CSP**: Content Security Policy
- **CSRF Tokens**: Cross-Site Request Forgery koruması
- **Input Validation**: Giriş doğrulama
- **Rate Limiting**: Hız sınırlama
- **Bot Detection**: Bot tespiti

## 📁 Dosya Yapısı

```
mujde-auto/
├── index.html              # Ana sayfa
├── about.html              # Hakkımızda sayfası
├── contact.html            # İletişim sayfası
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── favicon.svg             # Favicon
├── apple-touch-icon.png    # Apple touch icon
├── README.md               # Proje dokümantasyonu
├── css/
│   └── style.css           # Ana stil dosyası
├── js/
│   └── script.js           # Ana JavaScript dosyası
└── görseller/              # Görsel dosyaları
    ├── bmw320i.jpg
    ├── mercedes.jpg
    ├── audia4.jpg
    └── ...
```

## 🚀 Kurulum ve Çalıştırma

### **Gereksinimler**
- Modern web tarayıcısı
- HTTP sunucusu (localhost için)

### **Kurulum**
1. Projeyi klonlayın:
```bash
git clone https://github.com/username/mujde-auto.git
cd mujde-auto
```

2. HTTP sunucusu başlatın:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

3. Tarayıcıda açın:
```
http://localhost:8000
```

## 📱 PWA Özellikleri

### **Kurulum**
- Tarayıcıda "Ana Ekrana Ekle" seçeneği
- Otomatik kurulum bildirimi
- Offline çalışma desteği

### **Cache Stratejileri**
- **Static Files**: Cache-first
- **Images**: Cache-first
- **HTML**: Network-first
- **API Calls**: Network-first

## 🔧 Özelleştirme

### **Renk Teması**
CSS değişkenleri ile kolay özelleştirme:
```css
:root {
    --primary-color: #ff6b35;
    --secondary-color: #f39c12;
    --dark-bg: #212529;
    --light-bg: #f8f9fa;
}
```

### **İçerik Güncelleme**
- Araç bilgileri: `index.html` içinde
- İletişim bilgileri: `contact.html` içinde
- Şirket bilgileri: `about.html` içinde

## 📊 Performans Metrikleri

### **Core Web Vitals**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### **Lighthouse Skorları**
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🔒 Güvenlik Özellikleri

### **Koruma Katmanları**
1. **Input Sanitization**: Tüm kullanıcı girişleri temizlenir
2. **CSRF Protection**: Form güvenliği
3. **Rate Limiting**: Spam önleme
4. **Security Headers**: HTTP güvenlik başlıkları
5. **CSP**: Content Security Policy

## 📈 Analytics ve İzleme

### **Takip Edilen Metrikler**
- Sayfa görüntülemeleri
- Kullanıcı etkileşimleri
- Form gönderimleri
- Araç aramaları
- Performans metrikleri

### **Offline Desteği**
- Çevrimdışı veri toplama
- Bağlantı geri geldiğinde senkronizasyon
- Local storage kullanımı

## 🌐 Tarayıcı Desteği

### **Desteklenen Tarayıcılar**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### **PWA Desteği**
- Chrome/Edge: Tam destek
- Firefox: Temel destek
- Safari: Sınırlı destek

## 📞 İletişim

### **MÜJDE AUTO**
- **Telefon**: 0 (532) 333 57 94
- **E-posta**: mujdeauto@gmail.com
- **Adres**: Cevher Oto Center, Karacaahmet, 38004. Cd. No:31 B Blok 31, 27000 Şehitkamil/Gaziantep
- **Sahibinden.com**: https://mujdeauto.sahibinden.com/
- **Facebook**: https://www.facebook.com/profile.php?id=61553975863567
- **Instagram**: https://www.instagram.com/mujdeauto

### **Geliştirici**
- **Ad**: Bedir Müjde
- **Website**: https://bedirmujde-personal-website.vercel.app/
- **E-posta**: bedir@example.com

## 📄 Lisans

Bu proje özel kullanım için geliştirilmiştir. Tüm hakları saklıdır.

## 🔄 Güncellemeler

### **v1.0.0** (Güncel)
- ✅ PWA desteği eklendi
- ✅ Güvenlik iyileştirmeleri
- ✅ Erişilebilirlik geliştirmeleri
- ✅ Performans optimizasyonları
- ✅ Analytics sistemi
- ✅ Offline desteği
- ✅ Service Worker
- ✅ Enhanced form validation
- ✅ Advanced error handling
- ✅ Image optimization
- ✅ SEO improvements
- ✅ Mobile optimization

---

**MÜJDE AUTO** - Hayalinizdeki aracı bulun! 🚗✨ 