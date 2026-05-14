import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";
import { MdOutlineUploadFile } from "react-icons/md";
import { TbMessageChatbot } from "react-icons/tb";
import { TfiLayersAlt } from "react-icons/tfi";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoMdCreate } from "react-icons/io";
import { BiNetworkChart } from "react-icons/bi";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { MdWifiFind } from "react-icons/md";
const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
    },
  },

  {
    component: CNavItem,
    name: "Workspaces",
    to: "/dashboard/workspaces",
    icon: <TfiLayersAlt className="nav-icon mr-[1rem] ml-[.2rem]" />,
    badge: {
      color: "info",
    },
  },

  {
    component: CNavItem,
    name: "Create Workspace",
    to: "/dashboard/createworkspace",
    icon: <IoMdCreate className="nav-icon mr-[1rem] ml-[.2rem]" />,
    badge: {
      color: "info",
    },
  },
  {
    component: CNavItem,
    name: "Find workspaces",
    to: "/dashboard/searchworkspaces",
    icon: <MdWifiFind className="nav-icon mr-[1rem] ml-[.2rem]" />,
    badge: {
      color: "info",
    },
  },
  {
    component: CNavItem,
    name: "Connections",
    to: "/dashboard/connections",
    icon: <BiNetworkChart className="nav-icon mr-[1rem] ml-[.2rem]" />,
    badge: {
      color: "info",
    },
  },
];

export default _nav;
