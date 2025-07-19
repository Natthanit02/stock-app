import { db } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const companySelect = document.getElementById("companySelect");
const deviceTypeSelect = document.getElementById("deviceType");
const computerForm = document.getElementById("computerForm");
const notebookForm = document.getElementById("notebookForm");
const telephoneForm = document.getElementById("telephoneForm");
const printerForm = document.getElementById("printerForm");
const routerForm = document.getElementById("routerForm");
const switchForm = document.getElementById("switchForm");

let isEditing = false;
let currentEditId = null;
let currentEditCollection = null;

function toTimestamp(dateStr) {
  if (!dateStr) return null;
  return Timestamp.fromDate(new Date(dateStr));
}

function getCollectionByCompany(company) {
  if (company === "swp") return collection(db, "devices_swp");
  if (company === "esk") return collection(db, "devices_esk");
  throw new Error("ไม่พบบริษัท");
}

async function checkDuplicateAssetCode(company, assetCode) {
  const colRef = getCollectionByCompany(company);
  const q = query(colRef, where("assetCode", "==", assetCode));
  const snap = await getDocs(q);
  return !snap.empty;
}

companySelect.addEventListener("change", toggleForms);
deviceTypeSelect.addEventListener("change", toggleForms);

function toggleForms() {
  const type = deviceTypeSelect.value;
  const company = companySelect.value;

  computerForm.style.display =
    type === "computer" && company ? "block" : "none";
  notebookForm.style.display =
    type === "notebook" && company ? "block" : "none";
  telephoneForm.style.display =
    type === "telephone" && company ? "block" : "none";
  printerForm.style.display = 
    type === "printer" && company ? "block" : "none";
  routerForm.style.display = 
    type === "router" && company ? "block" : "none";
  switchForm.style.display = 
    type === "switch" && company ? "block" : "none";

}

//-------------------------------------------event listener--------------------------------------------------------
// <---------- computer ---------->
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
    company,
    status: "available",
  };

  if (!isEditing) {
    const isDuplicate = await checkDuplicateAssetCode(company, data.assetCode);
    if (isDuplicate) return alert("รหัสทรัพย์สินนี้มีอยู่ในระบบแล้ว");
    await addDoc(getCollectionByCompany(company), data);
    alert("บันทึกเรียบร้อยแล้ว");
    computerForm.reset();
  } else {
    const oldCompanyCollection = currentEditCollection;
    const newCompanyCollection = getCollectionByCompany(company).path;

    if (oldCompanyCollection !== newCompanyCollection) {
      await deleteDoc(doc(db, oldCompanyCollection, currentEditId));
      await addDoc(getCollectionByCompany(company), data);
    } else {
      await updateDoc(doc(db, oldCompanyCollection, currentEditId), data);
    }

    alert("อัปเดตข้อมูลเรียบร้อยแล้ว");
    computerForm.reset();
    isEditing = false;
    currentEditId = null;
    currentEditCollection = null;
    computerForm.querySelector("button[type='submit']").textContent =
      "บันทึกคอมพิวเตอร์";
  }
});

// <---------- notebook ---------->
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
    model: document.getElementById("n_model").value.trim(),
    serialNumber: document.getElementById("n_serialNumber").value.trim(),
    purchaseDate: toTimestamp(document.getElementById("n_purchaseDate").value),
    warrantyExpire: toTimestamp(document.getElementById("n_warrantyExpire").value),
    warrantyPeriod: document.getElementById("n_warrantyPeriod").value.trim(),
    shop: document.getElementById("n_shop").value.trim(),
    contactNumber: document.getElementById("n_contactNumber").value.trim(),
    comment: document.getElementById("n_comment").value.trim(),
    company,
    status: "available",
  };

  if (!isEditing) {
    const isDuplicate = await checkDuplicateAssetCode(company, data.assetCode);
    if (isDuplicate) return alert("รหัสทรัพย์สินนี้มีอยู่ในระบบแล้ว");
    await addDoc(getCollectionByCompany(company), data);
    alert("บันทึกเรียบร้อยแล้ว");
    notebookForm.reset();
  } else {
    const oldCompanyCollection = currentEditCollection;
    const newCompanyCollection = getCollectionByCompany(company).path;

    if (oldCompanyCollection !== newCompanyCollection) {
      await deleteDoc(doc(db, oldCompanyCollection, currentEditId));
      await addDoc(getCollectionByCompany(company), data);
    } else {
      await updateDoc(doc(db, oldCompanyCollection, currentEditId), data);
    }

    alert("อัปเดตข้อมูลเรียบร้อยแล้ว");
    notebookForm.reset();
    isEditing = false;
    currentEditId = null;
    currentEditCollection = null;
    notebookForm.querySelector("button[type='submit']").textContent =
      "บันทึกคอมพิวเตอร์";
  }
});

