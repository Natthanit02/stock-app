import { db } from './firebaseConfig.js';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc, 
  getDocs,
  updateDoc,
  query,           // ✅ เพิ่มตรงนี้
  where,           // ✅ และตรงนี้
  Timestamp        // ✅ สำหรับใช้เวลา
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const companySelect = document.getElementById("companySelect");
const deviceTypeSelect = document.getElementById("deviceType");
const computerForm = document.getElementById("computerForm");
const notebookForm = document.getElementById("notebookForm");
let isEditing = false;
let currentEditId = null;
let currentEditCollection = null;

async function checkDuplicateAssetCode(company, assetCode) {
  const colRef = getCollectionByCompany(company);
  const q = query(colRef, where("assetCode", "==", assetCode));
  const snap = await getDocs(q);
  return !snap.empty; // true = พบข้อมูลซ้ำ
}

companySelect.addEventListener("change", toggleForms);
deviceTypeSelect.addEventListener("change", toggleForms);

function toggleForms() {
  const type = deviceTypeSelect.value;
  const company = companySelect.value;

  if (!type || !company) {
    computerForm.style.display = "none";
    notebookForm.style.display = "none";
    return;
  }

  computerForm.style.display = type === "computer" ? "block" : "none";
  notebookForm.style.display = type === "notebook" ? "block" : "none";
}

function getCollectionByCompany(company) {
  if (company === "swp") return collection(db, "devices_swp");
  if (company === "esk") return collection(db, "devices_esk");
  throw new Error("ไม่พบบริษัท");
}

  function toTimestamp(dateStr) {
  if (!dateStr) return null; // ป้องกัน error ถ้ายังไม่เลือกวันที่
  return Timestamp.fromDate(new Date(dateStr));
  }

//------------------------------------------------------------computer----------------------------------------------------
computerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const company = companySelect.value;
  const data = {
    type: "computer",
    barCode: document.getElementById("c_barCode").value.trim(),
    assetCode: document.getElementById("c_assetCode").value.trim(),
    name: document.getElementById("c_name").value.trim(),
    department: document.getElementById("c_department").value.trim(),
    deviceName: document.getElementById("c_deviceName").value.trim(),
    serialNumber: document.getElementById("c_serialNumber").value.trim(),
    purchaseDate: toTimestamp(document.getElementById("c_purchaseDate").value),
    warrantyExpire: toTimestamp(document.getElementById("c_warrantyExpire").value),
    warrantyPeriod: document.getElementById("c_warrantyPeriod").value.trim(),
    shop: document.getElementById("c_shop").value.trim(),
    contactNumber: document.getElementById("c_contactNumber").value.trim(),
    comment: document.getElementById("c_comment").value.trim(),
    company: company,
    status: "available"
  };

  if (!isEditing) {
  const isDuplicate = await checkDuplicateAssetCode(company, data.assetCode);
  if (isDuplicate) {
    alert("รหัสทรัพย์สินนี้มีอยู่ในระบบแล้ว");
    return;
  }
  await addDoc(getCollectionByCompany(company), data);
}

  if (isEditing) {
    await updateDoc(doc(db, currentEditCollection, currentEditId), data);
    alert("อัปเดตข้อมูลคอมพิวเตอร์แล้ว");
    isEditing = false;
    currentEditId = null;
    currentEditCollection = null;
    computerForm.querySelector("button[type='submit']").textContent = "บันทึกคอมพิวเตอร์";
  } else {
    await addDoc(getCollectionByCompany(company), data);
    alert("บันทึกคอมพิวเตอร์แล้ว");
  }

  computerForm.reset();
  loadFilteredData();
});
//------------------------------------------------------------computer----------------------------------------------------

//------------------------------------------------------------notebook----------------------------------------------------
notebookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const company = companySelect.value;

  const data = {
    type: "notebook",
    barCode: document.getElementById("n_barCode").value.trim(),
    assetCode: document.getElementById("n_assetCode").value.trim(),
    name: document.getElementById("n_name").value.trim(),
    department: document.getElementById("n_department").value.trim(),
    deviceName: document.getElementById("n_deviceName").value.trim(),
    serialNumber: document.getElementById("n_serialNumber").value.trim(),
    purchaseDate: toTimestamp(document.getElementById("n_purchaseDate").value),
    warrantyExpire: toTimestamp(document.getElementById("n_warrantyExpire").value),
    warrantyPeriod: document.getElementById("n_warrantyPeriod").value.trim(),
    shop: document.getElementById("n_shop").value.trim(),
    contactNumber: document.getElementById("n_contactNumber").value.trim(),
    comment: document.getElementById("n_comment").value.trim(),
    company: company,
    status: "available"
  };

  if (isEditing) {
    await updateDoc(doc(db, currentEditCollection, currentEditId), data);
    alert("อัปเดตข้อมูลโน้ตบุ๊กแล้ว");
    isEditing = false;
    currentEditId = null;
    currentEditCollection = null;
    notebookForm.querySelector("button[type='submit']").textContent = "บันทึกโน้ตบุ๊ก";
  } else {
    await addDoc(getCollectionByCompany(company), data);
    alert("บันทึกโน้ตบุ๊กแล้ว");
  }

  notebookForm.reset();
  loadFilteredData();
});
//------------------------------------------------------------notebook----------------------------------------------------

//------------------------------------------------------------แสดงข้อมูลในตาราง----------------------------------------------------

