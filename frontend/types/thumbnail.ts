export interface ThumbnailResult {
  title: string;
  description: string;
  style: string;
  prompt: string;
  design_tips: string[];
}

export interface GenerateThumbnailRequest {
  title: string;
  keyword: string;
  style: string;
}
