import { Script } from "./script";
import { SeoResult } from "./seo";
import { Channel } from "./channel";
import { ThumbnailResult } from "./thumbnail";
import { VoiceoverResult } from "./voice";
import { SubtitleResult } from "./subtitle";

export type VideoStatus =
  | "DRAFT"
  | "SCRIPT_GENERATED"
  | "SEO_GENERATED"
  | "THUMBNAIL_READY"
  | "VOICEOVER_READY"
  | "SUBTITLE_READY"
  | "READY_TO_UPLOAD"
  | "PUBLISHED"
  | "FAILED";

export interface ProductionVideo {
  id: number;
  title: string;
  status: VideoStatus;
  duration?: number;
  youtubeId?: string;
  thumbnail?: string;
  keyword?: string;
  language?: string;
  durationText?: string;
  thumbnailConcept?: ThumbnailResult;
  voiceover?: VoiceoverResult;
  subtitle?: SubtitleResult;
  publishStatus: string;
  readyAt?: string;
  publishedAt?: string;
  projectId: number;
  scriptId?: number;
  seoResultId?: number;
  channelId?: number;
  script?: Script;
  seoResult?: SeoResult;
  channel?: Channel;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoRequest {
  projectId: number;
  title: string;
  keyword?: string;
  language?: string;
  durationText?: string;
}

