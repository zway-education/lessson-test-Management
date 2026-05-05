/**
 * config.js — 台灣展威文化教育測評系統 共用設定
 * 三支頁面（填寫問卷 / 資料管理 / 測評報告）皆引用此檔
 * =====================================================
 * 修改班別、顏色、維度標籤、步驟定義，只需改這一支檔案
 */

const ZW = {

  /* ── 系統版本（顯示於頁面右下角徽章）── */
  VERSION: 'v1.09',

  /* ── Apps Script 網址（三支頁面統一從這裡讀取）── */
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxQNjBnZnw90piQd4k55MGUoRJQG9Gn0gsj_6XkMZHVuOyvb-b3JQz3uLFxpmId6WD9Zw/exec',

  /* ── 班別設定 ──────────────────────────────────── */
  // 顯示順序：啟蒙 → 開智 → 智優
  clsOrder: ['qm', 'kz', 'zy'],

  clsLabel: {
    qm: '🌟 啟蒙班',
    kz: '💡 開智班',
    zy: '🔬 智優班',
  },

  clsShort: {
    qm: '啟蒙班',
    kz: '開智班',
    zy: '智優班',
  },

  color: {
    qm: '#FF8C00',
    kz: '#1B6E35',
    zy: '#1251A3',
  },

  colorDark: {
    qm: '#FF5500',
    kz: '#239B4A',
    zy: '#1A5FBF',
  },

  bgColor: {
    qm: '#FFF8EE',
    kz: '#EDF8F1',
    zy: '#EEF3FF',
  },

  /* ── 角色標籤 ───────────────────────────────────── */
  roleLabel: {
    student: '學生自填',
    parent:  '家長填寫',
  },

  /* ── 量表標籤（1–5 分）──────────────────────────── */
  scaleLabel: ['完全不符合', '', '普通', '', '完全符合'],

  /* ── 維度標籤（對應填寫步驟，index 0 略過）────────
     用途：資料管理頁計算各維度均值、報告頁標示圖表
  ─────────────────────────────────────────────── */
  dimLabels: {
    qm_parent:  ['', '左右腦',   '大腦五力', '多元智能', '教養風格', '關係&環境'],
    zy_student: ['', 'ASK',      '4C',       '覺知五力', '多元智能', 'RIASEC'],
    zy_parent:  ['', 'ASK',      '4C',       '覺知五力', '多元智能', 'RIASEC',  '教養風格'],
    kz_student: ['', '多元智能', '4C',       'ASK'],
    kz_parent:  ['', '多元智能', '4C',       'ASK',      '教養風格'],
  },

  /* ── 步驟定義（對應填寫問卷分頁順序）──────────────
     label：管理者/除錯用，不對受測者顯示
     type ：'info' = 基本資料表單，'q' = 量表題
     stepIdx：對應 Q 物件（或 Sheets）的 step 欄位值
  ─────────────────────────────────────────────── */
  stepDef: {
    qm_parent: [
      { label: '基本資料',   type: 'info' },
      { label: '左右腦優勢', type: 'q', stepIdx: 2 },
      { label: '大腦五力',   type: 'q', stepIdx: 3 },
      { label: '多元智能',   type: 'q', stepIdx: 4 },
      { label: '教養風格',   type: 'q', stepIdx: 5 },
      { label: '關係＋環境', type: 'q', stepIdx: 6 },
    ],
    zy_student: [
      { label: '基本資料',       type: 'info' },
      { label: 'ASK 核心能力',   type: 'q', stepIdx: 2 },
      { label: '4C 素養力',      type: 'q', stepIdx: 3 },
      { label: '覺知五力',       type: 'q', stepIdx: 4 },
      { label: '多元智能',       type: 'q', stepIdx: 5 },
      { label: 'RIASEC 職業興趣', type: 'q', stepIdx: 6 },
    ],
    zy_parent: [
      { label: '基本資料',         type: 'info' },
      { label: 'ASK（家長觀察）',  type: 'q', stepIdx: 2 },
      { label: '4C（家長觀察）',   type: 'q', stepIdx: 3 },
      { label: '覺知五力（家長）', type: 'q', stepIdx: 4 },
      { label: '多元智能（家長）', type: 'q', stepIdx: 5 },
      { label: 'RIASEC（家長）',   type: 'q', stepIdx: 6 },
      { label: '教養風格',         type: 'q', stepIdx: 7 },
    ],
    kz_student: [
      { label: '基本資料', type: 'info' },
      { label: '多元智能', type: 'q', stepIdx: 2 },
      { label: '4C 素養力', type: 'q', stepIdx: 3 },
      { label: 'ASK 核心能力', type: 'q', stepIdx: 4 },
    ],
    kz_parent: [
      { label: '基本資料',       type: 'info' },
      { label: '多元智能（家長）', type: 'q', stepIdx: 2 },
      { label: '4C（家長）',     type: 'q', stepIdx: 3 },
      { label: 'ASK（家長）',    type: 'q', stepIdx: 4 },
      { label: '教養風格',       type: 'q', stepIdx: 5 },
    ],
  },

  /* ── 工具方法 ───────────────────────────────────── */

  /** 計算一筆紀錄各維度均值，回傳 [{label, avg, count}] */
  calcDims(rec) {
    const labels = this.dimLabels[rec.qKey] || [];
    const result = [];
    for (let s = 1; s < labels.length; s++) {
      const prefix = `${rec.qKey}_s${s}_q`;
      const vals = [];
      for (let q = 0; q < 50; q++) {
        const key = prefix + q;
        if (rec[key] !== undefined) vals.push(Number(rec[key]));
        else break;
      }
      if (vals.length > 0) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        result.push({ label: labels[s], avg: Math.round(avg * 100) / 100, count: vals.length });
      }
    }
    return result;
  },

  /** 是否為 dev 模式（Apps Script 未設定）*/
  get isDevMode() {
    return this.APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE';
  },
};
