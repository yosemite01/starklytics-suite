import { supabase } from './client';
import type { Database } from './database.types';
interface VisualizationConfig {
    type: 'bar' | 'line' | 'pie' | 'area';
    xAxis?: string;
    yAxis?: string;
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

type VisualizationConfig = {
    type: 'bar' | 'line' | 'pie' | 'area';
    xAxis?: string;
    yAxis?: string;
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
};

type SaveQueryParams = Partial<Database['public']['Tables']['queries']['Insert']> & {
    metadata?: {
        visualization?: VisualizationConfig;
        [key: string]: any;
    };
};

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
import type { RealtimeChannel } from '@supabase/supabase-js';

export class QueryService {
    private subscriptions: Map<string, RealtimeChannel> = new Map();

    async saveQuery(params: SaveQueryParams): Promise<Database['public']['Tables']['queries']['Row'] | null> {
        const user = await this.getCurrentUser();
        if (!user) return null;

        const insertData: Database['public']['Tables']['queries']['Insert'] = {
            ...params,
            creator_id: user.id,
            title: params.title || 'Untitled Query',
            query_text: params.query_text || '',
        };

        const { data, error } = await supabase
            .from('queries')
            .upsert(insertData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateQuery(id: string, params: Partial<Database['public']['Tables']['queries']['Update']>): Promise<Database['public']['Tables']['queries']['Row'] | null> {
        const { data, error } = await supabase
            .from('queries')
            .update(params)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getQueries(): Promise<SavedQuery[]> {
        const { data, error } = await supabase
            .from('queries')
            .select(`
                *,
                query_results (*)
            `)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async runQuery(queryId: string, queryText: string): Promise<QueryResult | null> {
        // Here you would typically send the query to your query execution service
        // For now, we'll just store a mock result
        const mockResults = [
            { block_number: 1000, timestamp: new Date().toISOString() }
        ];

        const { data, error } = await supabase
            .from('query_results')
            .insert({
                query_id: queryId,
                results: mockResults,
                execution_time: '1 second',
                row_count: mockResults.length
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    subscribeToQueryResults(queryId: string, callback: (result: QueryResult) => void): () => void {
        const channel = supabase
            .channel(`query-${queryId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'query_results',
                    filter: `query_id=eq.${queryId}`
                },
                (payload) => {
                    callback(payload.new as QueryResult);
                }
            )
            .subscribe();

        this.subscriptions.set(queryId, channel);

        return () => {
            channel.unsubscribe();
            this.subscriptions.delete(queryId);
        };
    }

    private async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    }

    async deleteQuery(id: string): Promise<void> {
        const { error } = await supabase
            .from('queries')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async toggleFavorite(id: string, favorite: boolean): Promise<SavedQuery | null> {
        const { data, error } = await supabase
            .from('queries')
            .update({ favorite })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}
