import React, { useEffect, useState } from "react";
import { API_BASE } from "../../utils/api";

export const Allapproved = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedDocs = async () => {
      try {
        const res = await fetch(`${API_BASE}/allapproveddocs`, {
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
        console.error("Error fetching approved documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedDocs();
  }, []);

  return (
    <div className="w-full bg-[#111216] text-[#e1e1e1] font-sans rounded-2xl overflow-scroll">
      

      <div className="overflow-scroll">
        <table className="w-full text-left border-collapse overflow-scroll">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-4 text-[11px] font-medium text-white/40 uppercase tracking-[0.15em]">
                Document
              </th>
              <th className="px-6 py-4 text-[11px] font-medium text-white/40 uppercase tracking-[0.15em]">
                Uploaded By
              </th>
              <th className="px-6 py-4 text-[11px] font-medium text-white/40 uppercase tracking-[0.15em]">
                Timestamp
              </th>
              <th className="px-6 py-4 text-[11px] font-medium text-white/40 uppercase tracking-[0.15em] text-right">
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
                  className="group hover:bg-white/[0.02] transition-all duration-200"
                >
                 
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold text-white/80 group-hover:text-white transition-colors">
                        {doc.file_name}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest opacity-70">
                          Verified Knowledge
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Uploaded By */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/30 border border-white/10 group-hover:border-white/20 transition-colors">
                        {doc.uploaded_by?.charAt(0) || "U"}
                      </div>
                      <span className="text-[12px] text-white/60 font-medium">
                        {doc.uploaded_by || "Unknown"}
                      </span>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5 text-[11px]">
                      <span className="text-white/60 font-medium">
                        {doc.date}
                      </span>
                      <span className="text-white/20 font-mono">
                        {doc.time}
                      </span>
                    </div>
                  </td>

                  {/* Action - Sleek Poppy Preview Button */}
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`${API_BASE}${doc.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex items-center justify-center 
                        px-4 py-2 rounded-xl
                        text-[11px] font-black uppercase tracking-widest
                        bg-blue-600 text-white
                        transition-all duration-150
                        hover:bg-blue-500 hover:scale-105 active:scale-95
                        shadow-lg shadow-blue-600/20
                      "
                    >
                      Preview
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center">
                  <span className="text-[11px] font-bold text-white/10 uppercase tracking-[0.3em]">
                    No verified documents
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
