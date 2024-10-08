import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
    Login,
    Home,
    Public,
    FAQ,
    Services,
    DetailProduct,
    DetailBlogs,
    Products,
    FinalRegister,
    ResetPassword,
    DetailCart,
} from "pages/public";
import {
    AdminLayout,
    ManageOrder,
    ManageProducts,
    ManageUser,
    CreateProducts,
    Dashboard,
    CreateBlog,
    ManageBlog,
} from "pages/admin";
import {
    MemberLayout,
    Personal,
    History,
    Wishlist,
    Checkout,
} from "pages/member";
import path from "ultils/path";
import { getCategories } from "store/app/asyncActions";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Cart, Modal } from "components";
import { showCart, showFeedback } from "store/app/appSlice";
import { updateCart } from "store/user/userSlice";
import { getCartItems } from "apis";
import OrderResult from "pages/member/OrderResult";
import InputFeedback from "components/common/InputFeedback";
import PdfFile from "components/common/PdfFile";

function App() {
    const dispatch = useDispatch();
    const { isShowModal, modalChildren, isShowCart, isShowFeedback } =
        useSelector((state) => state.app);

    useEffect(() => {
        (async () => {
            const carts = await getCartItems();
            dispatch(updateCart(carts));
        })();
    }, []);

    useEffect(() => {
        dispatch(getCategories());
    }, []);
    return (
        <div className="font-jp">
            {isShowCart && (
                <div
                    onClick={() => dispatch(showCart())}
                    className="absolute inset-0 bg-overlay z-50 flex justify-end"
                >
                    <Cart />
                </div>
            )}
            {isShowFeedback.open && (
                <div
                    onClick={() => dispatch(showFeedback({ item: null }))}
                    className="absolute inset-0 z-[99998] bg-overlay flex items-center justify-center"
                >
                    <InputFeedback item={isShowFeedback.item} />
                </div>
            )}
            {isShowModal && <Modal>{modalChildren}</Modal>}

            <Routes>
                <Route path={path.ORDERRESULT} element={<OrderResult />} />
                <Route path={"pdf"} element={<PdfFile />} />
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />} />
                    <Route
                        path={path.BLOGS__ID__TITLE}
                        element={<DetailBlogs />}
                    />
                    <Route
                        path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE}
                        element={<DetailProduct />}
                    />
                    <Route path={path.FAQ} element={<FAQ />} />
                    <Route path={path.OUR_SERVICES} element={<Services />} />
                    <Route
                        path={path.PRODUCTS__CATEGORY}
                        element={<Products />}
                    />
                    <Route path={path.PRODUCTS} element={<Products />} />
                    <Route
                        path={path.RESET_PASSWORD}
                        element={<ResetPassword />}
                    />
                    <Route path={path.CHECKOUT} element={<Checkout />} />
                    <Route path={path.DETAIL_CART} element={<DetailCart />} />

                    <Route path={path.ALL} element={<Home />} />
                </Route>
                <Route path={path.ADMIN} element={<AdminLayout />}>
                    <Route path={path.DASHBOARD} element={<Dashboard />} />
                    <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
                    <Route
                        path={path.MANAGE_PRODUCTS}
                        element={<ManageProducts />}
                    />
                    <Route path={path.MANAGE_USER} element={<ManageUser />} />
                    <Route
                        path={path.CREATE_PRODUCTS}
                        element={<CreateProducts />}
                    />
                    <Route path={path.CREATE_BLOG} element={<CreateBlog />} />
                    <Route path={path.MANAGE_BLOGS} element={<ManageBlog />} />
                </Route>
                <Route path={path.MEMBER} element={<MemberLayout />}>
                    <Route path={path.PERSONAL} element={<Personal />} />
                    <Route path={path.WISHLIST} element={<Wishlist />} />
                    <Route path={path.HISTORY} element={<History />} />
                </Route>
                <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
                <Route path={path.LOGIN} element={<Login />} />
            </Routes>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                // hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                // draggable
                pauseOnHover
            />
        </div>
    );
}

export default App;
