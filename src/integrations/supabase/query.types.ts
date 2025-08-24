import { Database } from './database.types';

type Tables = Database['public']['Tables'];

export type QueriesRow = Tables['queries']['Row'];
export type QueriesInsert = Tables['queries']['Insert'];
export type QueriesUpdate = Tables['queries']['Update'];

export type QueryResultsRow = Tables['query_results']['Row'];
export type QueryResultsInsert = Tables['query_results']['Insert'];
export type QueryResultsUpdate = Tables['query_results']['Update'];

export interface SaveQueryParams extends Omit<QueriesInsert, 'creator_id'> {
    title: string;
    query_text: string;
    description?: string;
    is_public?: boolean;
}

export interface QueryResult {
    id: string;
    created_at: string;
    results: any[];
    execution_time: string;
    row_count: number;
}

export interface SavedQuery extends QueriesRow {
    results?: QueryResult[];
}
