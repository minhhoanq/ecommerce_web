import { useEffect, useState } from "react";
import io from "socket.io-client";
import { formatMoney, getBase64 } from "ultils/helpers";
import { CiStar } from "react-icons/ci";
import { IoImagesOutline } from "react-icons/io5";
import Button from "components/buttons/Button";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showFeedback, showModal } from "store/app/appSlice";
import { useForm } from "react-hook-form";
import axios from "axios";
import { uploadImages } from "apis/image";
import Loading from "./Loading";
// import { FaStar } from "react-icons/fa6";

const SOCKET_SERVER_URL = "http://localhost:7000";

const InputFeedback = (props) => {
    const orderItem = props.item;
    const dispatch = useDispatch();
    const { current } = useSelector((state) => state.user);

    const [socket, setSocket] = useState();
    const [star, setStar] = useState(null);
    const [hover, setHover] = useState(null);
    const [preview, setPreview] = useState([]);
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
            images: null,
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
    const handlePreviewThumb = async () => {
        const formData = new FormData();
        const fileImages = watch("images"); // Assuming `watch` returns the list of selected files
        if (fileImages.length > 0) {
            for (let image of fileImages) {
                formData.append("files", image); // Append files to FormData with the key "files"
            }
        }

        const uploadInmage = await uploadImages(formData);
        let imagesArray = uploadInmage.metadata.map((el) => el.url);
        setPreview(imagesArray);
    };

    console.log(preview);
    useEffect(() => {
        if (watch("images") instanceof FileList && watch("images").length > 0)
            handlePreviewThumb();
    }, [watch("images")]);

    const handleFeedback = async (data) => {
        // const data = { star, comment };
        // setValue("star", star);
        data.userId = current.id;
        data.orderItemId = orderItem.id;
        data.images = preview;
        console.log(data);
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
        const createFeedback = await axios({
            url: "http://localhost:7000/api/v1/feedback",
            method: "post",
            data: {
                event: "CHECK_INFO_FEEDBACK",
                data: {
                    userId: data.userId,
                    orderItemId: data.orderItemId,
                    star: data.starValue,
                    content: data.comment,
                    images: data.images,
                },
            },
        });
        console.log(createFeedback);
        if (createFeedback.status === 201) {
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            dispatch(showFeedback({ item: null }));
            socket.emit("userComment", createFeedback.data.metadata);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleFeedback)}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-white h-[620px] w-[450px] p-4 flex flex-col rounded-sm">
                <h3 className="font-semibold">Đánh giá</h3>
                <div
                    className="flex justify-between items-start border-b py-2"
                    key={orderItem.id}
                >
                    <div className="">
                        <img className="h-[70px]" src={orderItem?.image} />
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
                        Đánh giá tổng thể
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
                        <span className="font-semibold">Thêm ảnh</span>
                        <p className="text-sm text-gray-500">
                            Người mua hàng nhận thấy hình ảnh hữu ích hơn chỉ có
                            văn bản
                        </p>
                        <input
                            id="images"
                            type="file"
                            {...register("images", {
                                required: true,
                            })}
                            className="hidden"
                            multiple
                        />
                        <label htmlFor="images" className="cursor-pointer">
                            {preview?.length > 0 ? (
                                <div className="flex space-x-2">
                                    {preview.map((el, index) => (
                                        <img
                                            key={index}
                                            src={el}
                                            alt="feedback"
                                            className="h-[100px] w-[100px] object-cover"
                                        />
                                    ))}
                                </div>
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
                        Thêm phản hồi bằng văn bản
                    </span>
                    <textarea
                        className="w-full h-[150px] border border-black outline-none rounded-sm p-2 text-sm mt-2"
                        placeholder="Bạn thích hay không thích điều gì? Bạn sử dụng sản phẩm này để làm gì?"
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
                        HỦY
                    </button>
                    <Button type="submit">XÁC NHẬN</Button>
                </div>
            </div>
        </form>
    );
};

export default InputFeedback;
