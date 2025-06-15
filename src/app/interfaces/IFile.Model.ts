export type FileResource = {
  error: string | null;
  size: number;
  type: string;
  filename: string;
  state: string;
  mime: string;
  ext: string | null;
  url: string;
  updated_at: string;
  created_at: string;
  error_state: string | null;
  original_filename: string;
};
