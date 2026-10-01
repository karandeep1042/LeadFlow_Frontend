import { createSlice } from '@reduxjs/toolkit';
import { fetchClients, toggleClientStatus, fetchClientPortalOverview } from '../thunks/clientThunk';
import { uploadDocument } from '../thunks/documentThunk';

const initialState = {
  clients: [],
  totalClients: 0,
  activeClients: 0,
  suspendedClients: 0,
  loading: false,
  updatingId: null,
  error: null,
  successMessage: null,

  // Client Portal specific state
  portalData: null,
  portalLoading: false,
  portalError: null,
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    clearClientMessages(state) {
      state.error = null;
      state.successMessage = null;
      state.portalError = null;
    },
    updatePortalDocument(state, action) {
      const updatedDoc = action.payload;
      if (!state.portalData || !updatedDoc) return;
      const docs = state.portalData.documents || [];

      // Match first by _id (exact record), then fall back to docType (replace-document scenario).
      // Using docType as fallback guarantees only ONE doc per docType slot exists in local state,
      // which prevents the verified counter from inflating when a client replaces a verified doc.
      const idxById = docs.findIndex((d) => String(d._id) === String(updatedDoc._id));
      const idxByType = updatedDoc.docType
        ? docs.findIndex((d) => d.docType === updatedDoc.docType)
        : -1;

      const idx = idxById !== -1 ? idxById : idxByType;

      if (idx !== -1) {
        docs[idx] = updatedDoc;
      } else {
        docs.unshift(updatedDoc);
      }
      state.portalData.documents = docs;

      // Recalculate metrics
      const verifiedDocs = docs.filter((d) => d.status === 'verified');
      const rejectedDocs = docs.filter((d) => d.status === 'rejected');
      const processingDocs = docs.filter((d) => d.status === 'processing');
      const pendingDocs = docs.filter((d) => d.status === 'pending');
      const totalRequired = 18;

      state.portalData.metrics = {
        totalRequired,
        totalUploaded: docs.length,
        verifiedCount: verifiedDocs.length,
        rejectedCount: rejectedDocs.length,
        processingCount: processingDocs.length,
        pendingCount: pendingDocs.length,
        progressPercent: Math.min(100, Math.round((verifiedDocs.length / totalRequired) * 100)),
        hasActionRequired: rejectedDocs.length > 0,
      };
    },
    updatePortalLead(state, action) {
      const updatedLead = action.payload;
      if (!state.portalData || !updatedLead) return;
      if (
        String(state.portalData.lead?._id) === String(updatedLead._id) ||
        state.portalData.lead?.email === updatedLead.email
      ) {
        state.portalData.lead = { ...state.portalData.lead, ...updatedLead };
        // Recalculate stages
        const currentStageName = updatedLead.stage || 'Document Collection';
        const mapStageToStepIndex = (stage) => {
          switch (stage) {
            case 'New':
            case 'New Lead':
              return 0;
            case 'Contacted':
            case 'Discovery Call':
            case 'Qualified':
              return 1;
            case 'Document Collection':
            case 'Docs Pending':
            case 'Under Review':
              return 1;
            case 'Bank Submission':
            case 'Submitted':
              return 2;
            case 'Won':
            case 'Approved':
            case 'Loan Offer':
            case 'Offer & Approval':
              return 3;
            case 'Lost':
            case 'Closed':
            case 'Closed Won':
            case 'Closed Lost':
            case 'Notary & Closing':
            case 'Notary & Payout':
              return 4;
            default:
              return 1;
          }
        };
        const stepIdx = mapStageToStepIndex(currentStageName);

        state.portalData.stages = (state.portalData.stages || []).map((s, idx) => {
          let st = 'upcoming';
          if (idx < stepIdx) {
            st = 'completed';
          } else if (idx === stepIdx) {
            st = 'current';
          }
          return { ...s, status: st };
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.data || action.payload;
        state.clients = payload?.clients || [];
        state.totalClients = payload?.totalClients || state.clients.length;
        state.activeClients = payload?.activeClients || state.clients.filter((c) => c.status === 'active').length;
        state.suspendedClients = payload?.suspendedClients || state.clients.filter((c) => c.status === 'suspended').length;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Portal Overview
      .addCase(fetchClientPortalOverview.pending, (state) => {
        state.portalLoading = true;
        state.portalError = null;
      })
      .addCase(fetchClientPortalOverview.fulfilled, (state, action) => {
        state.portalLoading = false;
        state.portalData = action.payload?.data || action.payload;
      })
      .addCase(fetchClientPortalOverview.rejected, (state, action) => {
        state.portalLoading = false;
        state.portalError = action.payload;
      })

      // Upload Document sync to portalData
      .addCase(uploadDocument.fulfilled, (state, action) => {
        const uploadedDoc = action.payload?.data || action.payload;
        if (!state.portalData || !uploadedDoc) return;
        const docs = [...(state.portalData.documents || [])];
        const index = docs.findIndex(
          (d) =>
            (uploadedDoc._id && String(d._id) === String(uploadedDoc._id)) ||
            (uploadedDoc.docType && d.docType === uploadedDoc.docType)
        );
        if (index !== -1) {
          docs[index] = { ...docs[index], ...uploadedDoc };
        } else {
          docs.unshift(uploadedDoc);
        }
        state.portalData.documents = docs;
      })

      // Toggle Client Status
      .addCase(toggleClientStatus.pending, (state, action) => {
        state.updatingId = action.meta.arg.clientId;
        state.error = null;
      })
      .addCase(toggleClientStatus.fulfilled, (state, action) => {
        state.updatingId = null;
        const { clientId, status, data } = action.payload;
        const client = state.clients.find(
          (c) => String(c.id || c._id) === String(clientId) || String(c.userId) === String(clientId) || String(c.leadId) === String(clientId)
        );
        if (client) {
          client.status = status;
          client.isRegistered = true;
        }
        state.activeClients = state.clients.filter((c) => c.status === 'active').length;
        state.suspendedClients = state.clients.filter((c) => c.status === 'suspended').length;
        state.successMessage = data?.message || `Client status updated to ${status}. Notification email sent.`;
      })
      .addCase(toggleClientStatus.rejected, (state, action) => {
        state.updatingId = null;
        state.error = action.payload;
      });
  },
});

export const { clearClientMessages, updatePortalDocument, updatePortalLead } = clientSlice.actions;
export default clientSlice.reducer;
