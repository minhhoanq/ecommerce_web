import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

export const getNewProducts = createAsyncThunk(
    "product/newProducts",
    async (data, { rejectWithValue }) => {
        const response = await apis.apiGetProducts({ sort: "ctime" });
        if (response.status !== 200) return rejectWithValue(response);
        return response.metadata;
    }
);
