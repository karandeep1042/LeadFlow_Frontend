import { createSlice } from '@reduxjs/toolkit';
import {
  fetchClientDocuments,
  uploadDocument,
  approveDocument,
  rejectDocument,
} from '../thunks/documentThunk';

const initialState = {
  documents: [],
  activeCategory: 'all', // 'personal' | 'income' | 'financial' | 'property' | 'all'
  uploadingDocTypes: {}, // { payslip_1: true }
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    clearDocumentError(state) {
      state.error = null;
    },
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
    // WebSocket real-time event for background verification completion
    onDocumentStatusUpdatedWs(state, action) {
      const updatedDoc = action.payload;
      const index = state.documents.findIndex((d) => String(d._id || d.id) === String(updatedDoc._id || updatedDoc.id));
      if (index !== -1) {
        state.documents[index] = { ...state.documents[index], ...updatedDoc };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Documents
      .addCase(fetchClientDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.data?.documents || action.payload.data || action.payload || [];
      })
      .addCase(fetchClientDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Document (Async flow)
      .addCase(uploadDocument.pending, (state, action) => {
        const docType = action.meta.arg?.docType;
        if (docType) {
          state.uploadingDocTypes[docType] = true;
        }
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        const docType = action.meta.arg?.docType;
        if (docType) {
          delete state.uploadingDocTypes[docType];
        }
        const uploadedDoc = action.payload.data || action.payload;
        if (uploadedDoc) {
          const index = state.documents.findIndex(
            (d) => d.docType === uploadedDoc.docType || String(d._id) === String(uploadedDoc._id)
          );
          if (index !== -1) {
            state.documents[index] = uploadedDoc;
          } else {
            state.documents.push(uploadedDoc);
          }
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        const docType = action.meta.arg?.docType;
        if (docType) {
          delete state.uploadingDocTypes[docType];
        }
        state.error = action.payload;
      })

      // Approve Document
      .addCase(approveDocument.fulfilled, (state, action) => {
        const { docId } = action.payload;
        const doc = state.documents.find((d) => String(d._id || d.id) === String(docId));
        if (doc) {
          doc.status = 'verified';
          doc.advisorApproved = true;
          doc.rejectionReason = null;
        }
      })

      // Reject Document
      .addCase(rejectDocument.fulfilled, (state, action) => {
        const { docId, reason } = action.payload;
        const doc = state.documents.find((d) => String(d._id || d.id) === String(docId));
        if (doc) {
          doc.status = 'rejected';
          doc.advisorApproved = false;
          doc.rejectionReason = reason;
        }
      });
  },
});

export const { clearDocumentError, setActiveCategory, onDocumentStatusUpdatedWs } = documentSlice.actions;
export default documentSlice.reducer;
