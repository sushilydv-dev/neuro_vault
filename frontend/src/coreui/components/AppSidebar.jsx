/**
 * AppSidebar Component
 *
 * Collapsible navigation sidebar with branding, menu items, and toggle controls.
 *
 * Features:
 * - Redux-controlled visibility state
 * - Unfoldable/narrow mode for more screen space
 * - Brand logo with full and narrow variants
 * - Close button for mobile devices
 * - Footer with toggle button
 * - Dark color scheme
 * - Fixed positioning
 *
 * @component
 * @example
 * return (
 *   <AppSidebar />
 * )
 */

import React from "react";

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";

import logo from "../assets/brand/brainwave.svg";
import { sygnet } from "../assets/brand/sygnet";

// sidebar nav config
import navigation from "../_nav";
import { useLayout } from "../LayoutContext";

/**
 * AppSidebar functional component
 *
 * Manages sidebar state with Redux:
 * - sidebarShow: Controls sidebar visibility
 * - sidebarUnfoldable: Controls narrow/wide mode
 *
 * Renders navigation from _nav.js configuration file.
 * Memoized to prevent unnecessary re-renders.
 *
 * @returns {React.ReactElement} Sidebar with navigation
 */
const AppSidebar = () => {
  const {
    sidebarShow,
    setSidebarShow,
    sidebarUnfoldable,
    setSidebarUnfoldable,
  } = useLayout();

  return (
    <CSidebar
      className="bg-[#121316] border-r border-white/5"
      colorScheme="dark"
      position="fixed"
      unfoldable={sidebarUnfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        setSidebarShow(visible);
      }}
    >
      <CSidebarHeader className="b">
        <CSidebarBrand to="/workspace">
          <div className="flex column justify-center items-center w-[100%] ">
            <img src={logo} width={50} height={20} alt="Brainwave" />
            <span
              className={`ms-2 ${sidebarUnfoldable ? "d-none" : "d-md-block"}`}
            >
              Neurovault
            </span>
          </div>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => setSidebarShow(false)}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="d-none d-lg-flex border-top border-white/5 bg-[#121316]">
        <CSidebarToggler
          onClick={() => setSidebarUnfoldable(!sidebarUnfoldable)}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
