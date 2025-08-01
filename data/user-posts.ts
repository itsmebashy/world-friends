import { PostData } from './post-cards';

export const USER_POSTS_DATA: PostData[] = [

  {
    id: 'user-post-1',
    user: {
      id: 'user1',
      name: 'Emma Johnson',
      profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    content: 'Just finished my morning workout! Feeling energized and ready to take on the day. There\'s nothing quite like starting your day with some physical activity to get your blood pumping and your mind sharp.',
    images: [
      'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    likes: 24,
    comments: 8,
    isLiked: false,
    isBookmarked: true,
    createdAt: '2024-01-15T08:30:00Z',
    isOwner: false,
  },
  {
    id: 'user-post-2',
    user: {
      id: 'user1',
      name: 'Emma Johnson',
      profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    content: 'Trying out a new recipe today! Homemade pasta with fresh herbs from my garden. Cooking has become such a therapeutic activity for me.',
    images: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    likes: 67,
    comments: 15,
    isLiked: true,
    isBookmarked: false,
    createdAt: '2024-01-14T16:30:00Z',
    isOwner: false,
  },
  {
    id: 'user-post-3',
    user: {
      id: 'user1',
      name: 'Emma Johnson',
      profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    content: 'Beautiful sunset from my balcony tonight. Sometimes the simple moments are the most beautiful ones. Grateful for these peaceful evenings.',
    images: [
      'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    likes: 203,
    comments: 31,
    isLiked: true,
    isBookmarked: true,
    createdAt: '2024-01-13T19:20:00Z',
    isOwner: false,
  },
  {
    id: 'user-post-4',
    user: {
      id: 'user1',
      name: 'Emma Johnson',
      profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    content: 'Weekend hiking adventure! Discovered this amazing trail with the most incredible views. Nature always has a way of putting things into perspective.',
    images: [
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    likes: 89,
    comments: 12,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-01-12T14:45:00Z',
    isOwner: false,
  },
  {
    id: 'user-post-5',
    user: {
      id: 'user1',
      name: 'Emma Johnson',
      profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    content: 'Reading corner setup complete! Finally organized my book collection and created this cozy reading nook. Can\'t wait to dive into my next adventure.',
    likes: 45,
    comments: 7,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-01-11T20:15:00Z',
    isOwner: false,
  },
];

export const getUserName = (userId: string): string => {
  // In a real app, this would fetch from your user database
  const userNames: { [key: string]: string } = {
    'user1': 'Emma Johnson',
    'user2': 'Alex Chen',
    'user3': 'Sarah Williams',
    // Add more users as needed
  };
  
  return userNames[userId] || 'Unknown User';
};