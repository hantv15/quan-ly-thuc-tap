import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import NarrowAPI from "../../API/NarrowAPI";

export const getListNarrow = createAsyncThunk(
  "specialization/getListNarrow",
  async () => {
    const { data } = await NarrowAPI.getNarrow();
    return data.listNarrow;
  }
);

const narrowSlice = createSlice({
  name: "narrow",
  initialState: {
    listNarrow: [],
    loading: false,
  },

  extraReducers: (builder) => {
    builder.addCase(getListNarrow.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getListNarrow.fulfilled, (state, action) => {
      state.loading = false;
      state.listNarrow = action.payload;
    });
    builder.addCase(getListNarrow.rejected, (state) => {
      state.messages = "Get list narrow fail";
    });
  },
});

export default narrowSlice.reducer;
