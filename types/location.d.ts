interface StateDatum {
  created_at: string;
  id: number;
  state_name: string;
  updated_at: string;
}

interface StateData {
  data: StateDatum[];
  total: number;
}

interface StateResponse extends Response {
  data: StateData;
}

interface LGADatum {
  id: 10;
  state_id: 1;
  local_government_area: string;
  created_at: string;
  updated_at: string;
  state: StateDatum;
}

interface LGAData {
  data: LGADatum[];
  total: number;
}

interface LGAResponse extends Response {
  data: LGAData;
}