// <---------- telephone ---------->
telephoneForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const company = companySelect.value;

  const data = {
    type: "telephone",
    barCode: document.getElementById("t_barCode").value.trim(),
    assetCode: document.getElementById("t_assetCode").value.trim(),
    name: document.getElementById("t_name").value.trim(),
    department: document.getElementById("t_department").value.trim(),
    deviceName: document.getElementById("t_deviceName").value.trim(),
    netWork: document.getElementById("t_netWork").value.trim(),
    teleNumber: document.getElementById("t_teleNumber").value.trim(),
    serialNumber: document.getElementById("t_serialNumber").value.trim(),
    purchaseDate: toTimestamp(document.getElementById("t_purchaseDate").value),
    warrantyExpire: toTimestamp(document.getElementById("t_warrantyExpire").value),
    warrantyPeriod: document.getElementById("t_warrantyPeriod").value.trim(),
    shop: document.getElementById("t_shop").value.trim(),
    simais: document.getElementById("t_simais").value.trim(),
    contactNumber: document.getElementById("t_contactNumber").value.trim(),
    comment: document.getElementById("t_comment").value.trim(),
    company,
    status: "available",
  };

  if (!isEditing) {
    const isDuplicate = await checkDuplicateAssetCode(company, data.assetCode);
    if (isDuplicate) return alert("รหัสทรัพย์สินนี้มีอยู่ในระบบแล้ว");
    await addDoc(getCollectionByCompany(company), data);
    alert("บันทึกเรียบร้อยแล้ว");
    telephoneForm.reset();
  } else {
    const oldCompanyCollection = currentEditCollection;
    const newCompanyCollection = getCollectionByCompany(company).path;

    if (oldCompanyCollection !== newCompanyCollection) {
      await deleteDoc(doc(db, oldCompanyCollection, currentEditId));
      await addDoc(getCollectionByCompany(company), data);
    } else {
      await updateDoc(doc(db, oldCompanyCollection, currentEditId), data);
    }

    alert("อัปเดตข้อมูลเรียบร้อยแล้ว");
    telephoneForm.reset();

    isEditing = false;
    currentEditId = null;
    currentEditCollection = null;
    telephoneForm.querySelector("button[type='submit']").textContent =
      "บันทึกคอมพิวเตอร์";
  }
});

// <---------- printer ---------->
printerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const company = companySelect.value;
  const data = {
    type: "printer",
    barCode: document.getElementById("p_barCode").value.trim(),
    assetCode: document.getElementById("p_assetCode").value.trim(),
    department: document.getElementById("p_department").value.trim(),
    deviceName: document.getElementById("p_deviceName").value.trim(),
    serialNumber: document.getElementById("p_serialNumber").value.trim(),
    purchaseDate: toTimestamp(document.getElementById("p_purchaseDate").value),
    warrantyExpire: toTimestamp(document.getElementById("p_warrantyExpire").value),
    warrantyPeriod: document.getElementById("p_warrantyPeriod").value.trim(),
    shop: document.getElementById("p_shop").value.trim(),
    contactNumber: document.getElementById("p_contactNumber").value.trim(),
    comment: document.getElementById("p_comment").value.trim(),
    company,
    status: "available"
  };

  if (!isEditing) {
    const isDuplicate = await checkDuplicateAssetCode(company, data.assetCode);
    if (isDuplicate) return alert("รหัสทรัพย์สินนี้มีอยู่ในระบบแล้ว");
    await addDoc(getCollectionByCompany(company), data);
    alert("บันทึกเรียบร้อยแล้ว");
    printerForm.reset();
  } else {
    const oldCompanyCollection = currentEditCollection;
    const newCompanyCollection = getCollectionByCompany(company).path;

    if (oldCompanyCollection !== newCompanyCollection) {
      await deleteDoc(doc(db, oldCompanyCollection, currentEditId));
      await addDoc(getCollectionByCompany(company), data);
    } else {
      await updateDoc(doc(db, oldCompanyCollection, currentEditId), data);
    }

    alert("อัปเดตข้อมูลเรียบร้อยแล้ว");
    printerForm.reset();

    isEditing = false;
    currentEditId = null;
    currentEditCollection = null;
    printerForm.querySelector("button[type='submit']").textContent = "บันทึกเครื่องปริ้นเตอร์";
  }

  loadFilteredData();
});

