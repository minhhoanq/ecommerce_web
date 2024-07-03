const TYPES = {
    //Auth, User
    AuthService: Symbol.for("AuthService"),
    UserRepository: Symbol.for("UserRepository"),
    AuthController: Symbol.for("AuthController"),
    //KeyStore
    KeyStoreRepository: Symbol.for("KeyStoreRepository"),
    KeyStoreService: Symbol.for("KeyStoreService"),
    //RoleResource
    RoleResourceRepository: Symbol.for("RoleResourceRepository"),
    Auth: Symbol.for("Auth"),
    Access: Symbol.for("Access"),
    //Product
    ProductRepository: Symbol.for("ProductRepository"),
    ProductService: Symbol.for("ProductService"),
    ProductController: Symbol.for("ProductController"),
    //Cart
    ProductItemRepository: Symbol.for("ProductItemRepository"),
    //Image
    ImageService: Symbol.for("ImageService"),
    ImageController: Symbol.for("ImageController"),
    //Category
    CategoryRepository: Symbol.for("CategoryRepository"),
    CategoryService: Symbol.for("CategoryService"),
    CategoryController: Symbol.for("CategoryController"),
    //Cart
    CartRepository: Symbol.for("CartRepository"),
    CartService: Symbol.for("CartService"),
    CartController: Symbol.for("CartController"),
    //Cart
    CartItemRepository: Symbol.for("CartItemRepository"),
};

export { TYPES };
