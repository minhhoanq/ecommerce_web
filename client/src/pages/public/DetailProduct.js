import React, { useCallback, useEffect, useRef, useState } from "react";
import { createSearchParams, useLocation, useParams } from "react-router-dom";
import {
    apiGetProduct,
    apiGetProducts,
    apiGetVariations,
    addToCart,
    getCartItems,
} from "apis";
import {
    Breadcrumb,
    Button,
    SelectQuantity,
    ProductExtraInfoItem,
    ProductInfomation,
    CustomSlider,
} from "components";
import Slider from "react-slick";
import ReactImageMagnify from "react-image-magnify";
import { formatMoney, fotmatPrice, renderStarFromNumber } from "ultils/helpers";
import { productExtraInfomation } from "ultils/contants";
import DOMPurify from "dompurify";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/user/asyncActions";
import { toast } from "react-toastify";
import path from "ultils/path";
import Swal from "sweetalert2";
import { updateCart } from "store/user/userSlice";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:7000";

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerPadding: "0px",
};

const DetailProduct = ({ isQuickView, data, location, dispatch, navigate }) => {
    const nameRef = useRef();
    const params = useParams();
    const { current } = useSelector((state) => state.user);
    const [colors, setColors] = useState([]);
    const [inchs, setInchs] = useState([]);
    const [imageProducts, setImagesProducts] = useState([]);
    const [storages, setStorages] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [currentImage, setCurrentImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState(null);
    const [update, setUpdate] = useState(false);
    const [attribute, setAttribute] = useState({
        storage: null,
        color: null,
    });
    const [socket, setSocket] = useState(null);

    console.log(params);

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
        });

        setSocket(socket);

        socket.emit("joinRoom", params.title);

        return () => {
            socket.disconnect();
        };
    }, []);

    const [pid, setPid] = useState(null);
    const [category, setCategory] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({
        productItemId: 0,
        quantity: 1,
    });

    useEffect(() => {
        if (data) {
            setPid(data.pid);
            setCategory(data.category);
        } else if (params && params.pid) {
            setPid(params.pid);
            setCategory(params.category);
        }
    }, [data, params]);
    const fetchProductData = async (slug) => {
        const response = await apiGetProduct(slug);
        if (response.status === 200) {
            setAttribute((prev) => ({
                ...prev,
                color: response.metadata.products[0]?.attributeValue,
            }));
            setCurrentProduct((prev) => ({
                ...prev,
                productItemId: response.metadata.products[0]?.skuid,
            }));
            setProducts(response.metadata.products);
            setImagesProducts(response.metadata.images);
            setCurrentImage(response.metadata?.products[0]?.image);
        }
    };
    useEffect(() => {
        if (attribute) {
            setCurrentProduct((prev) => ({
                ...prev,
                productItemId: products.filter(
                    (product) => product.attributeValue === attribute.color
                )[0]?.skuid,
                quantity: quantity,
            }));

            const matchedProduct = products.find(
                (product) => product?.attributeValue === attribute?.color
            );
            setCurrentProducts(matchedProduct);
            const quantityHTML = matchedProduct ? matchedProduct.quantity : 0;
            document.getElementById(
                "quantityDisplay"
            ).textContent = `${quantityHTML} sản phẩm có sẵn`;
        }
    }, [attribute, quantity]);
    // const fetchProducts = async () => {
    //     const response = await apiGetProducts({ category });
    //     if (response.success) setRelatedProducts(response.products);
    // };

    useEffect(() => {
        if (quantity >= currentProducts?.quantity) {
            setQuantity(currentProducts?.quantity);
        }
    }, [currentProducts]);

    const fetchVariations = async () => {
        const response = await apiGetVariations(params.title, params.category);
        if (response.status === 200) {
            setStorages(response.metadata.storages);
            setColors(response.metadata.colors);
            setInchs(response.metadata.inchs);

            console.log(response.metadata.sku[0].attributeValue);

            setAttribute((prev) => ({
                ...prev,
                storage: response.metadata.sku[0].attributeValue,
            }));
        }
    };
    useEffect(() => {
        if (pid) {
            fetchVariations();
            fetchProductData(params.title);

            // fetchProducts();
        }
        nameRef.current.scrollIntoView({ block: "center" });
    }, [pid]);

    useEffect(() => {
        if (pid) fetchProductData();
    }, [update]);
    const rerender = useCallback(() => {
        setUpdate(!update);
    }, [update]);

    const handleQuantity = useCallback(
        (number) => {
            if (!Number(number) || Number(number) < 1) {
                return;
            } else if (Number(number) >= currentProducts.quantity) {
                setQuantity(currentProducts.quantity);
            } else {
                setQuantity(number);
            }
        },
        [quantity]
    );
    const handleChangeQuantity = (flag) => {
        if (quantity >= currentProducts.quantity) {
            setQuantity(currentProducts.quantity);
            return;
        }
        if (flag === "minus" && quantity === 1) return;
        if (flag === "minus") setQuantity((prev) => +prev - 1);
        // if (flag === "plus" && quantity >= currentProducts.quantity) {
        //     setQuantity(currentProducts.quantity);
        //     return;
        // }
        if (flag === "plus") setQuantity((prev) => +prev + 1);
    };

    const updatedColor = colors.map((color) => ({
        ...color,
        isCommon: products.some(
            (product) => product.attributeValue === color.attributeValue
        ),
    }));

    const handleClickImage = (e, el) => {
        e.stopPropagation();
        setCurrentImage(el);
    };
    const handleAddToCart = async () => {
        if (!current)
            return Swal.fire({
                name: "Almost...",
                text: "Please login first!",
                icon: "info",
                cancelButtonText: "Not now!",
                showCancelButton: true,
                confirmButtonText: "Go login page",
            }).then(async (rs) => {
                if (rs.isConfirmed)
                    navigate({
                        pathname: `/${path.LOGIN}`,
                        search: createSearchParams({
                            redirect: location.pathname,
                        }).toString(),
                    });
            });
        const response = await addToCart(currentProduct);
        if (response.status === 201) {
            const carts = await getCartItems();
            dispatch(updateCart(carts));
        }
        if (response.status === 201) {
            toast.success(response.message);
            dispatch(getCurrent());
        } else toast.error(response.message);
        // console.log(currentProduct);
    };

    const handleChooseVariations = async (el) => {
        setAttribute((prev) => ({ ...prev, storage: el.attributeValue }));
        console.log(el);
        // Tách URL để lấy phần base URL
        const currentUrl = window.location.href;
        const urlParts = currentUrl.split("/");
        const baseUrl = urlParts.slice(0, urlParts.length - 1).join("/");
        // // Tạo URL mới với SKU đã chọn
        const newUrl = `${baseUrl}/${el.slug}`;

        window.location.href = newUrl;
    };

    return (
        <div className={clsx("w-full")}>
            {!isQuickView && (
                <div className="h-[81px] flex justify-center items-center bg-gray-100">
                    <div ref={nameRef} className="w-main">
                        <h3 className="font-semibold uppercase">
                            {currentProducts?.name}
                        </h3>
                        <Breadcrumb
                            title={currentProduct?.name}
                            category={category}
                        />
                    </div>
                </div>
            )}
            <div
                onClick={(e) => e.stopPropagation()}
                className={clsx(
                    "bg-white m-auto mt-4 flex",
                    isQuickView
                        ? "max-w-[900px] gap-16 p-8 max-h-[80vh] overflow-y-auto"
                        : "w-main"
                )}
            >
                <div
                    className={clsx(
                        "flex flex-col gap-4 w-2/5",
                        isQuickView && "w-1/2"
                    )}
                >
                    <div className="w-[458px] h-[458px] flex justify-center items-center relative">
                        <ReactImageMagnify
                            {...{
                                smallImage: {
                                    alt: "",
                                    isFluidWidth: false,
                                    width: 458,
                                    height: 458,
                                    src: currentImage,
                                },
                                largeImage: {
                                    src: currentImage,
                                    width: 458,
                                    height: 600,
                                },
                                enlargedImageContainerStyle: {
                                    zIndex: 999,
                                },
                                enlargedImageContainerDimensions: {
                                    width: "100%",
                                    height: "100%",
                                },
                                enlargedImagePosition: "beside",
                            }}
                        />
                    </div>

                    <div className="w-[458px]">
                        <Slider
                            className="image-slider grap-2 flex justify-start"
                            {...settings}
                        >
                            {/* currentProduct. */}
                            {/* {imageProducts?.length === 0 &&
                                imageProducts?.map((el, index) => (
                                    <div className="w-[80px]" key={index}>
                                        <img
                                            onClick={(e) =>
                                                handleClickImage(e, el.src)
                                            }
                                            src={el.src}
                                            alt="sub-product"
                                            className="w-[80px] cursor-pointer h-[80px] border object-cover"
                                        />
                                    </div>
                                ))} */}
                            {imageProducts?.length > 0 &&
                                imageProducts?.map((el, index) => (
                                    <div className="w-[80px]" key={index}>
                                        <img
                                            onClick={(e) =>
                                                handleClickImage(e, el.src)
                                            }
                                            src={el.src}
                                            alt="sub-product"
                                            className="w-[80px] cursor-pointer h-[80px] border object-cover"
                                        />
                                    </div>
                                ))}
                        </Slider>
                    </div>
                </div>
                <div
                    className={clsx(
                        "w-2/5 pr-[24px] flex flex-col gap-4",
                        isQuickView && "w-1/2"
                    )}
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-[30px] font-semibold">{`${formatMoney(
                            fotmatPrice(currentProducts?.price)
                        )} VNĐ`}</h2>
                        <span
                            className="text-sm text-main"
                            id="quantityDisplay"
                        ></span>
                    </div>
                    <div className="flex items-center gap-1">
                        {renderStarFromNumber(products?.totalRatings)?.map(
                            (el, index) => (
                                <span key={index}>{el}</span>
                            )
                        )}
                        <span className="text-sm text-main italic">{`(Đã bán: ${
                            products?.sold || 23
                        })`}</span>
                    </div>
                    {/* <ul className="list-square text-sm text-gray-500 pl-4">
                        {currentProducts?.desc?.length > 1 &&
                            products?.description?.map((el) => (
                                <li className="leading-6" key={el}>
                                    {el}
                                </li>
                            ))}
                        {products?.desc && (
                            <div
                                className="text-sm line-clamp-[10] mb-8"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        products?.description
                                    ),
                                }}
                            ></div>
                        )}
                    </ul> */}
                    {storages.length > 0 && (
                        <div className="my-4 flex gap-4">
                            <span className="font-bold">Cấu hình:</span>
                            <div className="flex flex-wrap gap-4 items-center w-full">
                                {storages?.map((el, index) => (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            handleChooseVariations(el, index)
                                        }
                                        className={clsx(
                                            "flex items-center gap-2 p-2 border cursor-pointer",
                                            attribute.storage ===
                                                el.attributeValue &&
                                                "border-red-500"
                                        )}
                                    >
                                        {/* <img
                                        src={el.thumbnail}
                                        alt="thumbnail"
                                        className="w-8 h-8 rounded-md object-cover"
                                    /> */}
                                        <span className="flex flex-col">
                                            <span>{el.attributeValue}</span>
                                            {/* <span className="text-sm">
                                            {el.originalPrice}
                                        </span> */}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {inchs.length > 0 && (
                        <div className="my-4 flex gap-4">
                            <span className="font-bold">Màn hình:</span>
                            <div className="flex flex-wrap gap-4 items-center w-full">
                                {inchs?.map((el, index) => (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            handleChooseVariations(el, index)
                                        }
                                        className={clsx(
                                            "flex items-center gap-2 p-2 border cursor-pointer",
                                            attribute.storage ===
                                                el.attributeValue &&
                                                "border-red-500"
                                        )}
                                    >
                                        {/* <img
                                        src={el.thumbnail}
                                        alt="thumbnail"
                                        className="w-8 h-8 rounded-md object-cover"
                                    /> */}
                                        <span className="flex flex-col">
                                            <span>{el.attributeValue}</span>
                                            {/* <span className="text-sm">
                                            {el.originalPrice}
                                        </span> */}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {colors.length > 0 && (
                        <div className="my-4 flex gap-4">
                            <span className="font-bold">Màu:</span>
                            <div className="flex flex-wrap gap-4 items-center w-full">
                                {updatedColor?.map((el, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setAttribute((prev) => ({
                                                ...prev,
                                                color: el.attributeValue,
                                            }))
                                        }
                                        className={clsx(
                                            "flex items-center gap-2 p-2 border cursor-pointer",
                                            attribute.color ===
                                                el.attributeValue &&
                                                "border-red-500",
                                            el.isCommon
                                                ? "common"
                                                : "text-gray-200 hover:cursor-not-allowed"
                                        )}
                                        disabled={!el.isCommon}
                                    >
                                        {/* <img
                                        src={el.thumbnail}
                                        alt="thumbnail"
                                        className="w-8 h-8 rounded-md object-cover"
                                    /> */}
                                        <span className="flex flex-col">
                                            <span>{el.attributeValue}</span>
                                            {/* <span className="text-sm">
                                            {el.originalPrice}
                                        </span> */}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Số lượng</span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                        <Button handleOnClick={handleAddToCart} fw>
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </div>
                {!isQuickView && (
                    <div className="w-1/5">
                        {productExtraInfomation.map((el) => (
                            <ProductExtraInfoItem
                                key={el.id}
                                title={el.title}
                                icon={el.icon}
                                sub={el.sub}
                            />
                        ))}
                    </div>
                )}
            </div>
            {!isQuickView && (
                <div className="w-main m-auto mt-8">
                    <ProductInfomation
                        socket={socket}
                        totalRatings={products?.totalRatings}
                        ratings={products?.ratings}
                        nameProduct={products?.title}
                        pid={products?.id}
                        rerender={rerender}
                    />
                </div>
            )}
            {!isQuickView && (
                <>
                    <div className="w-main m-auto mt-8">
                        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
                            OTHER CUSTOMER ALSO LIKED
                        </h3>
                        <CustomSlider
                            normal={true}
                            products={relatedProducts}
                        />
                    </div>
                    <div className="h-[100px] w-full"></div>
                </>
            )}
        </div>
    );
};

export default withBaseComponent(DetailProduct);
