// ============================================================
//  قائمة الفيديوهات — عدّل هذا الملف فقط لإضافة فيديو جديد
//  Edit ONLY this file (or Firestore) to add / change videos.
//
//  driveUrl:  رابط Google Drive للفيديو (رابط المشاركة العادي)
//             e.g. https://drive.google.com/file/d/FILE_ID/view
//  thumbnail: رابط صورة مصغّرة (اختياري — يمكن تركه فارغاً "")
//  order:     ترتيب الظهور (الأصغر يظهر أولاً)
//  visible:   true لإظهار الفيديو، false لإخفائه
// ============================================================

export const videos = [
  {
    id: "1",
    title: "من هو الأنبا أنطونيوس؟",
    description:
      "نبذة عن نشأة القديس العظيم أبي الرهبان، وكيف ترك العالم ليتبع صوت الرب في البرية.",
    driveUrl: "https://drive.google.com/file/d/1fos8xBOyc9SPKiOjABTx8IUTU5MUmyxa/view?usp=sharing",
    thumbnail: "",
    duration: "٤:٣٢",
    order: 1,
    visible: true,
  },
  {
    id: "2",
    title: "دعوة البرية",
    description:
      "كلمة الإنجيل التي غيّرت حياته: «إن أردت أن تكون كاملاً فاذهب وبع أملاكك». رحلة الخروج إلى القفر.",
    driveUrl: "https://drive.google.com/file/d/PLACEHOLDER_ID_2/view",
    thumbnail: "",
    duration: "٦:١٠",
    order: 2,
    visible: true,
  },
  {
    id: "3",
    title: "جهاده وحروبه الروحية",
    description:
      "كيف واجه القديس التجارب في وحدة الجبل، وانتصر بالصلاة والصوم والاتضاع.",
    driveUrl: "https://drive.google.com/file/d/PLACEHOLDER_ID_3/view",
    thumbnail: "",
    duration: "٥:٤٥",
    order: 3,
    visible: true,
  },
  {
    id: "4",
    title: "أبو الرهبان وتعاليمه",
    description:
      "أقوال وحِكَم الأنبا أنطونيوس التي صارت نوراً لأجيال الرهبان من بعده.",
    driveUrl: "https://drive.google.com/file/d/PLACEHOLDER_ID_4/view",
    thumbnail: "",
    duration: "٧:٢٠",
    order: 4,
    visible: true,
  },
];
