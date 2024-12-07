const express = require('express');

module.exports = () => {
    const app = express();

    // إعدادات الوسائط
    app.use(express.json()); // لتحليل JSON
    app.use(express.urlencoded({ extended: true })); // لتحليل بيانات النموذج (form data)

    // إعداد محرك القوالب (EJS)
    app.set('view engine', 'ejs'); // تعيين EJS كمحرك للقوالب
    app.set('views', './views'); // تحديد مجلد القوالب

    // مسار افتراضي (اختياري)
    app.get('/', (req, res) => {
        res.send('Welcome to the server!');
    });

    // إضافة أي إعدادات أو وسائط إضافية هنا إذا لزم الأمر

    return app;
};
