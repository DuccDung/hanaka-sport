// src/screens/Videos/data/videos.js
export const VIDEO_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "suggest", label: "Đề xuất mới" },
  { key: "live", label: "Trực tiếp" },
];

export const videosSeed = [
  {
    id: "v1",
    type: "all", // all | suggest | live
    banner:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1400&q=80",
    dateTime: "01/03/2026 19:38",
    code: "V5-B8",
    title: "GIẢI ĐẤU PICKLEBALL KF OPEN CUP 2026 - ĐÔI HỖN HỢP 7.0",
    players: [
      { name: "Thành Cận", avatar: "https://i.pravatar.cc/100?img=11" },
      { name: "Tuyển CR9", avatar: "https://i.pravatar.cc/100?img=12" },
      { name: "Hiếu Bờ Hồ", avatar: "https://i.pravatar.cc/100?img=13" },
      { name: "Long Phúc", avatar: "https://i.pravatar.cc/100?img=14" },
    ],
    scores: [0, 0, 0, 0],
  },
  {
    id: "v2",
    type: "suggest",
    banner:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=80",
    dateTime: "03/03/2026 09:20",
    code: "V2-A1",
    title: "HIGHLIGHT PICKLEBALL - ĐÔI NAM",
    players: [
      { name: "A", avatar: "https://i.pravatar.cc/100?img=21" },
      { name: "B", avatar: "https://i.pravatar.cc/100?img=22" },
      { name: "C", avatar: "https://i.pravatar.cc/100?img=23" },
      { name: "D", avatar: "https://i.pravatar.cc/100?img=24" },
    ],
    scores: [0, 0, 0, 0],
  },
];
