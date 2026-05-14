import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Approvalwindow } from "./Approvalwindow";
import { API_BASE } from "../../utils/api";

export const Approvals = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const { role } = useOutletContext();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`${API_BASE}/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spaceid: localStorage.getItem("spaceid"),
            token: localStorage.getItem("token"),
          }),
        });
        const data = await res.json();
        setDocuments(Array.isArray(data) ? data : []);
     
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };
    fetchDocuments();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId: id,
          workspaceId: localStorage.getItem("spaceid"),
          token: localStorage.getItem("token"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Approval failed");

      setDocuments((prev) =>
        prev.filter((doc) => doc.document_id !== id),
      );
      setSelectedDoc(null);
    } catch (err) {
      console.error("Error approving document:", err);
      alert(err.message || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/reject-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId: id,
          workspaceId: localStorage.getItem("spaceid"),
          token: localStorage.getItem("token"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Reject failed");

      setDocuments((prev) => prev.filter((doc) => doc.document_id !== id));
      setSelectedDoc(null);
    } catch (err) {
      console.error("Error rejecting document:", err);
      alert(err.message || "Reject failed");
    }
  };

  return (
    <>
      <div className="w-full bg-[#111216] text-[#e1e1e1] font-sans rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-tight">
                  Index
                </th>
                <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-tight">
                  Document Name
                </th>
                <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-tight">
                  Status
                </th>
                <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-tight text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {documents.map((doc, index) => (
                <tr
                  key={doc.document_id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-[13px] text-white/40 font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="px-6 py-4 text-[13px] font-medium text-white/90">
                    {doc.file_name}
                  </td>

                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        doc.status === "approved"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {doc.status === "approved" ? "Approved" : "Pending"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="text-white/20 hover:text-blue-500 transition-colors p-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDoc && (
        <Approvalwindow
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
};
