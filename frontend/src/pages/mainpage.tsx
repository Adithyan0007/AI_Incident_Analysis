import { useEffect, useState } from "react";
import { api } from "../utils/api";

type Incident = {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  createdAt: string;
};

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );
  const [streamSteps, setStreamSteps] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const loadIncidents = async () => {
    const data = await api.get("/incident", token);
    setIncidents(data);
  };

  const investigateStream = async (incidentId: string) => {
    if (!token) return;

    setLoading(true);
    setReport(null);
    setStreamSteps([]);

    const response = await fetch("http://localhost:4000/investigate/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ incidentId }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      setLoading(false);
      return;
    }

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        if (!event.startsWith("data:")) continue;

        const json = event.replace("data:", "").trim();
        const parsed = JSON.parse(json);

        setStreamSteps((prev) => [...prev, parsed]);

        if (parsed.step === "complete") {
          setReport(parsed.data);
        }
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">AI DevOps Incident Copilot</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Incidents</h2>

          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="bg-slate-800 p-4 rounded-lg border border-slate-700"
              >
                <h3 className="font-semibold">{incident.title}</h3>

                <p className="text-sm text-slate-300 mt-1">
                  {incident.description}
                </p>

                <div className="flex gap-3 mt-3 text-sm">
                  <span className="bg-red-600 px-2 py-1 rounded">
                    {incident.severity}
                  </span>
                  <span className="bg-blue-600 px-2 py-1 rounded">
                    {incident.status}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedIncident(incident);
                    investigateStream(incident.id);
                  }}
                  className="mt-4 bg-green-600 px-4 py-2 rounded font-medium"
                >
                  Investigate with AI
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">AI Investigation</h2>

          {!selectedIncident && (
            <p className="text-slate-400">
              Select an incident to start investigation.
            </p>
          )}

          {selectedIncident && (
            <div className="bg-slate-800 p-4 rounded mb-4">
              <h3 className="font-semibold mb-1">Selected Incident</h3>
              <p className="text-sm text-slate-300">{selectedIncident.title}</p>
            </div>
          )}

          {loading && (
            <p className="text-yellow-400 mb-4">AI investigation running...</p>
          )}

          {streamSteps.length > 0 && (
            <div className="bg-slate-800 p-4 rounded mb-4">
              <h3 className="font-semibold mb-3">Live Investigation Steps</h3>

              <div className="space-y-2">
                {streamSteps.map((step, index) => (
                  <div key={index} className="text-sm text-slate-300">
                    <span className="text-green-400">●</span>{" "}
                    <span className="font-medium">{step.step}</span>
                    {step.status && (
                      <span className="text-slate-400"> ({step.status})</span>
                    )}
                    {step.message && <> — {step.message}</>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {report && (
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded">
                <h3 className="font-semibold mb-2">Agent Run ID</h3>
                <p className="text-sm text-slate-300">{report.agentRunId}</p>
              </div>

              <div className="bg-slate-800 p-4 rounded">
                <h3 className="font-semibold mb-2">AI RCA Report</h3>
                <pre className="whitespace-pre-wrap text-sm text-slate-200">
                  {report.aiReport}
                </pre>
              </div>

              <div className="bg-slate-800 p-4 rounded">
                <h3 className="font-semibold mb-2">Findings</h3>

                <ul className="list-disc pl-5 text-sm text-slate-300">
                  {report.structuredInvestigation?.findings?.map(
                    (finding: string, index: number) => (
                      <li key={index}>{finding}</li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
