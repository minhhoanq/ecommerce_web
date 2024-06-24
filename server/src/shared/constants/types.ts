const TYPES = {
    //Auth, User
    AuthService: Symbol.for("AuthService"),
    UserRepository: Symbol.for("UserRepository"),
    AuthController: Symbol.for("AuthController"),
    //KeyStore
    KeyStoreRepository: Symbol.for("KeyStoreRepository"),
    KeyStoreService: Symbol.for("KeyStoreService"),
};

export { TYPES };
