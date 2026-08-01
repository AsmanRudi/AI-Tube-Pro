export interface Channel {
  id: number;
  name: string;
  youtubeChannelId?: string;
  description?: string;
  projectId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChannelRequest {
  name: string;
  youtubeChannelId?: string;
  description?: string;
}

