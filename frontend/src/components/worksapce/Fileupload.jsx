import { useRef } from "react";
import { toast } from "react-toastify";
import { API_BASE } from "../../utils/api";
export default function FileUpload({ workspaceId, userId }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const workspace_id = localStorage.getItem("spaceid");
    console.log(workspace_id);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("workspace_id", workspace_id);
    formData.append("token", token);
    try {
      const response = await fetch(`${API_BASE}/uploads`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Upload failed");
      }

      toast.success("File uploaded successfully!", {
        className:
          "bg-white/5 backdrop-blur-lg border border-white/10 text-white rounded-xl shadow-lg text-white",
        bodyClassName: "text-sm",
        hideProgressBar: true,
        position: "top-center",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(err.message || "File upload failed.", {
        className:
          "bg-white/5 backdrop-blur-lg border border-white/10 text-white rounded-xl shadow-lg text-white",
        bodyClassName: "text-sm",
        hideProgressBar: true,
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-around  h-full px-6">
      <div
        onClick={handleClick}
        className="nv-bento nv-bento-rim flex h-64 w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-white/12 hover:border-white/20 transition-colors"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            className="mb-4 h-8 w-8 text-white/45"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-white/60">
            <span className="font-semibold text-white/90">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-white/35">
            PDF, DOC, DOCX, TXT, MD, CSV, HTML, JSON (MAX. 10MB)
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md,.csv,.tsv,.html,.htm,.json,.log,.pptx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          Supported Document Types
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="nv-bento nv-bento-rim p-4 text-center">
            <p className="text-sm font-semibold text-white/90">PDF</p>
            <p className="text-xs text-white/45">.pdf</p>
          </div>
          <div className="nv-bento nv-bento-rim p-4 text-center">
            <p className="text-sm font-semibold text-white/90">Word</p>
            <p className="text-xs text-white/45">.doc, .docx</p>
          </div>
          <div className="nv-bento nv-bento-rim p-4 text-center">
            <p className="text-sm font-semibold text-white/90">Text &amp; data</p>
            <p className="text-xs text-white/45">.txt, .md, .csv, .json</p>
          </div>
          <div className="nv-bento nv-bento-rim p-4 text-center">
            <p className="text-sm font-semibold text-white/90">Web</p>
            <p className="text-xs text-white/45">.html, .htm</p>
          </div>
        </div>
      </div>
    </div>
  );
}
