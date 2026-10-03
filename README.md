# Anzu — أنزو 🦅🇮🇶

لعبة عراقية شبيهة بـ Flappy Bird، مبنية بـ HTML5 Canvas وتُحوَّل إلى APK/AAB عبر **Capacitor + GitHub Actions** دون الحاجة لتثبيت Android Studio.

## تشغيل اللعبة على الكمبيوتر
```bash
npm install
npm start      # أو افتح www/index.html مباشرة
```

## بناء APK من GitHub
1. أنشئ مستودعاً جديداً على GitHub وارفع كل الملفات (`git init && git add . && git commit -m "Anzu" && git push`).
2. من تبويب **Actions** شغّل **Build Anzu APK** (أو يعمل تلقائياً عند الدفع إلى `main`).
3. بعد دقائق نزّل `Anzu-debug-apk` من قسم **Artifacts** وثبّته على هاتفك للتجربة.

## النسخة الموقّعة للنشر على المتاجر (APK + AAB)
أنشئ مفتاح توقيع مرة واحدة:
```bash
keytool -genkey -v -keystore anzu.jks -keyalg RSA -keysize 2048 -validity 10000 -alias anzu
base64 -w0 anzu.jks   # انسخ الناتج
```
ثم في GitHub: **Settings → Secrets and variables → Actions** أضف:
`KEYSTORE_BASE64` ، `KEY_ALIAS` ، `KEYSTORE_PASSWORD` ، `KEY_PASSWORD`
وأعد تشغيل الـ workflow، وستجد `Anzu-release-signed` (ملف `.aab` لـ Google Play و`.apk` للمتاجر الأخرى). **احتفظ بملف anzu.jks في مكان آمن؛ ضياعه يمنع تحديث اللعبة.**

## قبل الرفع على المتجر
- **سياسة الخصوصية**: الملف `docs/privacy.html` (ونسخته داخل اللعبة `www/privacy.html`). استبدل `YOUR_EMAIL@example.com` ببريدك في الملفين، ثم فعّل **GitHub Pages** (Settings → Pages → Branch: main، Folder: `/docs`) وضع الرابط الناتج في خانة Privacy Policy في المتجر.
- **Data safety في Google Play**: اختر «لا تجمع أي بيانات» و«لا تشارك بيانات».
- **معرّف الحزمة**: غيّر `appId` في `capacitor.config.json` (الحالي `com.anzu.game`) إلى معرّف فريد يخصك قبل أول رفع، فلا يمكن تغييره لاحقاً.
- **Target SDK**: يطلب Google Play رفع `targetSdkVersion` سنوياً. إن رفض المتجر النسخة بسببه حدّث إصدار Capacitor (`npm i @capacitor/core@latest @capacitor/android@latest @capacitor/cli@latest @capacitor/app@latest`) وغيّر إصدار Java/Node في الـ workflow حسب متطلباته.
- لقطات الشاشة والوصف وتصنيف المحتوى تُجهَّز من حسابك على المتجر.

## بنية المشروع
```
www/            ملفات اللعبة (index.html, style.css, js/, privacy.html)
  js/util.js    أدوات + الحفظ المحلي
  js/audio.js   الموسيقى (مقام الحجاز) والمؤثرات — مولّدة برمجياً بلا ملفات صوت
  js/art.js     رسم الطائر والأزياء العشرين والخلفيات والعوائق
  js/game.js    الفيزياء، القدرات، المتجر، المهام، التسجيل اليومي، الإعدادات
assets/         الأيقونة وشاشة البداية (تتحول تلقائياً لكل أحجام أندرويد)
.github/workflows/android.yml   بناء APK/AAB
docs/privacy.html               سياسة الخصوصية للنشر عبر GitHub Pages
```

## ضبط التوازن
- أسعار الأزياء: مصفوفة `SKINS` في `www/js/art.js` (الحقل `p`).
- أسعار التطوير ومدد القدرات: `UP` و`UPC` في `www/js/game.js`.
- المهام اليومية: مصفوفة `MP`، ومكافآت التسجيل: `DAILY`.
- طول كل مرحلة طقس: `PHL` (250 متراً) والتسلسل في `PH`.
