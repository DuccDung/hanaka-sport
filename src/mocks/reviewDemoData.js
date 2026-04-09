const REVIEW_DEMO_CLUB_ID = 90001;

const REVIEW_DEMO_USER = {
  userId: 9001,
  fullName: "Hanaka Sample",
  email: "sample@hanaka.local",
  avatarUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
  city: "Bac Ninh",
  verified: true,
  ratingSingle: 3.5,
  ratingDouble: 4.0,
};

const REVIEW_DEMO_CLUB = {
  clubId: REVIEW_DEMO_CLUB_ID,
  clubName: "Hanaka Sample Club",
  coverUrl:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
  areaText: "Tu Son - Bac Ninh",
  ratingAvg: 4.8,
  reviewsCount: 24,
  membersCount: 18,
  matchesPlayed: 18,
  matchesWin: 12,
  matchesDraw: 2,
  matchesLoss: 4,
  pendingMembersCount: 2,
  myClubStatus: "MANAGER",
  myMemberRole: "OWNER",
  canManage: true,
  allowChallenge: true,
  owner: {
    userId: REVIEW_DEMO_USER.userId,
    fullName: REVIEW_DEMO_USER.fullName,
    avatarUrl: REVIEW_DEMO_USER.avatarUrl,
    ratingSingle: REVIEW_DEMO_USER.ratingSingle,
    ratingDouble: REVIEW_DEMO_USER.ratingDouble,
  },
  overview: {
    foundedAt: "2024-06-10T00:00:00.000Z",
    addressText: "San Hanaka Pickleball, Tu Son, Bac Ninh",
    introduction:
      "CLB mau de ban xem giao dien CLB, thanh vien va khu vuc chat khi moi tham gia.",
    level: 4.8,
  },
};

const REVIEW_DEMO_MEMBERS = [
  {
    userId: REVIEW_DEMO_USER.userId,
    fullName: REVIEW_DEMO_USER.fullName,
    avatarUrl: REVIEW_DEMO_USER.avatarUrl,
    memberRole: "OWNER",
    ratingSingle: 3.5,
    ratingDouble: 4.0,
  },
  {
    userId: 9002,
    fullName: "Nguyen Anh",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    memberRole: "VICE_OWNER",
    ratingSingle: 3.0,
    ratingDouble: 3.6,
  },
  {
    userId: 9003,
    fullName: "Tran Minh",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80",
    memberRole: "MEMBER",
    ratingSingle: 2.8,
    ratingDouble: 3.1,
  },
];

const REVIEW_DEMO_PENDING_MEMBERS = [
  {
    userId: 9004,
    fullName: "Le Hoang",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&q=80",
    memberRole: "MEMBER",
    ratingSingle: 2.5,
    ratingDouble: 2.9,
  },
  {
    userId: 9005,
    fullName: "Pham Linh",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
    memberRole: "MEMBER",
    ratingSingle: 2.7,
    ratingDouble: 3.0,
  },
];

const REVIEW_DEMO_CHAT_ROOM = {
  clubId: REVIEW_DEMO_CLUB_ID,
  clubName: REVIEW_DEMO_CLUB.clubName,
  clubCoverUrl: REVIEW_DEMO_CLUB.coverUrl,
  areaText: REVIEW_DEMO_CLUB.areaText,
  lastMessageAt: "2026-04-07T09:05:00.000Z",
  lastSenderUserId: 9003,
  lastSenderName: "Tran Minh",
  lastMessagePreview:
    "Hoi thoai mau san sang de ban thu gui tin nhan.",
};

const REVIEW_DEMO_MESSAGES = [
  {
    messageId: "demo-1",
    senderUserId: 9002,
    content: "Chao mung ban den voi hoi thoai mau cua Hanaka Sport.",
    sentAt: "2026-04-07T09:00:00.000Z",
    sender: {
      userId: 9002,
      fullName: "Nguyen Anh",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    },
  },
  {
    messageId: "demo-2",
    senderUserId: REVIEW_DEMO_USER.userId,
    content:
      "Ban co the thu gui them tin nhan va xoa tin nhan trong hoi thoai nay.",
    sentAt: "2026-04-07T09:03:00.000Z",
    sender: {
      userId: REVIEW_DEMO_USER.userId,
      fullName: REVIEW_DEMO_USER.fullName,
      avatarUrl: REVIEW_DEMO_USER.avatarUrl,
    },
  },
  {
    messageId: "demo-3",
    senderUserId: 9003,
    content:
      "Khi tham gia CLB, cac cuoc tro chuyen se hien o day.",
    sentAt: "2026-04-07T09:05:00.000Z",
    sender: {
      userId: 9003,
      fullName: "Tran Minh",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80",
    },
  },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getReviewDemoCurrentUser() {
  return clone(REVIEW_DEMO_USER);
}

export function getReviewDemoChatRoom() {
  return clone(REVIEW_DEMO_CHAT_ROOM);
}

export function getReviewDemoMessages() {
  return clone(REVIEW_DEMO_MESSAGES);
}

export function getReviewDemoClubBundle() {
  return {
    club: clone(REVIEW_DEMO_CLUB),
    members: clone(REVIEW_DEMO_MEMBERS),
    pendingMembers: clone(REVIEW_DEMO_PENDING_MEMBERS),
  };
}
