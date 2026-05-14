import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { DocsComponents, DocsExample } from "src/components";

const Tables = () => {
  return (
    <CRow className="mt-5 bg-red">
      <CCol xs={12} className="">
        <CCard className="mb-4 bg-none">
          <CCardBody>
            <p className="text-body-secondary font-bold text-[1.4rem] mb-4">
              Recent workspaces
            </p>

            <CTable caption="top">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Workspaces</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>LBM Legal Docks</CTableDataCell>
                  <CTableDataCell>Member</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>AI Project</CTableDataCell>
                  <CTableDataCell>Admin</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>RAG Reserach</CTableDataCell>
                  <CTableDataCell>the Bird</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Tables;
