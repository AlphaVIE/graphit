"use client";
import React, { useState } from "react";
import GraphVisualization from "../components/GraphVisualization";

type NodeGroup = {
  degree: number;
  count: number;
};

type Restriction = {
  fromDegree: number;
  toDegree: number;
  allowed: boolean;
};

const GraphInputPage: React.FC = () => {
  const [nodeGroups, setNodeGroups] = useState<NodeGroup[]>([
    { degree: 0, count: 0 },
  ]);
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddNodeGroup = () => {
    setNodeGroups([...nodeGroups, { degree: 0, count: 0 }]);
  };

  const handleNodeGroupChange = (
    index: number,
    field: keyof NodeGroup,
    value: string
  ) => {
    const updated: NodeGroup[] = [...nodeGroups];
    updated[index][field] = parseInt(value) || 0;
    setNodeGroups(updated);
  };

  const handleAddRestriction = () => {
    setRestrictions([
      ...restrictions,
      { fromDegree: 0, toDegree: 0, allowed: false },
    ]);
  };

  const handleRestrictionChange = (
    index: number,
    field: keyof Restriction,
    value: string | boolean
  ) => {
    const updated = [...restrictions];
    if (field === "allowed" && typeof value === "boolean") {
      updated[index][field] = value;
    } else if (typeof value === "string") {
      updated[index][field] = parseInt(value) || 0;
    }
    setRestrictions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodeGroups, restrictions }),
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.error || "Serverfehler");
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Graph Eingabe</h1>
        <form onSubmit={handleSubmit}>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Knoten Gruppen</h2>
            {nodeGroups.map((group, idx) => (
              <div key={idx} className="flex flex-wrap gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grad
                  </label>
                  <input
                    type="number"
                    value={group.degree}
                    onChange={(e) =>
                      handleNodeGroupChange(idx, "degree", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                               focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Anzahl
                  </label>
                  <input
                    type="number"
                    value={group.count}
                    onChange={(e) =>
                      handleNodeGroupChange(idx, "count", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                               focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddNodeGroup}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Weitere Knoten Gruppe hinzufügen
            </button>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Einschränkungen</h2>
            {restrictions.map((restriction, idx) => (
              <div key={idx} className="flex flex-wrap gap-4 mb-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Von Grad
                  </label>
                  <input
                    type="number"
                    value={restriction.fromDegree}
                    onChange={(e) =>
                      handleRestrictionChange(idx, "fromDegree", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                               focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zu Grad
                  </label>
                  <input
                    type="number"
                    value={restriction.toDegree}
                    onChange={(e) =>
                      handleRestrictionChange(idx, "toDegree", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                               focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    id={`allowed-${idx}`}
                    type="checkbox"
                    checked={restriction.allowed}
                    onChange={(e) =>
                      handleRestrictionChange(idx, "allowed", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`allowed-${idx}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Erlaubt
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddRestriction}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Weitere Einschränkung hinzufügen
            </button>
          </section>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white text-lg rounded hover:bg-green-700"
            >
              Graph prüfen und erstellen
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-6 text-red-600 text-center font-medium">
            Fehler: {error}
          </p>
        )}
        {result && (
          <div>
            <h2 className="text-xl font-semibold mb-2 mt-6">Visualisierung</h2>
            <GraphVisualization graph={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphInputPage;
