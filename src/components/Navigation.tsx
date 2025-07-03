import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav>
      <Link
        to={{
          pathname: "/editor",
          search: location.search, // This preserves URL parameters
        }}
      >
        Editor
      </Link>
      <Link
        to={{
          pathname: "/graphs",
          search: location.search,
        }}
      >
        Graphs
      </Link>
    </nav>
  );
};
