// src/screens/Tournament/data/tournaments.js
export const tournamentsSeed = [
  {
    id: "t1",
    status: "upcoming",
    title:
      "Giải Pickleball VTVCab Tiger Vũ Yên 2026 - Doanh nhân đôi hỗn hợp < 35 tuổi",
    banner:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1400&q=80",

    dateTime: "06/03/2026 07:00",
    registerDeadline: "02/03/2026 23:11",

    format: "Đôi",
    playoffType: "Playoff", // ✅Thể thức như ảnh
    gameType: "Đôi", // Giải: Đôi/Đơn
    singleLimit: 2.7,
    doubleLimit: 5.2,

    location:
      "Cụm sân TIGER VŨ YÊN Pickleball - Khu Đô thị Vũ Yên, Thuỷ Nguyên, Hải Phòng (15 sân)",

    area: "Huyện Thuỷ Nguyên - Hải Phòng",
    expectedTeams: 64,
    matches: 95,

    statusText: "Sắp diễn ra", // Tình trạng
    stateText: "Mở rộng", //  Dạng

    organizer: "đơn vị tổ chức",
    creator: "Ngô Văn Đạt",
    registeredCount: 10,
    pairedCount: 10,

    content: "Btc", //  “Nội dung”
  },

  {
    id: "t2",
    status: "ongoing",
    title: "Giải Pickleball Hà Nội Open 2026 - Đôi nam",
    banner:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=80",
    dateTime: "01/03/2026 08:00",
    registerDeadline: "28/02/2026 20:00",
    format: "Đôi",
    playoffType: "Vòng bảng",
    gameType: "Đôi",
    singleLimit: 3.0,
    doubleLimit: 6.0,
    location: "Hà Nội",
    area: "Hà Nội",
    expectedTeams: 48,
    matches: 70,
    statusText: "Đang diễn ra",
    stateText: "Đang diễn ra",
    organizer: "BTC Hà Nội",
    creator: "Admin",
    registeredCount: 20,
    pairedCount: 12,
    content: "",
  },

  {
    id: "t3",
    status: "finished",
    title: "Giải Pickleball Quảng Ninh 2025 - Đơn nam",
    banner:
      "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=1400&q=80",
    dateTime: "12/12/2025 07:30",
    registerDeadline: "05/12/2025 23:00",
    format: "Đơn",
    playoffType: "Loại trực tiếp",
    gameType: "Đơn",
    singleLimit: 3.5,
    doubleLimit: 0,
    location: "Quảng Ninh",
    area: "Quảng Ninh",
    expectedTeams: 128,
    matches: 120,
    statusText: "Kết thúc",
    stateText: "Kết thúc",
    organizer: "BTC Quảng Ninh",
    creator: "Admin",
    registeredCount: 128,
    pairedCount: 0,
    content: "",
  },
];