const filterCompany = document.getElementById("filterCompany");
const filterType = document.getElementById("filterType");

const filterName = document.getElementById("filterName");
const filterDept = document.getElementById("filterDept");
const filterAssetCode = document.getElementById("filterAssetCode");
const filterbarCode = document.getElementById("filterbarCode");


filterCompany.addEventListener("change", loadFilteredData);
filterType.addEventListener("change", loadFilteredData);

filterName.addEventListener("input", loadFilteredData);
filterDept.addEventListener("input", loadFilteredData);
filterAssetCode.addEventListener("input", loadFilteredData);
filterbarCode.addEventListener("input", loadFilteredData);

async function loadFilteredData() {
  const type = filterType.value;
  const company = filterCompany.value;

  const list = document.getElementById("deviceList");
  list.innerHTML = "";

  const collectionsToSearch = [];

  if (company === "all") {
    collectionsToSearch.push("devices_swp", "devices_esk");
  } else {
    collectionsToSearch.push(`devices_${company}`);
  }

  let index = 1;
  for (const col of collectionsToSearch) {
    const colRef = collection(db, col);
    const snapshot = await getDocs(colRef);

    snapshot.forEach(docSnap => {
      const d = docSnap.data();

       // กรองตาม type
      if (type !== "all" && d.type !== type) return;

      // ✅ กรองตาม barcode
      const BarcodeFilter = filterbarCode.value.trim().toLowerCase();
      if (BarcodeFilter && !d.barCode?.toLowerCase().includes(BarcodeFilter)) return;

      // ✅ กรองตามรหัสทรัพย์สิน
      const assetCodeFilter = filterAssetCode.value.trim().toLowerCase();
      if (assetCodeFilter && !d.assetCode?.toLowerCase().includes(assetCodeFilter)) return;

      // ✅ กรองตามชื่อ
      const nameFilter = filterName.value.trim().toLowerCase();
      if (nameFilter && !d.name?.toLowerCase().includes(nameFilter)) return;

      // ✅ กรองตามแผนก (ถ้ามี)
      const deptFilter = filterDept.value.trim().toLowerCase();
      if (deptFilter && !d.department?.toLowerCase().includes(deptFilter)) return;
      
      // แปลง timestamp เป็นวันที่ readable
      const purchase = d.purchaseDate?.toDate().toLocaleDateString("th-TH") || "-";
      const warranty = d.warrantyExpire?.toDate().toLocaleDateString("th-TH") || "-";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index++}</td>
        <td>${d.barCode || ""}</td>
        <td>${d.assetCode}</td>
        <td>${d.name}</td>
        <td>${d.department}</td>
        <td>${d.deviceName}</td>
        <td>${d.serialNumber}</td>
        <td>${purchase}</td>
        <td>${warranty}</td>
        <td>${d.warrantyPeriod}</td>
        <td>${d.shop}</td>
        <td>${d.contactNumber}</td>
        <td>${d.company.toUpperCase()}</td>
        <td>${d.comment}</td>
        <td>  <button onclick="editItem('${col}', '${docSnap.id}')">แก้ไข</button>
              <button onclick="deleteItem('${col}', '${docSnap.id}')">ลบ</button>
        </td>
      ` ;
      list.appendChild(tr);
    });
  }
}

window.deleteItem = async (colName, id) => {
  await deleteDoc(doc(db, colName, id));
  loadFilteredData();
};


// ฟังก์ชันลบข้อมูล
window.deleteComputer = async (id) => {
  if (confirm("ยืนยันการลบข้อมูลนี้ใช่หรือไม่?")) {
    await deleteDoc(doc(db, "computers", id));
  }
};
//------------------------------------------------------------แสดงข้อมูลในตาราง----------------------------------------------------

//------------------------------------------------------------แก้ไขข้อมูล----------------------------------------------------
window.editItem = async (colName, docId) => {
  const docRef = doc(db, colName, docId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return alert("ไม่พบข้อมูล");

  const d = snap.data();

  currentEditId = docId;
  currentEditCollection = colName;
  isEditing = true;

  // ใส่ข้อมูลเข้า form
  if (d.type === "computer") {
    deviceTypeSelect.value = "computer";
    companySelect.value = d.company;
    toggleForms();

    document.getElementById("c_assetCode").value = d.assetCode;
    document.getElementById("c_name").value = d.name;
    document.getElementById("c_deviceName").value = d.deviceName;
    document.getElementById("c_serialNumber").value = d.serialNumber;
    document.getElementById("c_cpu").value = d.cpu || "";
    document.getElementById("c_ram").value = d.ram || "";

    // เปลี่ยนปุ่ม
    computerForm.querySelector("button[type='submit']").textContent = "อัปเดตข้อมูล";

  } else if (d.type === "notebook") {
    deviceTypeSelect.value = "notebook";
    companySelect.value = d.company;
    toggleForms();

    document.getElementById("n_assetCode").value = d.assetCode;
    document.getElementById("n_name").value = d.name;
    document.getElementById("n_deviceName").value = d.deviceName;
    document.getElementById("n_serialNumber").value = d.serialNumber;
    document.getElementById("n_screenSize").value = d.screenSize || "";
    document.getElementById("n_battery").value = d.battery || "";

    notebookForm.querySelector("button[type='submit']").textContent = "อัปเดตข้อมูล";
  }
};
//------------------------------------------------------------แก้ไขข้อมูล----------------------------------------------------
