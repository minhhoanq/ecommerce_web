const path = {
    PUBLIC: "/",
    HOME: "",
    ALL: "*",
    LOGIN: "login",
    PRODUCTS__CATEGORY: "/products/:category",
    BLOGS__ID__TITLE: "blogs/:id/:title",
    BLOGS: "blogs",
    OUR_SERVICES: "services",
    FAQ: "faqs",
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ":category/:pid/:title",
    // DETAIL_PRODUCT__CATEGORY__PID__TITLE: ":category/:pid",
    FINAL_REGISTER: "finalregister/:status",
    RESET_PASSWORD: "reset-password/:token",
    DETAIL_CART: "cart",
    CHECKOUT: "checkout",
    PRODUCTS: "products",

    // Admin
    ADMIN: "admin",
    DASHBOARD: "",
    MANAGE_USER: "manage-user",
    MANAGE_PRODUCTS: "manage-products",
    MANAGE_ORDER: "manage-order",
    CREATE_PRODUCTS: "create-products",
    CREATE_BLOG: "create-blog",
    MANAGE_BLOGS: "manage-blogs",

    // Member
    MEMBER: "member",
    PERSONAL: "personal",
    MY_CART: "my-cart",
    HISTORY: "order/history",
    WISHLIST: "wishlist",
    ORDERRESULT: "order/result",
};

export default path;
