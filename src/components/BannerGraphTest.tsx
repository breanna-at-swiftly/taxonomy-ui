import React, { useEffect, useState } from "react";
import { taxonomyService } from "../services/taxonomyService";

const BannerGraphTest = () => {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    taxonomyService
      .fetchBannerGraphs({ graph_id: 100, graph_purpose_id: 3 })
      .then((data) => setResult(data))
      .catch((err) => setResult(err.response?.data || err.message));
  }, []);

  return (
    <div>
      <h2>Banner Graph Test</h2>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default BannerGraphTest;
