const institutionSelect = document.getElementById("institutionSelect");
const emailInput = document.getElementById("emailInput");
const notesInput = document.getElementById("notesInput");
const resultMessage = document.getElementById("resultMessage");

const webAppUrl = "https://script.google.com/macros/s/AKfycbwFsNRVHbNwLfdJJtpFvXjmmh63fOel9i3i2uc4Kp90KC2xa3SUM1748QY91nAOBnzEfw/exec?action=getInstitutions";

/* ===============================
   تحميل أسماء المؤسسات من Drive
=============================== */
function loadInstitutions() {

    institutionSelect.innerHTML = '<option>جارٍ تحميل المؤسسات...</option>';

    fetch(webAppUrl + "?action=getInstitutions", {
        method: "GET",
        mode: "cors"
    })
    .then(response => response.json())
    .then(data => {

        console.log("Response:", data);

        if (!data || !data.institutions) {
            throw new Error("Invalid data format");
        }

        institutionSelect.innerHTML = '<option value="">اختر المؤسسة</option>';

        data.institutions.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            institutionSelect.appendChild(option);
        });

    })
    .catch(error => {
        console.error("Error loading institutions:", error);
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

    showMessage("جارٍ الإرسال...", "#3f51b5");

    const payload = {
        action: "sendRequest",
        institution: institution,
        email: email,
        notes: notes
    };

    fetch(webAppUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {

        if (data.status === "success") {

            showMessage("✅ تم الإرسال بنجاح، سيتم الرد عليكم في أقرب الآجال", "green");

            emailInput.value = "";
            notesInput.value = "";
            institutionSelect.selectedIndex = 0;

        }
        else if (data.status === "blocked") {

            showMessage("⚠️ لقد أرسلتم طلبًا مسبقًا، يرجى المحاولة لاحقًا", "orange");

        }
        else {

            showMessage("❌ حدث خطأ أثناء الإرسال", "red");

        }

    })
    .catch(error => {
        console.error(error);
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
==============================


