import React, { useEffect } from "react";
import {
    Sidebar,
    Banner,
    BestSeller,
    DealDaily,
    FeatureProducts,
    CustomSlider,
    Blogs,
    Product,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import icons from "../../ultils/icons";
import withBaseComponent from "hocs/withBaseComponent";
import { createSearchParams } from "react-router-dom";
import { getCartItems } from "apis";
import { updateCart } from "store/user/userSlice";

const { IoIosArrowForward } = icons;
const Home = ({ navigate }) => {
    const { newProducts } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.app);

    return (
        <div className="w-full px-4">
            <div className="md:w-main m-auto flex flex-col md:flex-row mt-6">
                <div className="flex flex-col gap-5 md:w-[25%] flex-auto">
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className="flex flex-col gap-5 md:pl-5 md:w-[75%] flex-auto">
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className="my-8 w-main m-auto">
                <FeatureProducts />
            </div>
            <div className="my-8 w-main m-auto">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
                    NEW ARRIVALS
                </h3>
                <div className="mt-4 hidden md:block mx-[-10px]">
                    <CustomSlider products={newProducts} />
                </div>
                <div className="mt-4 w-screen pr-4 -ml-2 md:hidden">
                    <div className="grid grid-cols-1 gap-4 w-full">
                        {newProducts?.map((el, index) => (
                            <div className="col-span-1" key={index}>
                                <Product
                                    pid={el.id}
                                    productData={el}
                                    isNew={true}
                                    normal={true}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="my-8 w-main m-auto">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
                    HOT COLLECTIONS
                </h3>
                <div className="w-screen lg:hidden pr-4">
                    {categories
                        ?.filter((el) => el.brands.length > 0)
                        ?.map((el) => (
                            <div key={el.id} className="col-span-1">
                                <div className="border w-full flex p-4 gap-4 min-h-[190px]">
                                    <img
                                        src={
                                            // el?.thumbnail |
                                            `https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-den-1_1_3.png`
                                        }
                                        alt=""
                                        className="w-1/2 flex-1 h-[129px] object-cover"
                                    />
                                    <div className="w-1/2 flex-1 text-gray-700">
                                        <h4 className="font-semibold uppercase">
                                            {el.name}
                                        </h4>
                                        <ul className="text-sm">
                                            {el?.brands?.map((item) => (
                                                <span
                                                    key={item}
                                                    className="flex cursor-pointer hover:underline gap-1 items-center text-gray-500"
                                                    onClick={() =>
                                                        navigate({
                                                            pathname: `/${el.name.toLowerCase()}`,
                                                            search: createSearchParams(
                                                                {
                                                                    brand: item,
                                                                }
                                                            ).toString(),
                                                        })
                                                    }
                                                >
                                                    <IoIosArrowForward
                                                        size={14}
                                                    />
                                                    <li>{item.name}</li>
                                                </span>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <div className="lg:grid hidden lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-4">
                    {categories
                        ?.filter((el) => el.brands.length > 0)
                        ?.map((el) => (
                            <div key={el.id} className="col-span-1">
                                <div className="border w-full flex p-4 gap-4 min-h-[190px]">
                                    <img
                                        src={el?.thumbnail}
                                        alt=""
                                        className="w-1/2 flex-1 h-[129px] object-contain"
                                    />
                                    <div className="w-1/2 flex-1 text-gray-700">
                                        <h4 className="font-semibold uppercase">
                                            {el.name}
                                        </h4>
                                        <ul className="text-sm">
                                            {el?.brands?.map((item) => (
                                                <span
                                                    key={item}
                                                    className="flex cursor-pointer hover:underline gap-1 items-center text-gray-500"
                                                    onClick={() =>
                                                        navigate({
                                                            pathname: `/${el.name.toLowerCase()}`,
                                                            search: createSearchParams(
                                                                {
                                                                    brand: item,
                                                                }
                                                            ).toString(),
                                                        })
                                                    }
                                                >
                                                    <IoIosArrowForward
                                                        size={14}
                                                    />
                                                    <li>{item.name}</li>
                                                </span>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {/* <div className="my-8 w-main m-auto">
                <Blogs />
            </div> */}
        </div>
    );
};

export default withBaseComponent(Home);
