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
};

export { TYPES };