// <---------- printer ---------->
routerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const company = companySelect.value;
  const data = {
    type: "router",
    barCode: document.getElementById("r_barCode").value.trim(),
    assetCode: document.getElementById("r_assetCode").value.trim(),
    department: document.getElementById("r_department").value.trim(),
    deviceName: document.getElementById("r_deviceName").value.trim(),
    serialNumber: document.getElementById("r_serialNumber").value.trim(),
    purchaseDate: toTimestamp(document.getElementById("r_purchaseDate").value),
    warrantyPeriod: document.getElementById("r_warrantyPeriod").value.trim(),
    shop: document.getElementById("r_shop").value.trim(),
    contactNumber: document.getElementById("r_contactNumber").value.trim(),
    comment: document.getElementById("r_comment").value.trim(),
    company,
    status: "available"
  };

  if (!isEditing) {
    const isDuplicate = await checkDuplicateAssetCode(company, data.assetCode);
    if (isDuplicate) return alert("รหัสทรัพย์สินนี้มีอยู่ในระบบแล้ว");
    await addDoc(getCollectionByCompany(company), data);
    alert("บันทึกเรียบร้อยแล้ว");
    routerForm.reset();
  } else {
    const oldCompanyCollection = currentEditCollection;
    const newCompanyCollection = getCollectionByCompany(company).path;

    if (oldCompanyCollection !== newCompanyCollection) {
      await deleteDoc(doc(db, oldCompanyCollection, currentEditId));
      await addDoc(getCollectionByCompany(company), data);
    } else {
      await updateDoc(doc(db, oldCompanyCollection, currentEditId), data);
    }

    alert("อัปเดตข้อมูลเรียบร้อยแล้ว");
    routerForm.reset();
    isEditing = false;
    currentEditId = null;
    currentEditCollection = null;
    routerForm.querySelector("button[type='submit']").textContent = "บันทึก Router";
  }

  loadFilteredData();
});

// <---------- switch ---------->
switchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const company = companySelect.value;

  const data = {
    type: "switch",
    barCode: document.getElementById("s_barCode").value.trim(),
    assetCode: document.getElementById("s_assetCode").value.trim(),
    department: document.getElementById("s_department").value.trim(),
    deviceName: document.getElementById("s_deviceName").value.trim(),
    serialNumber: document.getElementById("s_serialNumber").value.trim(),
    purchaseDate: toTimestamp(document.getElementById("s_purchaseDate").value),
    warrantyPeriod: document.getElementById("s_warrantyPeriod").value.trim(),
    shop: document.getElementById("s_shop").value.trim(),
    contactNumber: document.getElementById("s_contactNumber").value.trim(),
    comment: document.getElementById("s_comment").value.trim(),
    company,
    status: "available"
  };

  if (!isEditing) {
    const isDuplicate = await checkDuplicateAssetCode(company, data.assetCode);
    if (isDuplicate) return alert("รหัสทรัพย์สินนี้มีอยู่ในระบบแล้ว");
    await addDoc(getCollectionByCompany(company), data);
    alert("บันทึกเรียบร้อยแล้ว");
    switchForm.reset();
  } else {
    const oldCompanyCollection = currentEditCollection;
    const newCompanyCollection = getCollectionByCompany(company).path;

    if (oldCompanyCollection !== newCompanyCollection) {
      await deleteDoc(doc(db, oldCompanyCollection, currentEditId));
      await addDoc(getCollectionByCompany(company), data);
    } else {
      await updateDoc(doc(db, oldCompanyCollection, currentEditId), data);
    }

    alert("อัปเดตข้อมูลเรียบร้อยแล้ว");
    switchForm.reset();

    isEditing = false;
    currentEditId = null;
    currentEditCollection = null;
    switchForm.querySelector("button[type='submit']").textContent = "บันทึก Switch";
  }

  loadFilteredData();
});



//-------------------------------------------event listener--------------------------------------------------------

const filterCompany = document.getElementById("filterCompany");
const filterType = document.getElementById("filterType");
const filterName = document.getElementById("filterName");
const filterDept = document.getElementById("filterDept");
const filterAssetCode = document.getElementById("filterAssetCode");
const filterbarCode = document.getElementById("filterbarCode");

