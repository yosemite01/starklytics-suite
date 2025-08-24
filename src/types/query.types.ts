// Temporary type definitions until we have proper database types
interface SaveQueryParams {
    title: string;
    query_text: string;
    description?: string;
    is_public?: boolean;
}

interface QueryResult {
    id: string;
    created_at: string;
    results: any[];
    execution_time: string;
    row_count: number;
}

interface SavedQuery {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    description?: string;
    query_text: string;
    creator_id: string;
    metadata?: any;
    is_public: boolean;
    last_run_at?: string;
    favorite: boolean;
    results?: QueryResult[];
}

export type { SavedQuery, QueryResult, SaveQueryParams };
