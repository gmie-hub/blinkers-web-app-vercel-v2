interface CmsDatum {
  slug: string;
  title: number;
  description: string;
  created_at: string
  id:number;
}

interface CmsResponse extends Response {
  data: CmsData;
}

interface CmsData {
  data: CmsDatum[];
  total: number;
}