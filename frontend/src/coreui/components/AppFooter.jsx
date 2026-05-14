import React from "react";
import { CFooter } from "@coreui/react";

const AppFooter = () => {
  return (
    <CFooter className="bg-transparent border-0">
      <div className="w-full px-4 pb-4">
        <div className="mx-auto max-w-[1100px] text-center text-[11px] text-white/35 tracking-wide">
          since 2026 &copy; All rights reserved.
        </div>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
