/* =========================
   المتغيرات العامة
========================= */
const institutionSelect = document.getElementById("institutionSelect");
const emailInput = document.getElementById("emailInput");
const notesInput = document.getElementById("notesInput");
const resultMessage = document.getElementById("resultMessage");

const webAppUrl = "https://script.google.com/macros/s/AKfycbwDydi0_8toDT0hIgZeCX0zxJmbl1efKR59xJjlE3XuCz7I9UqyVAZioMYQG0b6dCP1ow/exec";

/* =========================
   تحميل المؤسسات
========================= */
function loadInstitutions() {

    institutionSelect.innerHTML = '<option>جارٍ تحميل المؤسسات...</option>';

    fetch(webAppUrl + "?action=getInstitutions")
        .then(res => res.json()) // نحول الاستجابة مباشرة لـ JSON
        .then(data => {

            if (!data.institutions || data.institutions.length === 0) {
                throw new Error("لا توجد بيانات");
            }

            institutionSelect.innerHTML = '<option value="">-- اختر المؤسسة --</option>';

            data.institutions.forEach(inst => {
                const option = document.createElement("option");
                option.value = inst;       // كل عنصر هو string
                option.textContent = inst; // نضع النص نفسه
                institutionSelect.appendChild(option);
            });

        })
        .catch(error => {
            console.error("Load error:", error);
            institutionSelect.innerHTML = '<option>❌ فشل تحميل المؤسسات</option>';
        });
}

/* ===============================
   إرسال الطلب
=============================== */
function sendRequest() {

    const institution = institutionSelect.value;
    const email = emailInput.value.trim();
    const notes = notesInput.value.trim();

    if (!institution) {
        showMessage("يرجى اختيار المؤسسة", "red");
        return;
    }

    if (!validateEmail(email)) {
        showMessage("يرجى إدخال بريد إلكتروني صحيح", "red");
        return;
    }

    showMessage("جارٍ الإرسال...", "#3f51b5");

    const payload = {
        action: "sendRequest",
        institution: institution,
        email: email,
        notes: notes
    };

    fetch(webAppUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "success") {
            showMessage("✅ تم الإرسال بنجاح، سيتم الرد عليكم في أقرب الآجال", "green");
            emailInput.value = "";
            notesInput.value = "";
            institutionSelect.selectedIndex = 0;

        } else if (data.status === "blocked") {
            showMessage("⚠️ لقد أرسلتم طلبًا مسبقًا، يرجى المحاولة لاحقًا", "orange");

        } else {
            showMessage("❌ حدث خطأ أثناء الإرسال", "red");
        }

    })
    .catch(err => {
        console.error(err);
        showMessage("❌ فشل الاتصال بالخادم", "red");
    });
}

/* ===============================
   تحقق البريد
=============================== */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* ===============================
   عرض الرسائل
=============================== */
function showMessage(msg, color) {
    resultMessage.innerHTML = msg;
    resultMessage.style.color = color;
}

/* ===============================
   تنفيذ التحميل عند فتح الصفحة
=============================== */
loadInstitutions();
