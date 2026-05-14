import React from "react";

export const Approvalwindow = ({ doc, onClose, onApprove, onReject }) => {
  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[380px] nv-bento nv-bento-rim p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white text-sm"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4 tracking-wide">
          Document Details
        </h2>

        {/* Content - Updated to show all data */}
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-white/50">File Name</p>
            <p className="font-medium truncate">{doc.file_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/50">Uploaded By</p>
              <p className="font-medium">{doc.uploaded_by || "N/A"}</p>
            </div>
            <div>
              <p className="text-white/50">Document ID</p>
              <p className="font-medium font-mono text-xs">{doc.document_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/50">Date</p>
              <p className="font-medium">{doc.date}</p>
            </div>
            <div>
              <p className="text-white/50">Time</p>
              <p className="font-medium">{doc.time || "N/A"}</p>
            </div>
          </div>

          <div>
            <p className="text-white/50">Status</p>
            <span
              className={`nv-pill text-[10px] font-bold uppercase tracking-[0.18em] inline-flex mt-1 ${
                doc.status === "approved"
                  ? "nv-pill-green"
                  : doc.status === "rejected"
                    ? "nv-pill text-rose-300 border border-rose-500/30 bg-rose-500/10"
                    : "nv-pill-yellow"
              }`}
            >
              {doc.status}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="nv-btn">
            Cancel
          </button>

          {doc.status === "pending" && (
            <>
              <button
                onClick={() => onReject(doc.document_id)}
                className="nv-btn border border-rose-500/40 text-rose-300 hover:bg-rose-500/15"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(doc.document_id)}
                className="nv-btn nv-btn-primary"
              >
                Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
