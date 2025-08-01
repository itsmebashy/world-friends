export interface ConversationData {
  id: string;
  user: {
    id: string;
    name: string;
    profilePicture: string;
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    isOwner: boolean;
  };
  hasUnreadMessages: boolean;
  updatedAt: string; // Last activity timestamp for sorting
}

export const DUMMY_CONVERSATIONS: ConversationData[] = [
  {
    id: 'conv-1',
    user: {
      id: 'user1',
      name: 'Emma Johnson',
      profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-1',
      content: 'Hey! How was your workout today? I saw your post and it looked amazing!',
      createdAt: '2024-01-15T14:30:00Z',
      isOwner: false,
    },
    hasUnreadMessages: true,
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'conv-2',
    user: {
      id: 'user2',
      name: 'Kenji Tanaka',
      profilePicture: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-2',
      content: 'Thanks for the language exchange session! See you next week 😊',
      createdAt: '2024-01-15T12:15:00Z',
      isOwner: true,
    },
    hasUnreadMessages: false,
    updatedAt: '2024-01-15T12:15:00Z',
  },
  {
    id: 'conv-3',
    user: {
      id: 'user3',
      name: 'Sophia Müller',
      profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-3',
      content: 'The German lesson was really helpful! Can we practice more tomorrow?',
      createdAt: '2024-01-15T10:45:00Z',
      isOwner: false,
    },
    hasUnreadMessages: true,
    updatedAt: '2024-01-15T10:45:00Z',
  },
  {
    id: 'conv-4',
    user: {
      id: 'user4',
      name: 'Carlos Rodriguez',
      profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-4',
      content: '¡Hola! ¿Cómo estás? I hope you are doing well my friend',
      createdAt: '2024-01-15T09:20:00Z',
      isOwner: false,
    },
    hasUnreadMessages: false,
    updatedAt: '2024-01-15T09:20:00Z',
  },
  {
    id: 'conv-5',
    user: {
      id: 'user5',
      name: 'Marie Dubois',
      profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-5',
      content: 'Bonjour! Would you like to practice French conversation this weekend?',
      createdAt: '2024-01-15T08:30:00Z',
      isOwner: false,
    },
    hasUnreadMessages: true,
    updatedAt: '2024-01-15T08:30:00Z',
  },
  {
    id: 'conv-6',
    user: {
      id: 'user6',
      name: 'David Miller',
      profilePicture: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-6',
      content: 'Great meeting you at the language exchange event!',
      createdAt: '2024-01-14T19:45:00Z',
      isOwner: true,
    },
    hasUnreadMessages: false,
    updatedAt: '2024-01-14T19:45:00Z',
  },
  {
    id: 'conv-7',
    user: {
      id: 'user7',
      name: 'Yuki Sato',
      profilePicture: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-7',
      content: 'こんにちは！Japanese lesson was fun today. Thank you!',
      createdAt: '2024-01-14T16:20:00Z',
      isOwner: false,
    },
    hasUnreadMessages: false,
    updatedAt: '2024-01-14T16:20:00Z',
  },
  {
    id: 'conv-8',
    user: {
      id: 'user8',
      name: 'Ana Silva',
      profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-8',
      content: 'Olá! How is your Portuguese learning going? Let me know if you need help!',
      createdAt: '2024-01-14T14:10:00Z',
      isOwner: false,
    },
    hasUnreadMessages: true,
    updatedAt: '2024-01-14T14:10:00Z',
  },
  {
    id: 'conv-9',
    user: {
      id: 'user9',
      name: 'Ahmed Hassan',
      profilePicture: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-9',
      content: 'السلام عليكم! The Arabic lesson was very helpful. Shukran!',
      createdAt: '2024-01-14T11:30:00Z',
      isOwner: false,
    },
    hasUnreadMessages: false,
    updatedAt: '2024-01-14T11:30:00Z',
  },
  {
    id: 'conv-10',
    user: {
      id: 'user10',
      name: 'Lisa Chen',
      profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-10',
      content: '你好！Chinese practice session was great. See you next time!',
      createdAt: '2024-01-14T09:15:00Z',
      isOwner: true,
    },
    hasUnreadMessages: false,
    updatedAt: '2024-01-14T09:15:00Z',
  },
  {
    id: 'conv-11',
    user: {
      id: 'user11',
      name: 'Marco Rossi',
      profilePicture: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-11',
      content: 'Ciao! Italian conversation practice was molto bene! Grazie!',
      createdAt: '2024-01-13T18:45:00Z',
      isOwner: false,
    },
    hasUnreadMessages: false,
    updatedAt: '2024-01-13T18:45:00Z',
  },
  {
    id: 'conv-12',
    user: {
      id: 'user12',
      name: 'Elena Petrov',
      profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    lastMessage: {
      id: 'msg-12',
      content: 'Привет! Russian lesson was challenging but fun. До свидания!',
      createdAt: '2024-01-13T15:20:00Z',
      isOwner: false,
    },
    hasUnreadMessages: true,
    updatedAt: '2024-01-13T15:20:00Z',
  },
];
