import { PostData, CommentData, LikeData } from './post-cards';

export const POST_DETAIL_DATA: PostData = {
  id: 'post-detail-1',
  user: {
    id: 'user1',
    name: 'Emma Johnson',
    profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  content: `Just finished my morning workout! Feeling energized and ready to take on the day. There's nothing quite like starting your day with some physical activity to get your blood pumping and your mind sharp.

I've been following this new routine for the past month and I can already see the difference in my energy levels throughout the day. The key is consistency and finding activities that you actually enjoy doing.

Today's workout included:
- 30 minutes of cardio
- Weight training focusing on upper body
- 15 minutes of stretching and cool down

What's your favorite way to start the morning? I'd love to hear about your routines! 💪

#MorningWorkout #Fitness #HealthyLifestyle #Motivation`,
  images: [
    'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  likes: 156,
  comments: 23,
  isLiked: false,
  isBookmarked: true,
  createdAt: '2024-01-15T08:30:00Z',
  isOwner: true,
};

export const POST_DETAIL_COMMENTS: CommentData[] = [
  {
    id: 'comment1',
    user: {
      id: 'user6',
      name: 'David Miller',
      profilePicture: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    content: 'This looks absolutely amazing! I need to try this workout routine. Could you share more details about the weight training part?',
    createdAt: '2024-01-15T09:15:00Z',
    isOwner: false,
    reply: {
      id: 'reply1',
      user: {
        id: 'user1',
        name: 'Emma Johnson',
        profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      content: 'Thank you! I can share the routine with you if you\'re interested. I focus on compound movements like push-ups, pull-ups, and dumbbell exercises.',
      createdAt: '2024-01-15T09:30:00Z',
      isOwner: true,
    },
  },
  {
    id: 'comment2',
    user: {
      id: 'user7',
      name: 'Maria Garcia',
      profilePicture: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    content: 'So inspiring! Keep up the great work 💪 I\'ve been struggling to maintain consistency with my workouts.',
    createdAt: '2024-01-15T09:45:00Z',
    isOwner: false,
  },
  {
    id: 'comment3',
    user: {
      id: 'user8',
      name: 'John Smith',
      profilePicture: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    content: 'Great post! I love how you break down your routine. The stretching part is often overlooked but so important for recovery.',
    createdAt: '2024-01-15T10:20:00Z',
    isOwner: false,
    reply: {
      id: 'reply2',
      user: {
        id: 'user1',
        name: 'Emma Johnson',
        profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      content: 'Absolutely! Stretching is crucial for preventing injuries and improving flexibility. I used to skip it but now it\'s my favorite part.',
      createdAt: '2024-01-15T10:35:00Z',
      isOwner: true,
    },
  },
  {
    id: 'comment4',
    user: {
      id: 'user9',
      name: 'Anna Wilson',
      profilePicture: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    content: 'Your dedication is motivating! I\'ve been trying to establish a morning routine too. Any tips for staying consistent?',
    createdAt: '2024-01-15T11:10:00Z',
    isOwner: false,
  },
  {
    id: 'comment5',
    user: {
      id: 'user10',
      name: 'Michael Brown',
      profilePicture: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    content: 'Love the energy in this post! Morning workouts are the best way to start the day. What time do you usually wake up?',
    createdAt: '2024-01-15T11:45:00Z',
    isOwner: false,
  },
];

export const POST_DETAIL_LIKES: LikeData[] = [
  {
    id: 'like1',
    user: {
      id: 'user8',
      name: 'John Smith',
      profilePicture: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'like2',
    user: {
      id: 'user9',
      name: 'Anna Wilson',
      profilePicture: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    createdAt: '2024-01-15T08:45:00Z',
  },
  {
    id: 'like3',
    user: {
      id: 'user11',
      name: 'Sarah Davis',
      profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    createdAt: '2024-01-15T08:50:00Z',
  },
  {
    id: 'like4',
    user: {
      id: 'user12',
      name: 'Robert Johnson',
      profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    createdAt: '2024-01-15T09:10:00Z',
  },
  {
    id: 'like5',
    user: {
      id: 'user13',
      name: 'Lisa Anderson',
      profilePicture: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    createdAt: '2024-01-15T09:25:00Z',
  },
  {
    id: 'like6',
    user: {
      id: 'user14',
      name: 'James Wilson',
      profilePicture: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    createdAt: '2024-01-15T09:40:00Z',
  },
];