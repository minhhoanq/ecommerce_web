import React, { useEffect, useState, useCallback } from "react";
import {
    useParams,
    useSearchParams,
    createSearchParams,
    useNavigate,
    useLocation,
} from "react-router-dom";
import {
    Breadcrumb,
    Product,
    SearchItem,
    InputSelect,
    Pagination,
} from "../../components";
import { apiGetCategory, apiGetProducts, apiSearchProducts } from "../../apis";
import Masonry from "react-masonry-css";
import { sorts } from "../../ultils/contants";

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
};

const Products = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    const [categoryBrands, setCategoryBrands] = useState(null);
    const [brand, setBrand] = useState(null);
    const [price, setPrice] = useState({
        from: "",
        to: "",
    });
    const [activeClick, setActiveClick] = useState(null);
    const [params] = useSearchParams();
    const [sortPrice, setSortPrice] = useState("");
    const { category } = useParams();

    const fetchProductsByCategory = async (queries) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString(),
        });
        queries.limit = 8;

        const response = await apiSearchProducts(queries);
        console.log(response);
        if (response.status === 200) {
            setProducts(response?.metadata.result);
            setCount(response?.metadata.total);
        }
    };

    useEffect(() => {
        (async () => {
            const data =
                category?.charAt(0).toLocaleUpperCase() + category?.slice(1);
            console.log(data);
            const res = await apiGetCategory(data);
            setCategoryBrands(res?.metadata?.categories[0]);
        })();
    }, []);

    useEffect(() => {
        console.log("params");

        if (category && category !== "products") {
            params.set("category", category);
            params.delete("brand");
        }
        if (brand && brand !== "products") {
            params.set("brand", brand);
        }
        if (!category || category === "products") {
            params.delete("category");
            params.delete("brand");
        }

        const queries = Object.fromEntries([...params]);

        // if (price.from !== "" && price.to !== "") {
        //     queries.minPrice = price.from;
        //     queries.maxPrice = price.to;
        // }

        // delete queries.to;
        // delete queries.from;
        const q = { ...queries };
        fetchProductsByCategory(q);
        window.scrollTo(0, 0);
    }, [params, brand, price, category, sortPrice]);

    const changeActiveFitler = useCallback(
        (name) => {
            if (activeClick === name) setActiveClick(null);
            else setActiveClick(name);
        },
        [activeClick]
    );

    const changeValue = (value) => {
        setSortPrice(value);
        params.set("sortPrice", value);
        window.scrollTo(0, 0);
    };

    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="lg:w-main w-screen px-4 lg:px-0">
                    <h3 className="font-semibold uppercase">
                        {category || "Sản phẩm"}
                    </h3>
                    <Breadcrumb category={category} />
                </div>
            </div>
            <div className="h-[81px] flex justify-center items-center">
                <div className="lg:w-main w-screen px-4 lg:px-0 text-black flex space-x-2">
                    {category &&
                        category !== "products" &&
                        categoryBrands &&
                        categoryBrands?.brands.map((el, index) => (
                            <div
                                key={index}
                                className="border p-2 cursor-pointer"
                                onClick={() => {
                                    setBrand(el.name);
                                    params.set("page", 1);
                                }}
                            >
                                {el.name}
                            </div>
                        ))}
                </div>
            </div>
            <div className="lg:w-main border p-4 flex lg:pr-4 pr-8 flex-col md:flex-row gap-4 md:justify-between mt-2 m-auto">
                <div className="w-4/5 flex-auto flex flex-col gap-3">
                    <span className="font-semibold text-sm">Lọc theo</span>
                    <div className="flex items-center gap-4">
                        <SearchItem
                            setPriceChange={(el) =>
                                setPrice({
                                    from: el.from,
                                    to: el.to,
                                })
                            }
                            name="Khoảng giá"
                            activeClick={activeClick}
                            changeActiveFitler={changeActiveFitler}
                            type="input"
                        />
                        {/* <SearchItem
                            name="color"
                            activeClick={activeClick}
                            changeActiveFitler={changeActiveFitler}
                        /> */}
                    </div>
                </div>
                <div className="w-1/5 flex flex-col gap-3">
                    <span className="font-semibold text-sm">Sắp xếp theo</span>
                    <div className="w-full">
                        <InputSelect
                            changeValue={changeValue}
                            value={sortPrice}
                            options={sorts}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-8 w-main m-auto grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4">
                {products.length > 0 ? (
                    products?.map((el) => (
                        <Product
                            key={el.id}
                            pid={el.id}
                            productData={el}
                            normal={true}
                        />
                    ))
                ) : (
                    <>Not found products</>
                )}
            </div>
            <div className="w-main m-auto my-4 flex justify-end">
                <Pagination totalCount={count || 10} />
            </div>
            <div className="w-full h-[50px]"></div>
        </div>
    );
};

export default Products;
