interface NotificationDatum {
  channel: string;
created_at: string;
description: string;
id: number;
status: string;
title: string;
type: string;
updated_at: string;
group:string[];
user_ids?: number[];
is_read?:number;
notification:any, 
}