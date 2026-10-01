import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDocuments,
  fetchClientDocuments,
  uploadDocument,
  approveDocument,
  rejectDocument,
  reverifyDocument,
} from '../thunks/documentThunk';

const initialState = {
  documents: [],
  total: 0,
  activeCategory: 'all',
  activeStatus: 'all',
  searchQuery: '',
  selectedAdvisorId: 'all',
  uploadingDocTypes: {},
  loading: false,
  actionLoading: false,
  error: null,
};

const getArgDocType = (arg) => {
  if (!arg) return null;
  if (typeof FormData !== 'undefined' && arg instanceof FormData) {
    return arg.get('docType');
  }
  return arg.docType;
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
    setActiveStatus(state, action) {
      state.activeStatus = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSelectedAdvisorId(state, action) {
      state.selectedAdvisorId = action.payload;
    },
    onDocumentStatusUpdatedWs(state, action) {
      const updatedDoc = action.payload;
      if (!updatedDoc) return;
      const index = state.documents.findIndex(
        (d) => String(d._id || d.id) === String(updatedDoc._id || updatedDoc.id)
      );
      if (index !== -1) {
        state.documents[index] = { ...state.documents[index], ...updatedDoc };
      } else {
        state.documents.unshift(updatedDoc);
        state.total += 1;
      }
    },
    onDocumentCreatedWs(state, action) {
      const newDoc = action.payload;
      if (!newDoc) return;
      const exists = state.documents.some(
        (d) => String(d._id || d.id) === String(newDoc._id || newDoc.id)
      );
      if (!exists) {
        state.documents.unshift(newDoc);
        state.total += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        const docs = action.payload?.data?.documents || action.payload?.data || action.payload || [];
        state.documents = docs;
        state.total = action.payload?.data?.total || docs.length;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      .addCase(uploadDocument.pending, (state, action) => {
        const docType = getArgDocType(action.meta.arg);
        if (docType) state.uploadingDocTypes[docType] = true;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        const docType = getArgDocType(action.meta.arg);
        if (docType) delete state.uploadingDocTypes[docType];
        const uploadedDoc = action.payload.data || action.payload;
        if (uploadedDoc) {
          const index = state.documents.findIndex(
            (d) => d.docType === uploadedDoc.docType || String(d._id) === String(uploadedDoc._id)
          );
          if (index !== -1) {
            state.documents[index] = uploadedDoc;
          } else {
            state.documents.unshift(uploadedDoc);
            state.total += 1;
          }
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        const docType = getArgDocType(action.meta.arg);
        if (docType) delete state.uploadingDocTypes[docType];
        state.error = action.payload;
      })
      .addCase(approveDocument.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(approveDocument.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { docId, data } = action.payload;
        const index = state.documents.findIndex((d) => String(d._id || d.id) === String(docId));
        if (index !== -1) {
          state.documents[index] = { ...state.documents[index], ...data, status: 'verified', advisorApproved: true };
        }
      })
      .addCase(approveDocument.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(rejectDocument.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(rejectDocument.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { docId, reason, data } = action.payload;
        const index = state.documents.findIndex((d) => String(d._id || d.id) === String(docId));
        if (index !== -1) {
          state.documents[index] = {
            ...state.documents[index],
            ...data,
            status: 'rejected',
            advisorApproved: false,
            rejectionReason: reason,
          };
        }
      })
      .addCase(rejectDocument.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(reverifyDocument.fulfilled, (state, action) => {
        const { docId, data } = action.payload;
        const index = state.documents.findIndex((d) => String(d._id || d.id) === String(docId));
        if (index !== -1) {
          state.documents[index] = { ...state.documents[index], ...data, status: 'processing' };
        }
      });
  },
});

export const {
  clearDocumentError,
  setActiveCategory,
  setActiveStatus,
  setSearchQuery,
  setSelectedAdvisorId,
  onDocumentStatusUpdatedWs,
  onDocumentCreatedWs,
} = documentSlice.actions;

export default documentSlice.reducer;

