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

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const images = [
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-timultra-22.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-vang-222.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-den-600.png",
];

const DetailProduct = ({ isQuickView, data, location, dispatch, navigate }) => {
    const nameRef = useRef();
    const params = useParams();
    const { current } = useSelector((state) => state.user);
    const [colors, setColors] = useState([]);
    const [colorItems, setColorItems] = useState([]);
    const [storages, setStorages] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentImage, setCurrentImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState(null);
    const [update, setUpdate] = useState(false);
    const [attribute, setAttribute] = useState({
        storage: null,
        color: null,
    });

    console.log(params);

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
            setCurrentImage(response.productData?.thumbnail);
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
            const quantityHTML = matchedProduct ? matchedProduct.quantity : 0;
            console.log(quantityHTML);
            document.getElementById(
                "quantityDisplay"
            ).textContent = `In stock: ${quantityHTML}`;
        }
    }, [attribute, quantity]);
    // const fetchProducts = async () => {
    //     const response = await apiGetProducts({ category });
    //     if (response.success) setRelatedProducts(response.products);
    // };
    const fetchVariations = async () => {
        const response = await apiGetVariations(params.title);
        if (response.status === 200) {
            setStorages(response.metadata.storages);
            setColors(response.metadata.colors);

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
            } else {
                setQuantity(number);
            }
        },
        [quantity]
    );
    const handleChangeQuantity = useCallback(
        (flag) => {
            if (flag === "minus" && quantity === 1) return;
            if (flag === "minus") setQuantity((prev) => +prev - 1);
            if (flag === "plus") setQuantity((prev) => +prev + 1);
        },
        [quantity]
    );

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
                        <h3 className="font-semibold">
                            {currentProduct.slug || products?.slug}
                        </h3>
                        <Breadcrumb
                            title={currentProduct.name || products?.name}
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
                                    src:
                                        currentImage ||
                                        `https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-den-1_1_3.png`,
                                },
                                largeImage: {
                                    src:
                                        currentImage ||
                                        `https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-den-1_1_3.png`,
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
                            className="image-slider flex gap-2 justify-between"
                            {...settings}
                        >
                            {/* currentProduct. */}
                            {images?.length === 0 &&
                                images?.map((el) => (
                                    <div className="flex-1" key={el}>
                                        <img
                                            onClick={(e) =>
                                                handleClickImage(e, el)
                                            }
                                            src={el}
                                            alt="sub-product"
                                            className="w-[143px] cursor-pointer h-[143px] border object-cover"
                                        />
                                    </div>
                                ))}
                            {images?.length > 0 &&
                                images?.map((el) => (
                                    <div className="flex-1" key={el}>
                                        <img
                                            onClick={(e) =>
                                                handleClickImage(e, el)
                                            }
                                            src={el}
                                            alt="sub-product"
                                            className="w-[143px] cursor-pointer h-[143px] border object-cover"
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
                            fotmatPrice(
                                currentProduct.originalPrice ||
                                    products[0]?.price
                            )
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
                        <span className="text-sm text-main italic">{`(Sold: ${
                            products?.sold || 23
                        } pieces)`}</span>
                    </div>
                    <ul className="list-square text-sm text-gray-500 pl-4">
                        {products?.description?.length > 1 &&
                            products?.description?.map((el) => (
                                <li className="leading-6" key={el}>
                                    {el}
                                </li>
                            ))}
                        {products?.description?.length === 1 && (
                            <div
                                className="text-sm line-clamp-[10] mb-8"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        products?.description[0]
                                    ),
                                }}
                            ></div>
                        )}
                    </ul>
                    <div className="my-4 flex gap-4">
                        <span className="font-bold">Storage:</span>
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
                    <div className="my-4 flex gap-4">
                        <span className="font-bold">Color:</span>
                        <div className="flex flex-wrap gap-4 items-center w-full">
                            {/* <div
                                onClick={() => setAttribute(null)}
                                className={clsx(
                                    "flex items-center gap-2 p-2 border cursor-pointer",
                                    !attribute && "border-red-500"
                                )}
                            >
                                <img
                                    src={product?.thumbnail}
                                    alt="thumbnail"
                                    className="w-8 h-8 rounded-md object-cover"
                                />
                                <span className="flex flex-col">
                                    <span>{product?.color}</span>
                                    <span className="text-sm">
                                        {product?.originalPrice}
                                    </span>
                                </span>
                            </div> */}
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
                                        attribute.color === el.attributeValue &&
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
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Quantity</span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                        <Button handleOnClick={handleAddToCart} fw>
                            Add to Cart
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
                        totalRatings={products?.totalRatings}
                        ratings={products?.ratings}
                        nameProduct={products?.title}
                        pid={products?._id}
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
