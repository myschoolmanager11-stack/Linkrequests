const institutionSelect = document.getElementById("institutionSelect");
const emailInput = document.getElementById("emailInput");
const notesInput = document.getElementById("notesInput");
const resultMessage = document.getElementById("resultMessage");

const webAppUrl = "YOUR_WEBAPP_URL";

/* ===============================
   تحميل أسماء المؤسسات من Drive
=============================== */
function loadInstitutions() {

    fetch(webAppUrl + "?action=getInstitutions")
        .then(res => res.json())
        .then(data => {

            institutionSelect.innerHTML = '<option value="">اختر المؤسسة</option>';

            data.institutions.forEach(name => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                institutionSelect.appendChild(option);
            });

        })
        .catch(() => {
            institutionSelect.innerHTML = '<option>فشل تحميل المؤسسات</option>';
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

    resultMessage.innerHTML = "جارٍ الإرسال...";

    fetch(webAppUrl, {
        method: "POST",
        body: JSON.stringify({
            action: "sendRequest",
            institution: institution,
            email: email,
            notes: notes
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "success") {
            showMessage("✅ تم الإرسال بنجاح، سيتم الرد عليكم في أقرب الآجال", "green");
            emailInput.value = "";
            notesInput.value = "";
        } else {
            showMessage("❌ حدث خطأ أثناء الإرسال", "red");
        }

    })
    .catch(() => {
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

function showMessage(msg, color) {
    resultMessage.innerHTML = msg;
    resultMessage.style.color = color;
}

loadInstitutions();
