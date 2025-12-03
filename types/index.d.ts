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