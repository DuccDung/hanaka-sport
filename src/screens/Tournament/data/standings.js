// src/screens/Tournament/data/standings.js
export const standingRounds = [
  { key: "r1", label: "Vòng 1" },
  { key: "r4", label: "Vòng 4" },
  { key: "r2", label: "Vòng 2" },
  { key: "r3", label: "Vòng 3" },
];

export const standingsSeed = [
  {
    id: "g11",
    roundKey: "r1",
    groupName: "Bảng 11",
    rows: [
      {
        team: "Quang Hổ/\nHưng hưng\nhân",
        win: 1,
        point: 1,
        hso: 6,
        rank: 1,
        top: true,
      },
      {
        team: "Đinh Thường\nTin/Anh\nQuang",
        win: 1,
        point: 0,
        hso: -6,
        rank: 2,
        top: false,
      },
    ],
  },
  {
    id: "g5",
    roundKey: "r1",
    groupName: "Bảng 5",
    rows: [
      {
        team: "Đạt Bin/Thắng\nbò",
        win: 1,
        point: 1,
        hso: 6,
        rank: 1,
        top: true,
      },
      {
        team: "Lượng Wind/\nSơn Trần",
        win: 1,
        point: 0,
        hso: -6,
        rank: 2,
        top: false,
      },
    ],
  },
  {
    id: "g2",
    roundKey: "r1",
    groupName: "Bảng 2",
    rows: [
      { team: "Dũng Lê/Lâm", win: 1, point: 1, hso: 6, rank: 1, top: true },
      {
        team: "Tùng Hải\nPhòng/Dũng\nTáo Tàu",
        win: 1,
        point: 0,
        hso: -6,
        rank: 2,
        top: false,
      },
    ],
  },
  {
    id: "g7",
    roundKey: "r1",
    groupName: "Bảng 7",
    rows: [
      { team: "Phan Văn\nA / B", win: 1, point: 1, hso: 4, rank: 1, top: true },
      { team: "C / D", win: 1, point: 0, hso: -4, rank: 2, top: false },
    ],
  },
];
