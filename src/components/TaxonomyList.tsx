import { useEffect, useState } from 'react';
import type { TaxonomyGraph } from '../types/taxonomy';
import { fetchTaxonomyGraphs } from '../services/taxonomyService';

const TaxonomyList: React.FC = () => {
    const [graphs, setGraphs] = useState<TaxonomyGraph[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadGraphs = async () => {
            const result = await fetchTaxonomyGraphs();
            if (result.error) {
                setError(result.error);
            } else {
                setGraphs(result.data);
            }
            setIsLoading(false);
        };

        loadGraphs();
    }, []);

    if (isLoading) {
        return <div className="p-4">Loading taxonomy graphs...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Taxonomy Graphs</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                    {graphs.length === 0 ? (
                        <div className="p-4 text-gray-500">No taxonomy graphs found</div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {graphs.map((graph) => (
                                <li key={graph.graph_id} className="hover:bg-gray-50">
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {graph.name}
                                        </h2>
                                        {graph.notes && (
                                            <p className="mt-1 text-gray-600">{graph.notes}</p>
                                        )}
                                        <div className="mt-2 text-sm text-gray-500">
                                            <span>ID: {graph.graph_id}</span>
                                            <span className="mx-2">•</span>
                                            <span>Updated: {new Date(graph.updated_datetime).toLocaleString()}</span>
                                            <span className="mx-2">•</span>
                                            <span>By: {graph.updated_by}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaxonomyList;
