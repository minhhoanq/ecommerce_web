type DefaultFieldInEntity = "id" | "createdAt" | "updatedAt";

export type BaseCreateEntityType<T> = {
    [K in Exclude<keyof T, DefaultFieldInEntity>]: T[K];
};
