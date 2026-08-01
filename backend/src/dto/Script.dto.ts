export interface CreateScriptDto {

    projectId: number;

    keyword: string;

    language: string;

    duration: string;

}

export interface ScriptResponseDto {
  title: string;
  outline: string[];
  script: string;
  description: string;
  tags: string[];
}