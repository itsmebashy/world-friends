export interface PostData {
  id: string;
  user: {
    id: string;
    name: string;
    profilePicture: string;
  };
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  isOwner: boolean;
}

export interface CommentData {
  id: string;
  user: {
    id: string;
    name: string;
    profilePicture: string;
  };
  content: string;
  createdAt: string;
  isOwner: boolean;
  reply?: {
    id: string;
    user: {
      id: string;
      name: string;
      profilePicture: string;
    };
    content: string;
    createdAt: string;
    isOwner: boolean;
  };
}

export interface LikeData {
  id: string;
  user: {
    id: string;
    name: string;
    profilePicture: string;
  };
  createdAt: string;
}

export const DUMMY_POSTS: PostData[] = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Emma Johnson",
      profilePicture:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Just finished my morning workout! Feeling energized and ready to take on the day. There's nothing quite like starting your day with some physical activity to get your blood pumping and your mind sharp.",
    images: [
      "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 24,
    comments: 8,
    isLiked: false,
    isBookmarked: true,
    createdAt: "2024-01-15T08:30:00Z",
    isOwner: false,
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Alex Chen",
      profilePicture:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Exploring the beautiful streets of Tokyo today! The culture here is absolutely fascinating.",
    images: [
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 156,
    comments: 23,
    isLiked: true,
    isBookmarked: false,
    createdAt: "2024-01-15T06:15:00Z",
    isOwner: false,
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Sarah Williams",
      profilePicture:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Learning Spanish has been such an amazing journey! ¡Hola amigos! 🇪🇸",
    likes: 89,
    comments: 12,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2024-01-15T04:45:00Z",
    isOwner: true,
  },
  {
    id: "4",
    user: {
      id: "user4",
      name: "Mohammed Hassan",
      profilePicture:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Sunset from my balcony tonight. Sometimes the simple moments are the most beautiful ones.",
    images: [
      "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 203,
    comments: 31,
    isLiked: true,
    isBookmarked: true,
    createdAt: "2024-01-14T19:20:00Z",
    isOwner: false,
  },
  {
    id: "5",
    user: {
      id: "user5",
      name: "Lisa Park",
      profilePicture:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Cooking traditional Korean dishes with my grandmother today. Family recipes are the best! 👵🏻🍜",
    images: [
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 67,
    comments: 15,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2024-01-14T16:30:00Z",
    isOwner: false,
  },
  {
    id: "6",
    user: {
      id: "user6",
      name: "David Miller",
      profilePicture:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Just finished my morning workout! Feeling energized and ready to take on the day. There's nothing quite like starting your day with some physical activity to get your blood pumping and your mind sharp.",
    images: [
      "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 156,
    comments: 23,
    isLiked: true,
    isBookmarked: false,
    createdAt: "2024-01-14T14:30:00Z",
    isOwner: false,
  },
  {
    id: "7",
    user: {
      id: "user7",
      name: "Maria Garcia",
      profilePicture:
        "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Just finished my morning workout! Feeling energized and ready to take on the day. There's nothing quite like starting your day with some physical activity to get your blood pumping and your mind sharp.",
    images: [
      "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 156,
    comments: 23,
    isLiked: true,
    isBookmarked: false,
    createdAt: "2024-01-14T14:30:00Z",
    isOwner: false,
  },
  {
    id: "8",
    user: {
      id: "user8",
      name: "John Smith",
      profilePicture:
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Just finished my morning workout! Feeling energized and ready to take on the day. There's nothing quite like starting your day with some physical activity to get your blood pumping and your mind sharp.",
    images: [
      "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 156,
    comments: 23,
    isLiked: true,
    isBookmarked: false,
    createdAt: "2024-01-14T14:30:00Z",
    isOwner: false,
  },
  {
    id: "9",
    user: {
      id: "user9",
      name: "Anna Wilson",
      profilePicture:
        "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Just finished my morning workout! Feeling energized and ready to take on the day. There's nothing quite like starting your day with some physical activity to get your blood pumping and your mind sharp.",
    images: [
      "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 156,
    comments: 23,
    isLiked: true,
    isBookmarked: false,
    createdAt: "2024-01-14T14:30:00Z",
    isOwner: false,
  },
  {
    id: "10",
    user: {
      id: "user10",
      name: "Michael Brown",
      profilePicture:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Just finished my morning workout! Feeling energized and ready to take on the day. There's nothing quite like starting your day with some physical activity to get your blood pumping and your mind sharp.",
    images: [
      "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 156,
    comments: 23,
    isLiked: true,
    isBookmarked: false,
    createdAt: "2024-01-14T14:30:00Z",
    isOwner: false,
  },
  {
    id: "11",
    user: {
      id: "user11",
      name: "Sarah Davis",
      profilePicture:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Just finished my morning workout! Feeling energized and ready to take on the day. There's nothing quite like starting your day with some physical activity to get your blood pumping and your mind sharp.",
    images: [
      "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 156,
    comments: 23,
    isLiked: true,
    isBookmarked: false,
    createdAt: "2024-01-14T14:30:00Z",
    isOwner: false,
  },
  {
    id: "12",
    user: {
      id: "user12",
      name: "Robert Johnson",
      profilePicture:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Just finished my morning workout! Feeling energized and ready to take on the day. There's nothing quite like starting your day with some physical activity to get your blood pumping and your mind sharp.",
    images: [
      "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    likes: 156,
    comments: 23,
    isLiked: true,
    isBookmarked: false,
    createdAt: "2024-01-14T14:30:00Z",
    isOwner: false,
  },
];

export const DUMMY_COMMENTS: CommentData[] = [
  {
    id: "comment1",
    user: {
      id: "user6",
      name: "David Miller",
      profilePicture:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "This looks absolutely amazing! I need to try this workout routine. This looks absolutely amazing! I need to try this workout routine.",
    createdAt: "2024-01-15T09:15:00Z",
    isOwner: false,
  },
  {
    id: "comment2",
    user: {
      id: "user7",
      name: "Sarah Wilson",
      profilePicture:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Love the energy in this post! Keep inspiring us 💪",
    createdAt: "2024-01-15T10:20:00Z",
    isOwner: false,
  },
  {
    id: "comment3",
    user: {
      id: "user8",
      name: "Michael Chen",
      profilePicture:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content:
      "Great motivation! Started my fitness journey because of posts like this.",
    createdAt: "2024-01-15T11:45:00Z",
    isOwner: false,
  },
  {
    id: "comment4",
    user: {
      id: "user1",
      name: "Emma Johnson",
      profilePicture:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Thank you all for the amazing support! 🙏",
    createdAt: "2024-01-15T12:30:00Z",
    isOwner: true,
  },
  {
    id: "comment5",
    user: {
      id: "user9",
      name: "Jessica Brown",
      profilePicture:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "This is exactly what I needed to see today! 🔥",
    createdAt: "2024-01-15T13:15:00Z",
    isOwner: false,
  },
  {
    id: "comment6",
    user: {
      id: "user10",
      name: "Alex Rodriguez",
      profilePicture:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Amazing transformation! How long did this take?",
    createdAt: "2024-01-15T14:00:00Z",
    isOwner: false,
  },
  {
    id: "comment7",
    user: {
      id: "user11",
      name: "Lisa Thompson",
      profilePicture:
        "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Goals! 💯 Keep pushing forward!",
    createdAt: "2024-01-15T14:30:00Z",
    isOwner: false,
  },
  {
    id: "comment8",
    user: {
      id: "user12",
      name: "Ryan Davis",
      profilePicture:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Incredible dedication! What's your secret?",
    createdAt: "2024-01-15T15:00:00Z",
    isOwner: false,
  },
  {
    id: "comment9",
    user: {
      id: "user13",
      name: "Maria Garcia",
      profilePicture:
        "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "You're such an inspiration! Thank you for sharing ✨",
    createdAt: "2024-01-15T15:45:00Z",
    isOwner: false,
  },
  {
    id: "comment10",
    user: {
      id: "user14",
      name: "James Wilson",
      profilePicture:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "This motivates me to start my own journey!",
    createdAt: "2024-01-15T16:20:00Z",
    isOwner: false,
  },
  {
    id: "comment11",
    user: {
      id: "user15",
      name: "Sophie Martin",
      profilePicture:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Absolutely stunning! You're glowing ✨",
    createdAt: "2024-01-15T17:00:00Z",
    isOwner: false,
  },
  {
    id: "comment12",
    user: {
      id: "user16",
      name: "Carlos Mendez",
      profilePicture:
        "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "What an incredible journey! Respect 🙌",
    createdAt: "2024-01-15T17:30:00Z",
    isOwner: false,
  },
  {
    id: "comment13",
    user: {
      id: "user17",
      name: "Emma Davis",
      profilePicture:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "You make it look so easy! Any tips for beginners?",
    createdAt: "2024-01-15T18:00:00Z",
    isOwner: false,
  },
  {
    id: "comment14",
    user: {
      id: "user18",
      name: "Kevin Lee",
      profilePicture:
        "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "This is the motivation I needed today! 💪",
    createdAt: "2024-01-15T18:45:00Z",
    isOwner: false,
  },
  {
    id: "comment15",
    user: {
      id: "user19",
      name: "Rachel Green",
      profilePicture:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Amazing progress! How do you stay so consistent?",
    createdAt: "2024-01-15T19:15:00Z",
    isOwner: false,
  },
  {
    id: "comment16",
    user: {
      id: "user20",
      name: "Tom Anderson",
      profilePicture:
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Incredible transformation! You're an inspiration 🔥",
    createdAt: "2024-01-15T19:45:00Z",
    isOwner: false,
  },
  {
    id: "comment17",
    user: {
      id: "user21",
      name: "Nina Patel",
      profilePicture:
        "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Goals! Can't wait to start my own fitness journey 💪",
    createdAt: "2024-01-15T20:00:00Z",
    isOwner: false,
  },
  {
    id: "comment18",
    user: {
      id: "user22",
      name: "Mark Johnson",
      profilePicture:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "This is what dedication looks like! Amazing work ✨",
    createdAt: "2024-01-15T20:30:00Z",
    isOwner: false,
  },
  {
    id: "comment19",
    user: {
      id: "user23",
      name: "Olivia Smith",
      profilePicture:
        "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "You're absolutely glowing! Keep it up! 🌟",
    createdAt: "2024-01-15T21:00:00Z",
    isOwner: false,
  },
  {
    id: "comment20",
    user: {
      id: "user24",
      name: "Daniel Kim",
      profilePicture:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Such an inspiration! What's your workout routine?",
    createdAt: "2024-01-15T21:30:00Z",
    isOwner: false,
  },
  {
    id: "comment21",
    user: {
      id: "user25",
      name: "Grace Wilson",
      profilePicture:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Amazing! You make it look so effortless 💫",
    createdAt: "2024-01-15T22:00:00Z",
    isOwner: false,
  },
  {
    id: "comment22",
    user: {
      id: "user26",
      name: "Jake Miller",
      profilePicture:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "This is the motivation I needed! Thank you 🙏",
    createdAt: "2024-01-15T22:30:00Z",
    isOwner: false,
  },
  {
    id: "comment23",
    user: {
      id: "user27",
      name: "Zoe Chen",
      profilePicture:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Absolutely incredible! You're my fitness inspiration 💪",
    createdAt: "2024-01-15T23:00:00Z",
    isOwner: false,
  },
  {
    id: "comment24",
    user: {
      id: "user28",
      name: "Ryan Thompson",
      profilePicture:
        "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "What an amazing journey! Keep inspiring us all ✨",
    createdAt: "2024-01-15T23:30:00Z",
    isOwner: false,
  },
  {
    id: "comment25",
    user: {
      id: "user29",
      name: "Lily Rodriguez",
      profilePicture:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Goals achieved! You're absolutely amazing 🔥",
    createdAt: "2024-01-16T00:00:00Z",
    isOwner: false,
  },
  {
    id: "comment26",
    user: {
      id: "user30",
      name: "Ben Carter",
      profilePicture:
        "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "This post just made my day! Thank you for sharing 🌟",
    createdAt: "2024-01-16T00:30:00Z",
    isOwner: false,
  },
  {
    id: "comment27",
    user: {
      id: "user31",
      name: "Mia Johnson",
      profilePicture:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Absolutely stunning! You're glowing with confidence ✨",
    createdAt: "2024-01-16T01:00:00Z",
    isOwner: false,
  },
  {
    id: "comment28",
    user: {
      id: "user32",
      name: "Chris Lee",
      profilePicture:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "What an incredible journey! Keep inspiring us 💪",
    createdAt: "2024-01-16T01:30:00Z",
    isOwner: false,
  },
  {
    id: "comment29",
    user: {
      id: "user33",
      name: "Ava Martinez",
      profilePicture:
        "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "This is exactly the motivation I needed today! 🔥",
    createdAt: "2024-01-16T02:00:00Z",
    isOwner: false,
  },
  {
    id: "comment30",
    user: {
      id: "user34",
      name: "Noah Davis",
      profilePicture:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Amazing transformation! You're an absolute inspiration 🙌",
    createdAt: "2024-01-16T02:30:00Z",
    isOwner: false,
  },
  {
    id: "comment31",
    user: {
      id: "user35",
      name: "Isabella Brown",
      profilePicture:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "You're absolutely glowing! Keep shining ✨",
    createdAt: "2024-01-16T03:00:00Z",
    isOwner: false,
  },
  {
    id: "comment32",
    user: {
      id: "user36",
      name: "Ethan Wilson",
      profilePicture:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "This is the inspiration I needed! Thank you 🙏",
    createdAt: "2024-01-16T03:30:00Z",
    isOwner: false,
  },
  {
    id: "comment33",
    user: {
      id: "user37",
      name: "Charlotte Garcia",
      profilePicture:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Goals! You make it look so effortless 💪",
    createdAt: "2024-01-16T04:00:00Z",
    isOwner: false,
  },
  {
    id: "comment34",
    user: {
      id: "user38",
      name: "Mason Taylor",
      profilePicture:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Incredible dedication! You're my fitness inspiration 🔥",
    createdAt: "2024-01-16T04:30:00Z",
    isOwner: false,
  },
  {
    id: "comment35",
    user: {
      id: "user39",
      name: "Harper Anderson",
      profilePicture:
        "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Amazing work! You're absolutely inspiring 🌟",
    createdAt: "2024-01-16T05:00:00Z",
    isOwner: false,
  },
  {
    id: "comment36",
    user: {
      id: "user40",
      name: "Logan Martinez",
      profilePicture:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "This transformation is incredible! Keep it up 💪",
    createdAt: "2024-01-16T05:30:00Z",
    isOwner: false,
  },
  {
    id: "comment37",
    user: {
      id: "user41",
      name: "Amelia Clark",
      profilePicture:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "You're absolutely glowing! Such an inspiration ✨",
    createdAt: "2024-01-16T06:00:00Z",
    isOwner: false,
  },
  {
    id: "comment38",
    user: {
      id: "user42",
      name: "Lucas Rodriguez",
      profilePicture:
        "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Goals achieved! You make it look so easy 🔥",
    createdAt: "2024-01-16T06:30:00Z",
    isOwner: false,
  },
  {
    id: "comment39",
    user: {
      id: "user43",
      name: "Evelyn Lewis",
      profilePicture:
        "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "This is exactly what I needed to see today! 🙌",
    createdAt: "2024-01-16T07:00:00Z",
    isOwner: false,
  },
  {
    id: "comment40",
    user: {
      id: "user44",
      name: "Alexander Walker",
      profilePicture:
        "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    content: "Absolutely amazing! You're my fitness inspiration 💯",
    createdAt: "2024-01-16T07:30:00Z",
    isOwner: false,
  },
];

export const DUMMY_LIKES: LikeData[] = [
  {
    id: "like1",
    user: {
      id: "user8",
      name: "John Smith",
      profilePicture:
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "like2",
    user: {
      id: "user9",
      name: "Anna Wilson",
      profilePicture:
        "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    createdAt: "2024-01-15T08:45:00Z",
  },
  {
    id: "like3",
    user: {
      id: "user10",
      name: "Michael Chen",
      profilePicture:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    createdAt: "2024-01-15T08:30:00Z",
  },
  {
    id: "like4",
    user: {
      id: "user11",
      name: "Sarah Johnson",
      profilePicture:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    createdAt: "2024-01-15T08:15:00Z",
  },
  {
    id: "like5",
    user: {
      id: "user12",
      name: "David Miller",
      profilePicture:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "like6",
    user: {
      id: "user13",
      name: "Emma Davis",
      profilePicture:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    createdAt: "2024-01-15T07:45:00Z",
  },
  {
    id: "like7",
    user: {
      id: "user14",
      name: "James Wilson",
      profilePicture:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    createdAt: "2024-01-15T07:30:00Z",
  },
  {
    id: "like8",
    user: {
      id: "user15",
      name: "Lisa Brown",
      profilePicture:
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    createdAt: "2024-01-15T07:15:00Z",
  },
  {
    id: "like9",
    user: {
      id: "user16",
      name: "Ryan Garcia",
      profilePicture:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    createdAt: "2024-01-15T07:00:00Z",
  },
  {
    id: "like10",
    user: {
      id: "user17",
      name: "Sophie Martinez",
      profilePicture:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    createdAt: "2024-01-15T06:45:00Z",
  },
];