[
  filterCompany,
  filterType,
  filterName,
  filterDept,
  filterAssetCode,
  filterbarCode,
].forEach((el) => el.addEventListener("input", loadFilteredData));

async function loadFilteredData() {
  const type = filterType.value;
  const company = filterCompany.value;
  const list = document.getElementById("deviceList");
  const thead = document.querySelector("thead tr");
  list.innerHTML = "";

  if (type === "notebook") {
    thead.innerHTML = `
    <th>ลำดับ</th>
    <th>BarCode</th>
    <th>รหัสทรัพย์สิน</th>
    <th>ชื่อผู้ใช้</th>
    <th>แผนก</th>
    <th>ชื่ออุปกรณ์</th>
    <th>Model</th>
    <th>SN</th>
    <th>วันที่ซื้อ</th>
    <th>วันหมดอายุประกัน</th>
    <th>ประกัน/ปี</th>
    <th>ซื้อจาก</th>
    <th>เบอร์ติดต่อ</th>
    <th>บริษัท</th>
    <th>หมายเหตุ</th>
    <th>จัดการ</th>`;
  } else if (type === "telephone") {
    thead.innerHTML = `
    <th>ลำดับ</th>
    <th>BarCode</th>
    <th>รหัสทรัพย์สิน</th>
    <th>ชื่อผู้ใช้</th>
    <th>แผนก</th>
    <th>ชื่ออุปกรณ์</th>
    <th>เครือข่าย</th>
    <th>เบอร์โทร</th>
    <th>SN</th>
    <th>วันที่ซื้อ</th>
    <th>วันหมดอายุประกัน</th>
    <th>ประกัน/ปี</th>
    <th>ซื้อจาก</th>
    <th>เบอร์ติดต่อ</th>
    <th>บริษัท</th>
    <th>หมายเหตุ</th>
    <th>จัดการ</th>`;
  } else if (type === "printer") {
  thead.innerHTML = `
    <th>ลำดับ</th>
    <th>BarCode</th>
    <th>รหัสทรัพย์สิน</th>
    <th>แผนก</th>
    <th>ชื่ออุปกรณ์</th>
    <th>SN</th>
    <th>วันที่ซื้อ</th>
    <th>วันหมดอายุประกัน</th>
    <th>ประกัน/ปี</th>
    <th>ซื้อจาก</th>
    <th>เบอร์ติดต่อ</th>
    <th>บริษัท</th>
    <th>หมายเหตุ</th>
    <th>จัดการ</th>`;
  } else if (type === "router") {
  thead.innerHTML = `
    <th>ลำดับ</th>
    <th>BarCode</th>
    <th>รหัสทรัพย์สิน</th>
    <th>แผนก</th>
    <th>ชื่ออุปกรณ์</th>
    <th>SN</th>
    <th>วันที่ซื้อ</th>
    <th>ประกัน/ปี</th>
    <th>ซื้อจาก</th>
    <th>เบอร์ติดต่อ</th>
    <th>บริษัท</th>
    <th>หมายเหตุ</th>
    <th>จัดการ</th>`;
  } else if (type === "switch") {
  thead.innerHTML = `
    <th>ลำดับ</th>
    <th>BarCode</th>
    <th>รหัสทรัพย์สิน</th>
    <th>แผนก</th>
    <th>ชื่ออุปกรณ์</th>
    <th>SN</th>
    <th>วันที่ซื้อ</th>
    <th>ประกัน</th>
    <th>ซื้อจาก</th>
    <th>เบอร์ติดต่อ</th>
    <th>บริษัท</th>
    <th>หมายเหตุ</th>
    <th>จัดการ</th>`;
  }else {
    thead.innerHTML = `
    <th>ลำดับ</th>
    <th>BarCode</th>
    <th>รหัสทรัพย์สิน</th>
    <th>ชื่อผู้ใช้</th>
    <th>แผนก</th>
    <th>ชื่ออุปกรณ์</th>
    <th>SN</th>
    <th>วันที่ซื้อ</th>
    <th>วันหมดอายุประกัน</th>
    <th>ประกัน/ปี</th>
    <th>ซื้อจาก</th>
    <th>เบอร์ติดต่อ</th>
    <th>บริษัท</th>
    <th>หมายเหตุ</th>
    <th>จัดการ</th>`;
  }

  const collectionsToSearch =
    company === "all" ? ["devices_swp", "devices_esk"] : [`devices_${company}`];

  let index = 1;
  for (const col of collectionsToSearch) {
    const snapshot = await getDocs(collection(db, col));
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      if (type !== "all" && d.type !== type) return;

      if (
        filterbarCode.value &&
        !d.barCode?.toLowerCase().includes(filterbarCode.value.toLowerCase())
      )
        return;
      if (
        filterAssetCode.value &&
        !d.assetCode
          ?.toLowerCase()
          .includes(filterAssetCode.value.toLowerCase())
      )
        return;
      if (
        filterName.value &&
        !d.name?.toLowerCase().includes(filterName.value.toLowerCase())
      )
        return;
      if (
        filterDept.value &&
        !d.department?.toLowerCase().includes(filterDept.value.toLowerCase())
      )
        return;

      const purchase =
        d.purchaseDate?.toDate().toLocaleDateString("th-TH") || "-";
      const warranty =
        d.warrantyExpire?.toDate().toLocaleDateString("th-TH") || "-";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index++}</td>
        <td>${d.barCode || "-"}</td>
        <td>${d.assetCode || "-"}</td> 
        ${["computer", "notebook", "telephone"].includes(type) ? `<td>${d.name || "-"}</td>` : ""}
        <td>${d.department || "-"}</td>
        <td>${d.deviceName || "-"}</td>
        ${type === "telephone" ? `<td>${d.netWork || "-"}</td>` : ""}
        ${type === "telephone" ? `<td>${d.teleNumber || "-"}</td>` : ""}
        ${type === "notebook" ? `<td>${d.model || "-"}</td>` : ""}
        <td>${d.serialNumber || "-"}</td>
        <td>${purchase}</td>
        ${["computer", "notebook", "telephone", "printer"].includes(type) ? `<td>${d.warrantyExpire ? d.warrantyExpire.toDate().toLocaleDateString("th-TH") : "-"}</td>` : ""}
        <td>${d.warrantyPeriod || "-"}</td>
        <td>${d.shop || "-"}</td>
        <td>${d.contactNumber || "-"}</td>
        <td>${d.company?.toUpperCase() || "-"}</td>
        <td>${d.comment || "-"}</td>
        <td>
          <button onclick="editItem('${col}', '${docSnap.id}')">แก้ไข</button>
          <button onclick="deleteItem('${col}', '${docSnap.id}')">ลบ</button>
        </td>`;
      list.appendChild(tr);
    });
  }
}

window.deleteItem = async (colName, id) => {
  if (confirm("ยืนยันการลบใช่หรือไม่?")) {
    await deleteDoc(doc(db, colName, id));
    loadFilteredData();
  }
};

//------------- แก้ไข -------------
window.editItem = async (colName, docId) => {
  const snap = await getDoc(doc(db, colName, docId));
  if (!snap.exists()) return alert("ไม่พบข้อมูล");
  const d = snap.data();

  deviceTypeSelect.value = d.type;
  companySelect.value = d.company;
  toggleForms();

  isEditing = true;
  currentEditId = docId;
  currentEditCollection = colName;

  if (d.type === "computer" || d.type === "notebook") {
    const prefix = d.type === "computer" ? "c" : "n";
    document.getElementById(`${prefix}_assetCode`).value = d.assetCode;
    document.getElementById(`${prefix}_name`).value = d.name;
    document.getElementById(`${prefix}_deviceName`).value = d.deviceName;
    document.getElementById(`${prefix}_serialNumber`).value = d.serialNumber;
    document.getElementById(`${prefix}_purchaseDate`).value =
      d.purchaseDate?.toDate().toISOString().split("T")[0] || "";
    document.getElementById(`${prefix}_warrantyExpire`).value =
      d.warrantyExpire?.toDate().toISOString().split("T")[0] || "";
    document.getElementById(`${prefix}_warrantyPeriod`).value =
      d.warrantyPeriod || "";
    document.getElementById(`${prefix}_shop`).value = d.shop || "";
    document.getElementById(`${prefix}_contactNumber`).value =
      d.contactNumber || "";
    document.getElementById(`${prefix}_comment`).value = d.comment || "";

    if (d.type === "notebook") {
      document.getElementById("n_model").value = d.model || "";
    }

    const form = d.type === "computer" ? computerForm : notebookForm;
    form.querySelector("button[type='submit']").textContent = "อัปเดตข้อมูล";
  } else if (d.type === "telephone") {
    document.getElementById("t_assetCode").value = d.assetCode;
    document.getElementById("t_name").value = d.name;
    document.getElementById("t_deviceName").value = d.deviceName;
    document.getElementById("t_netWork").value = d.netWork || "";
    document.getElementById("t_teleNumber").value = d.teleNumber || "";
    document.getElementById("t_serialNumber").value = d.serialNumber;
    document.getElementById("t_purchaseDate").value =
      d.purchaseDate?.toDate().toISOString().split("T")[0] || "";
    document.getElementById("t_warrantyExpire").value =
      d.warrantyExpire?.toDate().toISOString().split("T")[0] || "";
    document.getElementById("t_warrantyPeriod").value = d.warrantyPeriod || "";
    document.getElementById("t_shop").value = d.shop || "";
    document.getElementById("t_simais").value = d.simais || "";
    document.getElementById("t_contactNumber").value = d.contactNumber || "";
    document.getElementById("t_comment").value = d.comment || "";

    telephoneForm.querySelector("button[type='submit']").textContent =
      "อัปเดตข้อมูล";
  } else if (d.type === "printer") {
  document.getElementById("p_assetCode").value = d.assetCode;
  document.getElementById("p_deviceName").value = d.deviceName;
  document.getElementById("p_serialNumber").value = d.serialNumber;
  document.getElementById("p_purchaseDate").value = d.purchaseDate?.toDate().toISOString().split("T")[0] || "";
  document.getElementById("p_warrantyExpire").value = d.warrantyExpire?.toDate().toISOString().split("T")[0] || "";
  document.getElementById("p_warrantyPeriod").value = d.warrantyPeriod || "";
  document.getElementById("p_shop").value = d.shop || "";
  document.getElementById("p_contactNumber").value = d.contactNumber || "";
  document.getElementById("p_comment").value = d.comment || "";

  printerForm.querySelector("button[type='submit']").textContent = "อัปเดตข้อมูล";
  } else if (d.type === "router") {
  document.getElementById("r_barCode").value = d.barCode || "";
  document.getElementById("r_assetCode").value = d.assetCode;
  document.getElementById("r_department").value = d.department;
  document.getElementById("r_deviceName").value = d.deviceName;
  document.getElementById("r_model").value = d.model || "";
  document.getElementById("r_serialNumber").value = d.serialNumber;
  document.getElementById("r_purchaseDate").value = d.purchaseDate?.toDate().toISOString().split("T")[0] || "";
  document.getElementById("r_warrantyExpire").value = d.warrantyExpire?.toDate().toISOString().split("T")[0] || "";
  document.getElementById("r_warrantyPeriod").value = d.warrantyPeriod || "";
  document.getElementById("r_shop").value = d.shop || "";
  document.getElementById("r_contactNumber").value = d.contactNumber || "";
  document.getElementById("r_comment").value = d.comment || "";

  routerForm.querySelector("button[type='submit']").textContent = "อัปเดตข้อมูล";
  } else if (d.type === "switch") {
    document.getElementById("s_barCode").value = d.barCode || "";
    document.getElementById("s_assetCode").value = d.assetCode;
    document.getElementById("s_deviceName").value = d.deviceName;
    document.getElementById("s_department").value = d.department;
    document.getElementById("s_serialNumber").value = d.serialNumber;
    document.getElementById("s_purchaseDate").value = d.purchaseDate?.toDate().toISOString().split("T")[0] || "";
    document.getElementById("s_warrantyPeriod").value = d.warrantyPeriod || "";
    document.getElementById("s_shop").value = d.shop || "";
    document.getElementById("s_contactNumber").value = d.contactNumber || "";
    document.getElementById("s_comment").value = d.comment || "";

    switchForm.querySelector("button[type='submit']").textContent = "อัปเดตข้อมูล";
  }

};

// ตั้งค่าวันที่ปัจจุบันเป็นค่าเริ่มต้นในฟิลด์วันที่ซื้อ
function setDefaultTodayDate() {
  const today = new Date().toISOString().split("T")[0];

  document.getElementById("c_purchaseDate").value = today;
  document.getElementById("n_purchaseDate").value = today;
  document.getElementById("t_purchaseDate").value = today;
  document.getElementById("p_purchaseDate").value = today;
  document.getElementById("r_purchaseDate").value = today;
  document.getElementById("s_purchaseDate").value = today;
}

// เรียกใช้งานเมื่อล็อดเพจ
window.addEventListener("DOMContentLoaded", setDefaultTodayDate);