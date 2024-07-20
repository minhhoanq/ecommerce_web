import { useEffect, useState } from "react";
import io from "socket.io-client";
import { formatMoney, getBase64 } from "ultils/helpers";
import { CiStar } from "react-icons/ci";
import { IoImagesOutline } from "react-icons/io5";
import Button from "components/buttons/Button";
import moment from "moment";
import { useDispatch } from "react-redux";
import { showModal } from "store/app/appSlice";
import { useForm } from "react-hook-form";
// import { FaStar } from "react-icons/fa6";

const SOCKET_SERVER_URL = "http://localhost:7000";

const InputFeedback = (props) => {
    const orderItem = props.item;
    const dispatch = useDispatch();

    const [socket, setSocket] = useState();
    const [star, setStar] = useState(null);
    const [hover, setHover] = useState(null);
    const [preview, setPreview] = useState({
        images: null,
        // images: [],
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            starValue: 0,
            comment: "",
            images: "",
        },
    });

    // const user = useSelector((state) => state.auth?.currentUser);
    // const accessToken = user?.token;

    // const handleSubmitRating = async(e) => {

    //     const createRating = await createRatingProduct(accessToken, product.slug, star, comment);
    //     console.log(createRating);
    // }

    // const handleDeleteRating = async() => {
    //     const deleteRating = await deleteRatingProduct(accessToken, product.slug);
    //     console.log(deleteRating);
    // }

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
        });

        setSocket(socket);

        socket.emit("joinRoom", orderItem.slug);

        return () => socket.disconnect();
    }, []);

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file);
        setPreview((prev) => ({ ...prev, images: base64Thumb }));
    };

    useEffect(() => {
        if (watch("images") instanceof FileList && watch("images").length > 0)
            handlePreviewThumb(watch("images")[0]);
    }, [watch("images")]);

    const handleFeedback = (data) => {
        // const data = { star, comment };
        // setValue("star", star);
        console.log(data);
        socket.emit("userComment", data);
    };

    return (
        <form onSubmit={handleSubmit(handleFeedback)}>
            <div className="bg-white h-[620px] w-[450px] p-4 flex flex-col rounded-sm">
                <h3 className="font-semibold">Feedback</h3>
                <div
                    className="flex justify-between items-start border-b py-2"
                    key={orderItem.id}
                >
                    <div className="">
                        <img
                            className="h-[70px]"
                            src="https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-den-1_1_3.png"
                        />
                    </div>
                    <div className="text-left ">
                        <div className="flex-col">
                            <span>{orderItem.productName}</span>
                            <p className="text-sm">
                                {orderItem.attributes?.color} |{" "}
                                {orderItem.attributes?.ram}
                            </p>
                        </div>
                    </div>
                    <div className="w-[100px] text-left">
                        {moment(orderItem.createdAt)?.format(
                            "DD/MM/YYYY hh:mm:ss"
                        )}
                    </div>
                </div>
                <div className="w-full h-max flex items-center justify-between border-b pt-2 pb-2">
                    <div className="flex items-center font-semibold">
                        Overall rating
                    </div>
                    <div className="flex">
                        {[...Array(5)].map((item, index) => {
                            const currentRating = index + 1;
                            return (
                                <label
                                    className="flex items-center cursor-pointer"
                                    key={index}
                                >
                                    <input
                                        key={index}
                                        type="radio"
                                        name="rating"
                                        id="starValue"
                                        {...register("starValue", {
                                            required: true,
                                        })}
                                        value={currentRating}
                                        onClick={() => setStar(currentRating)}
                                    />
                                    <CiStar
                                        size={30}
                                        style={{
                                            backgroundColor:
                                                currentRating <= (hover || star)
                                                    ? "#FFA500"
                                                    : "transparent",
                                            color:
                                                currentRating <= (hover || star)
                                                    ? "#FFFFFF"
                                                    : "#999999",
                                            borderRadius: "50%", // Để làm cho nền background là hình tròn
                                            padding: "5px", // Khoảng cách giữa icon và background
                                        }}
                                        onMouseEnter={() =>
                                            setHover(currentRating)
                                        }
                                        onMouseLeave={() => setHover(null)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>
                <div className="w-full flex items-center border-b pt-2 pb-4">
                    <div className="flex flex-col items-start space-y-2">
                        <span className="font-semibold">
                            Add a photo or video
                        </span>
                        <p className="text-sm text-gray-500">
                            Shoppers find images and videos more helpful than
                            text alone
                        </p>
                        <input
                            id="images"
                            type="file"
                            {...register("images", {
                                required: true,
                            })}
                            className="hidden"
                        />
                        <label htmlFor="images" className="cursor-pointer">
                            {preview?.images ? (
                                <img
                                    src={preview?.images}
                                    alt="feedback"
                                    className="h-[100px] w-[100px] object-cover"
                                />
                            ) : (
                                <div className="h-[100px] w-[100px] border-2 border-dashed border-gray-400 flex justify-center items-center">
                                    <IoImagesOutline
                                        size={50}
                                        color="#9ca3af"
                                    />
                                </div>
                            )}
                        </label>
                    </div>
                </div>
                <div className="mt-2">
                    <span className="font-semibold">
                        Add a written feedback
                    </span>
                    <textarea
                        className="w-full h-[150px] border border-black outline-none rounded-sm p-2 text-sm mt-2"
                        placeholder="What did you like or dislike? What did you use this product for?"
                        id="comment"
                        {...register("comment", {
                            required: true,
                        })}
                        // onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <div className="mt-2 mb-2 flex justify-end items-center space-x-4">
                    <button
                        className="border border-main px-4 py-2 h-[40px] text-main hover:bg-red-50 flex justify-end items-center"
                        onClick={() =>
                            dispatch(
                                showModal({
                                    isShowModal: false,
                                    modalChildren: null,
                                })
                            )
                        }
                    >
                        Cancle
                    </button>
                    <Button type="submit">Submit</Button>
                </div>
            </div>
        </form>
    );
};

export default InputFeedback;
