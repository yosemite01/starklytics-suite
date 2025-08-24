import { Database } from './database.types';

type Tables = Database['public']['Tables'];

export type DashboardsRow = Tables['dashboards']['Row'];
export type DashboardsInsert = Tables['dashboards']['Insert'];
export type DashboardsUpdate = Tables['dashboards']['Update'];
