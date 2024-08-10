import express from "express";
import { container } from "../../../infrastructure/di/inversify.config";
import { ProductController } from "../../controllers/product.controller";
import { TYPES } from "../../../shared/constants/types";
import { asyncHandler } from "../../../shared/helpers/asyncHandler";
import { Auth } from "../../auth/auth.util";
import { Access } from "../../auth/rbac";
const router = express.Router();

const controller = container.get<ProductController>(TYPES.ProductController);
const auth = container.get<Auth>(TYPES.Auth);
const access = container.get<Access>(TYPES.Access);
router.use(express.json());

//AUTHENTICATION
router.post(
    "/",
    // auth.authentication,
    // access.GrantAccess("createAny", "product"),
    asyncHandler(controller.createProduct.bind(controller))
);
router.post(
    "/item",
    // auth.authentication,
    // access.GrantAccess("createAny", "product"),
    asyncHandler(controller.createProductItem.bind(controller))
);
router.patch(
    "/:productItemId",
    // auth.authentication,
    // access.GrantAccess("updateAny", "product"),
    asyncHandler(controller.updateProduct.bind(controller))
);
router.patch(
    "/publish/:productId",
    // auth.authentication,
    // access.GrantAccess("createAny", "product"),
    asyncHandler(controller.publishProduct.bind(controller))
);
router.patch(
    "/unpublish/:productId",
    // auth.authentication,
    // access.GrantAccess("createAny", "product"),
    asyncHandler(controller.unPublishProduct.bind(controller))
);

//QUERY
router.get(
    "/publishs",
    // auth.authentication,
    // access.GrantAccess("readAny", "product"),
    asyncHandler(controller.getPublishs.bind(controller))
);

router.get(
    "/drafts",
    // auth.authentication,
    // access.GrantAccess("readAny", "product"),
    asyncHandler(controller.getDrafts.bind(controller))
);

//PUBLIC
router.get(
    "/search/:keySearch",
    asyncHandler(controller.searchs.bind(controller))
);
router.get("/", asyncHandler(controller.getProducts.bind(controller)));
router.get(
    "/manager",
    asyncHandler(controller.getProductsManager.bind(controller))
);
router.get("/search", asyncHandler(controller.searchProducts.bind(controller)));
router.get(
    "/varriant/:slug/:category",
    controller.getVariations.bind(controller)
);
router.get(
    "/feedback/:slug",
    asyncHandler(controller.getFeedbackProductItem.bind(controller))
);
router.get("/:slug", asyncHandler(controller.getProduct.bind(controller)));

export default router;
