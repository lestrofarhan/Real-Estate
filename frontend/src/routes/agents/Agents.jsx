import "./agents.scss";
import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";

export default function Agents() {
  const [agents, setAgents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiRequest
      .get("/users")
      .then((res) => {
        if (!mounted) return;
        setAgents(res.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div className="agentsPage">
      <div className="wrapper">
        <h1>Agents</h1>
        {loading && <p>Loading...</p>}
        {!loading && (!agents || agents.length === 0) && <p>No agents found.</p>}
        <div className="list">
          {agents?.map((a) => (
            <div className="agent" key={a.id}>
              <img src={a.avatar || "/noavatar.jpg"} alt="" />
              <div>
                <div className="name">{a.username}</div>
                <div className="email">{a.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
