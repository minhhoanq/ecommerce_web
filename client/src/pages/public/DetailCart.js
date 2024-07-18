import { Breadcrumb, Button } from "components";
import OrderItem from "components/products/OrderItem";
import withBaseComponent from "hocs/withBaseComponent";
import { useSelector } from "react-redux";
import { Link, createSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { formatMoney } from "ultils/helpers";
import path from "ultils/path";

const DetailCart = ({ location, navigate }) => {
    const { currentCart, current } = useSelector((state) => state.user);
    console.log(currentCart);
    const handleSubmit = () => {
        // if (!current?.address)
        //     return Swal.fire({
        //         icon: "info",
        //         title: "Almost!",
        //         text: "Please update your address before checkout.",
        //         showCancelButton: true,
        //         showConfirmButton: true,
        //         confirmButtonText: "Go update",
        //         cancelButtonText: "Cancel",
        //     }).then((result) => {
        //         if (result.isConfirmed)
        //             navigate({
        //                 pathname: `/${path.MEMBER}/${path.PERSONAL}`,
        //                 search: createSearchParams({
        //                     redirect: location.pathname,
        //                 }).toString(),
        //             });
        //     });
        // else
        navigate(`/${path.CHECKOUT}`, "_blank");
    };
    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="lg:w-main w-screen px-4 lg:px-0">
                    <h3 className="font-semibold uppercase">My Cart</h3>
                    <Breadcrumb
                        category={location?.pathname
                            ?.replace("/", "")
                            ?.split("-")
                            ?.join(" ")}
                    />
                </div>
            </div>
            <div className="flex flex-col border lg:w-main mx-auto my-8">
                <div className="w-full mx-auto bg-gray-200  font-bold py-3 grid grid-cols-10">
                    <span className="col-span-6 w-full text-center">
                        {/* Products */}
                    </span>
                    <span className="col-span-1 w-full text-left">
                        Quantity
                    </span>
                    <span className="col-span-3 w-full text-center">Price</span>
                </div>
                {currentCart?.map((el) => (
                    <OrderItem
                        key={el.id}
                        dfQuantity={el.quantity}
                        attributes={el.attributes}
                        name={el.name}
                        // thumbnail={el.thumbnail}
                        salePrice={el.price}
                        id={el?.id}
                    />
                ))}
            </div>
            <div className="lg:w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3">
                <span className="flex items-center gap-8 ">
                    <span className="text-sm font-semibold">Subtotal:</span>
                    <span className="text-main font-bold text-xl">{`${formatMoney(
                        currentCart?.reduce(
                            (sum, el) => +el?.price * el.quantity + sum,
                            0
                        )
                    )} VND`}</span>
                </span>
                <span className="text-sm italic text-gray-400">
                    Shipping, taxes, and discounts calculated at checkout
                </span>

                <div className="flex space-x-2 text-sm">
                    <Button
                        style={`bg-black px-4 py-2 rounded-none text-white flex items-center justify-center text-semibold my-2 hover:bg-main`}
                        handleOnClick={handleSubmit}
                    >
                        Update cart
                    </Button>
                    <Button handleOnClick={handleSubmit}>CHECKOUT</Button>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(DetailCart);
