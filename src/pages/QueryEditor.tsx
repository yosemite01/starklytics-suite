import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { QueryEditor as QueryEditorComponent } from "@/components/query/QueryEditor";

const QueryEditor = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header 
            title="Query Editor" 
            subtitle="Write and execute SQL queries on Starknet data"
          />
          
          <main className="p-6">
            <QueryEditorComponent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default QueryEditor;