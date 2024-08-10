import React, { useCallback, useEffect, useState } from "react";
import { CustomizeVarriants, InputForm, Pagination } from "components";
import { useForm } from "react-hook-form";
import {
    apiGetProducts,
    apiDeleteProduct,
    apiGetProductsManager,
} from "apis/product";
import moment from "moment";
import {
    useSearchParams,
    createSearchParams,
    useNavigate,
    useLocation,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import UpdateProduct from "./UpdateProduct";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BiEdit, BiCustomize } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { formatMoney } from "ultils/helpers";

const ManageProducts = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [params] = useSearchParams();
    const {
        register,
        formState: { errors },
        watch,
    } = useForm();
    const [products, setProducts] = useState(null);
    const [counts, setCounts] = useState(0);
    const [editProduct, setEditProduct] = useState(null);
    const [update, setUpdate] = useState(false);
    const [customizeVarriant, setCustomizeVarriant] = useState(null);
    const [showProductDetail, setShowProductDetail] = useState({
        open: false,
        productId: 0,
    });

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const fetchProducts = async (params) => {
        const response = await apiGetProductsManager({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        if (response.status === 200) {
            setCounts(response.metadata.length);
            setProducts(response.metadata);
        }
    };
    const queryDecounce = useDebounce(watch("q"), 800);
    useEffect(() => {
        if (queryDecounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queryDecounce }).toString(),
            });
        } else
            navigate({
                pathname: location.pathname,
            });
    }, [queryDecounce]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        fetchProducts(searchParams);
    }, [params, update]);

    const handleDeleteProduct = (pid) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure remove this product",
            icon: "warning",
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const response = await apiDeleteProduct(pid);
                if (response.success) toast.success(response.mes);
                else toast.error(response.mes);
                render();
            }
        });
    };

    console.log(showProductDetail);

    return (
        <div className="w-full flex flex-col gap-4 relative">
            {editProduct && (
                <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
                    <UpdateProduct
                        editProduct={editProduct}
                        render={render}
                        setEditProduct={setEditProduct}
                    />
                </div>
            )}
            {customizeVarriant && (
                <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
                    <CustomizeVarriants
                        customizeVarriant={customizeVarriant}
                        render={render}
                        setCustomizeVarriant={setCustomizeVarriant}
                    />
                </div>
            )}
            <div className="h-[69px] w-full"></div>
            <div className="p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0">
                <h1 className="text-xl font-bold tracking-tight mt-2">
                    QUẢN LÍ SẢN PHẨM
                </h1>
            </div>
            <div className="flex justify-end items-center px-4">
                <form className="w-[45%]">
                    <InputForm
                        id="q"
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder="Search products by title, description,..."
                    />
                </form>
            </div>
            <table className="table-auto">
                <thead>
                    <tr className="border bg-sky-900 text-white border-white">
                        <th className="text-center py-2">#</th>
                        <th className="text-center py-2">Ảnh</th>
                        <th className="text-center py-2">Tên</th>
                        <th className="text-center py-2">Thể loại</th>
                        <th className="text-center py-2">Thương hiệu</th>
                        <th className="text-center py-2">Ngày tạo</th>
                        <th className="text-center py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((el, idx) => (
                        <React.Fragment>
                            <tr className="border-b" key={el._id}>
                                <td className="text-center py-2">
                                    {(+params.get("page") > 1
                                        ? +params.get("page") - 1
                                        : 0) *
                                        process.env.REACT_APP_LIMIT +
                                        idx +
                                        1}
                                </td>
                                <td className="text-center py-2">
                                    <img
                                        src={el.image}
                                        alt="thumb"
                                        className="w-12 h-12 object-cover"
                                    />
                                </td>
                                <td className="text-center py-2">{el.name}</td>
                                <td className="text-center py-2">
                                    {el?.categorybrand.category.name}
                                </td>
                                <td className="text-center py-2">
                                    {el?.categorybrand.brand.name}
                                </td>

                                <td className="text-center py-2">
                                    {moment(el.createdAt).format("DD/MM/YYYY")}
                                </td>
                                <td className="text-center py-2">
                                    {/* <span
                                        onClick={() => setEditProduct(el)}
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1"
                                    >
                                        <BiEdit size={20} />
                                    </span>
                                    <span
                                        onClick={() =>
                                            handleDeleteProduct(el._id)
                                        }
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1"
                                    >
                                        <RiDeleteBin6Line size={20} />
                                    </span> */}
                                    <span
                                        onClick={() =>
                                            setShowProductDetail({
                                                open: !showProductDetail.open,
                                                productId: el.id,
                                            })
                                        }
                                        className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1"
                                    >
                                        <BiCustomize size={20} />
                                    </span>
                                </td>
                            </tr>
                            <tr className="w-full">
                                <td
                                    colSpan={"5"}
                                    className={`${
                                        showProductDetail.open === true &&
                                        showProductDetail.productId === el.id
                                            ? ""
                                            : "hidden"
                                    } w-full`}
                                >
                                    <div className="p-4 border-b-2 w-full">
                                        {el?.skus &&
                                            el?.skus?.map((item, index) => (
                                                <div
                                                    className="flex justify-between my-2 w-full"
                                                    key={index}
                                                >
                                                    <div className="w-[200px]">
                                                        <img
                                                            className="h-[70px]"
                                                            src={el?.image}
                                                        />
                                                    </div>
                                                    <div className="text-left p-2  flex-1">
                                                        <div className="flex-col">
                                                            <span>
                                                                {item.name}
                                                            </span>
                                                            {item.attributes
                                                                .ram && (
                                                                <p className="text-sm">
                                                                    {
                                                                        item
                                                                            .attributes
                                                                            .ram
                                                                    }
                                                                </p>
                                                            )}
                                                            {item.attributes
                                                                .inch && (
                                                                <p className="text-sm">
                                                                    {
                                                                        item
                                                                            .attributes
                                                                            .inch
                                                                    }
                                                                </p>
                                                            )}
                                                            {item.attributes
                                                                .color && (
                                                                <p className="text-sm">
                                                                    {
                                                                        item
                                                                            .attributes
                                                                            .color
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-center p-2">
                                                        x {item.quantity}
                                                    </div>
                                                    <div className="text-right p-2 w-[200px]">
                                                        {formatMoney(
                                                            item.prices[0].price
                                                        ) + " VND"}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <div className="w-full flex justify-end my-8">
                <Pagination totalCount={counts} />
            </div>
        </div>
    );
};

export default ManageProducts;
