// src/screens/Tournament/data/schedule.js

export const rounds = [
  { key: "r1", label: "Vòng 1" },
  { key: "r2", label: "Vòng 2" },
  { key: "r3", label: "Vòng 3" },
];

// Seed data demo: thêm `tableNo` để gộp trận theo "bảng"
export const scheduleSeed = [
  // Round 1 - Table 1
  {
    id: "r1-t1-m1",
    roundKey: "r1",
    tableNo: 1,
    leftIndex: 1,
    code: "V1-B1-#1",
    time: "10:44",
    court: "-",
    teamA: "Đỗ Mạnh Hùng/ Đỗ Mạnh ...",
    teamB: "Vũ Khánh/ Vũ Khánh",
    scoreA: 0,
    scoreB: 0,
  },
  {
    id: "r1-t1-m2",
    roundKey: "r1",
    tableNo: 1,
    leftIndex: 2,
    code: "V1-B1-#3",
    time: "10:44",
    court: "-",
    teamA: "Đỗ Mạnh Hùng/ Đỗ Mạnh ...",
    teamB: "Travada1/ Travada1",
    scoreA: 0,
    scoreB: 0,
  },
  {
    id: "r1-t1-m3",
    roundKey: "r1",
    tableNo: 1,
    leftIndex: 3,
    code: "V1-B1-#6",
    time: "10:44",
    court: "-",
    teamA: "Vũ Khánh/ Vũ Khánh",
    teamB: "Travada1/ Travada1",
    scoreA: 0,
    scoreB: 0,
  },

  // Round 1 - Table 2
  {
    id: "r1-t2-m1",
    roundKey: "r1",
    tableNo: 2,
    leftIndex: 1,
    code: "V1-B2-#1",
    time: "11:10",
    court: "1",
    teamA: "A Team/ A Team",
    teamB: "B Team/ B Team",
    scoreA: 0,
    scoreB: 0,
  },

  // Round 2 - Table 1
  {
    id: "r2-t1-m1",
    roundKey: "r2",
    tableNo: 1,
    leftIndex: 1,
    code: "V2-B1-#1",
    time: "14:00",
    court: "2",
    teamA: "Winner M1",
    teamB: "Winner M2",
    scoreA: 0,
    scoreB: 0,
  },
];
