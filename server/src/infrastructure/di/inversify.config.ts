import { Container } from "inversify";
import { IUserRepository } from "../../domain/repositories/user.interface";
import { TYPES } from "../../shared/constants/types";
import { UserRepoImpl } from "../repositories/user.repo";
import { IAuthService } from "../../application/usecases/auth/auth.interface";
import { AuthService } from "../../application/usecases/auth/auth.service";
import { AuthController } from "../../presentation/controllers/auth.controller";
import { IKeyStoreRepository } from "../../domain/repositories/keyStore.interface";
import { KeyStoreRepoImpl } from "../repositories/keyStore.repo";
import { IKeyStoreService } from "../../application/usecases/keystore/keystore.interface";
import { KeyStoreService } from "../../application/usecases/keystore/keystrore.service";
import { IRoleResourceRepository } from "../../domain/repositories/roleResource.interface";
import { RoleResourceRepoImpl } from "../repositories/roleResource.repo";
import { Auth } from "../../presentation/auth/auth.util";
import { Access } from "../../presentation/auth/rbac";
import { ProductController } from "../../presentation/controllers/product.controller";
import { IProductRepository } from "../../domain/repositories/product.interface";
import { ProductRepositoryImpl } from "../repositories/product.repo";
import { IProductService } from "../../application/usecases/product/product.interface";
import { ProductService } from "../../application/usecases/product/product.service";
import { IImageService } from "../../application/usecases/image/image.interface";
import { ImageService } from "../../application/usecases/image/image.service";
import { ImageController } from "../../presentation/controllers/image.controller";
import { ICategoryRepository } from "../../domain/repositories/category.interface";
import { CategoryRepositoryImpl } from "../repositories/category.repo";
import { ICategoryService } from "../../application/usecases/category/category.interface";
import { CategoryService } from "../../application/usecases/category/category.service";
import { CategoryController } from "../../presentation/controllers/category.controller";
import { ICartRepository } from "../../domain/repositories/cart.interface";
import { CartRepositoryImpl } from "../repositories/cart.repo";
import { ICartService } from "../../application/usecases/cart/cart.interface";
import { CartService } from "../../application/usecases/cart/cart.service";
import { CartController } from "../../presentation/controllers/cart.controller";
import { ICartItemRepository } from "../../domain/repositories/cartItem.interface";
import { CartItemRepositoryImpl } from "../repositories/cartItem.repo";
import { IProductItemRepository } from "../../domain/repositories/productItem.interface";
import { ProductItemRepositoryImpl } from "../repositories/productItem.repo";
import { ICheckoutRepository } from "../../domain/repositories/checkout.interface";
import { CheckoutRepositoryImpl } from "../repositories/checkout.repo";
import { ICheckoutService } from "../../application/usecases/checkout/checkout.interface";
import { CheckoutService } from "../../application/usecases/checkout/checkout.service";
import { CheckoutController } from "../../presentation/controllers/checkout.controller";

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepoImpl);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind(TYPES.AuthController).to(AuthController);
//key store
container
    .bind<IKeyStoreRepository>(TYPES.KeyStoreRepository)
    .to(KeyStoreRepoImpl);
container.bind<IKeyStoreService>(TYPES.KeyStoreService).to(KeyStoreService);
//
container
    .bind<IRoleResourceRepository>(TYPES.RoleResourceRepository)
    .to(RoleResourceRepoImpl);
container.bind(TYPES.Auth).to(Auth);
//
container.bind(TYPES.Access).to(Access);
//product
container
    .bind<IProductRepository>(TYPES.ProductRepository)
    .to(ProductRepositoryImpl);
container.bind<IProductService>(TYPES.ProductService).to(ProductService);
container.bind(TYPES.ProductController).to(ProductController);
//product item
container
    .bind<IProductItemRepository>(TYPES.ProductItemRepository)
    .to(ProductItemRepositoryImpl);
//image
container.bind<IImageService>(TYPES.ImageService).to(ImageService);
container.bind(TYPES.ImageController).to(ImageController);
//category
container
    .bind<ICategoryRepository>(TYPES.CategoryRepository)
    .to(CategoryRepositoryImpl);
container.bind<ICategoryService>(TYPES.CategoryService).to(CategoryService);
container.bind(TYPES.CategoryController).to(CategoryController);
//cart
container.bind<ICartRepository>(TYPES.CartRepository).to(CartRepositoryImpl);
container.bind<ICartService>(TYPES.CartService).to(CartService);
container.bind(TYPES.CartController).to(CartController);
//cart item
container
    .bind<ICartItemRepository>(TYPES.CartItemRepository)
    .to(CartItemRepositoryImpl);
//checkout
container
    .bind<ICheckoutRepository>(TYPES.CheckoutRepository)
    .to(CheckoutRepositoryImpl);
container.bind<ICheckoutService>(TYPES.CheckoutService).to(CheckoutService);
container.bind(TYPES.CheckoutController).to(CheckoutController);

export { container };
