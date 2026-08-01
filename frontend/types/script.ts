export interface Script {
  id: number;
  title: string;
  content: string;
  description: string;
  outline: string[];
  tags: string[];
  keyword: string;
  language: string;
  duration: string;
  createdAt: string;
  projectId: number;
}

export interface GenerateScriptRequest {
  projectId: number;
  keyword: string;
  language: string;
  duration: string;
}
