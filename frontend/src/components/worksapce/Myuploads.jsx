import React, { useEffect, useState } from "react";
import { API_BASE } from "../../utils/api";

export const Myuploads = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`${API_BASE}/myupload-docs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spaceid: localStorage.getItem("spaceid"),
            token: localStorage.getItem("token"),
          }),
        });

        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="w-full bg-[#111216] text-[#e1e1e1] font-sans rounded-2xl border border-white/5 overflow-hidden">
      

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-[0.15em] w-20">
                Index
              </th>
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-[0.15em]">
                Document Name
              </th>
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-[0.15em]">
                Status
              </th>
              <th className="px-6 py-3 text-[11px] font-medium text-white/40 uppercase tracking-[0.15em] text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.03]">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-24 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                </td>
              </tr>
            ) : documents.length > 0 ? (
              documents.map((doc, index) => (
                <tr
                  key={doc.document_id || index}
                  className="group hover:bg-white/[0.02] transition-all duration-150"
                >
                  {/* Index */}
                  <td className="px-6 py-2 text-[13px] text-white/40 font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  {/* Document Name */}
                  <td className="px-6 py-2">
                    <span className="text-[13px] font-bold text-white/90 group-hover:text-white transition-colors">
                      {doc.file_name}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-2">
                    <div
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        doc.status === "approved"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : doc.status === "rejected"
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {doc.status === "approved"
                        ? "Approved"
                        : doc.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-2 text-right">
                    <a
                      href={`${API_BASE}${doc.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex items-center justify-center 
                        px-5 py-2 rounded-xl
                        text-[11px] font-black uppercase tracking-widest
                        bg-blue-600 text-white
                        transition-all duration-150
                        hover:bg-blue-500 hover:scale-105 active:scale-95
                        shadow-lg shadow-blue-600/20
                      "
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center">
                  <span className="text-[11px] font-bold text-white/10 uppercase tracking-[0.3em]">
                    No documents uploaded yet
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
