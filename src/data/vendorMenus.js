// เมนูของแต่ละร้าน + รายการ Add-on
// addon แบบตัวอย่าง: ธรรมดา +0, พิเศษ +5
const commonAddons = [
  { key: "normal", label: "ธรรมดา", extra: 0 },
  { key: "special", label: "พิเศษ (+5 บาท)", extra: 5 },
];

const vendorMenus = {
  noodle: [
    { id: "noodle-1", name: "ก๋วยเตี๋ยว",        price: 45, addons: commonAddons },
    { id: "noodle-2", name: "ข้าวซอย",           price: 50, addons: commonAddons },
    { id: "noodle-3", name: "ขนมจีนน้ำเงี้ยว",   price: 40, addons: commonAddons },
  ],
  "pa-aem": [
    { id: "aem-1", name: "ข้าวผัด",              price: 45, addons: commonAddons },
    { id: "aem-2", name: "หมูกรอบกระเพรา",       price: 55, addons: commonAddons },
  ],
  "pa-waew": [
    { id: "waew-1", name: "น้ำพริกหนุ่มชุด",     price: 45, addons: commonAddons },
    { id: "waew-2", name: "ขนมจีนน้ำเงี้ยว",     price: 40, addons: commonAddons },
  ],
};

export default vendorMenus;
