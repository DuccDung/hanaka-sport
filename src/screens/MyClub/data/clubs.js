// src/screens/Club/data/clubs.js
export const CLUB_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "near", label: "Gần bạn" },
  { key: "hot", label: "Nổi bật" },
];

export const clubsSeed = [
  {
    id: "c1",
    type: "near", // all | near | hot
    banner:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1400&q=80",
    name: "Dev",
    membersCount: 1,
    rating: 0.0,
    reviewsCount: 0,
    location: "Quận Ba Đình - Hà Nội",
    level: "2.5",
    wins: "-",
    draws: "-",
    losses: "-",
    phone: "",
  },
  {
    id: "c2",
    type: "hot",
    banner:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=80",
    name: "KF Pickleball Club",
    membersCount: 52,
    rating: 4.6,
    reviewsCount: 128,
    location: "Cầu Giấy - Hà Nội",
    level: "3.5",
    wins: 18,
    draws: 2,
    losses: 7,
    phone: "0989 999 999",
  },
];
