interface Response {
  statusCode: number;
  message: string;
  data: any;
}

interface Route {
  name: string;
  route: string;
  params: string;
  isRoot?: boolean;
}

interface RoutesPart {
  [x: string]: {
    route: string;
    name: string;
    params?: string;
  };
}

interface ContactUs {
  id: string,
  name: string,
  mobileNum:string,
  email: string,
  subject: string,
  message: string,
  reply: string,
  is_read: number,
  created_at: string,
  updated_at: string,
}