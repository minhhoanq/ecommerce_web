import { z } from "zod";

//create key store
const createKeyStoreSchema = z.object({
    userId: z.number({ required_error: "User id is required!" }),
    publicKey: z.string({ required_error: "Public key is required!" }),
    privateKey: z.string({ required_error: "Private key is required" }),
    refreshToken: z.string().optional(),
});

type CreateKeyStoreDTO = z.infer<typeof createKeyStoreSchema>;

//update key store
const updateKeyStoreSchema = z.object({
    userId: z.number({ required_error: "userId missing!" }),
    publicKey: z.string().optional(),
    privateKey: z.string().optional(),
    refreshToken: z.string().optional(),
});

type UpdateKeyStoreDTO = z.infer<typeof updateKeyStoreSchema>;

//delete keystore
const deleteKeyStore = z.object({
    id: z.number().optional(),
    userId: z.number().optional(),
});

type DeleteKeyStoreDTO = z.infer<typeof deleteKeyStore>;

export {
    createKeyStoreSchema,
    CreateKeyStoreDTO,
    updateKeyStoreSchema,
    UpdateKeyStoreDTO,
    deleteKeyStore,
    DeleteKeyStoreDTO,
};
