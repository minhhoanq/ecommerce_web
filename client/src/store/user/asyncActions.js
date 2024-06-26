import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

export const getCurrent = createAsyncThunk(
    "user/me",
    async (data, { rejectWithValue }) => {
        const response = await apis.apiGetCurrent();
        console.log(response);
        if (response.status !== 200) return rejectWithValue(response);
        return response.metadata;
    }
);
