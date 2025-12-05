interface PlanDatum {
  id?: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  features?: Feature[];
  pricings?: Pricing[];
  plan_id?:number
}

interface PlanData {
  data: PlanDatum[];
  total: number;
}

interface PlanDatumResponse extends Response {
  data: PlanDatum;
}


interface PlanResponse extends Response {
  data: PlanData;
}