import { useEffect, useState } from "react";
import io from "socket.io-client";
import { formatMoney } from "ultils/helpers";
import { CiStar } from "react-icons/ci";

const SOCKET_SERVER_URL = "http://localhost:7000";

const InputFeedback = (props) => {
    const orderItem = props.item;
    const [socket, setSocket] = useState();
    const [comment, setComment] = useState("");
    const [star, setStar] = useState(null);
    const [hover, setHover] = useState(null);
    const reviews = props.reviews;
    const product = props.product;
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

        return () => socket.disconnect();
    }, []);

    return (
        <div className="bg-white h-[400px] w-[600px] p-4">
            <div className="flex justify-between my-2" key={orderItem.id}>
                <div>
                    <img
                        className="h-[70px]"
                        src="https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-den-1_1_3.png"
                    />
                </div>
                <div className="text-left p-2">
                    <div className="flex-col">
                        <span>{orderItem.productName}</span>
                        <p className="text-sm">
                            {orderItem.attributes?.color} |{" "}
                            {orderItem.attributes?.ram}
                        </p>
                    </div>
                </div>
                <div className="text-center p-2">x {orderItem.quantity}</div>
                <div className="text-right p-2">
                    {formatMoney(orderItem.price) + " VND"}
                </div>
            </div>

            <div className="w-full h-[60px] flex items-center">
                <div className="flex items-center">Review</div>
                {[...Array(5)].map((item, index) => {
                    const currentRating = index + 1;
                    return (
                        <label className="flex items-center">
                            <input
                                key={index}
                                type="radio"
                                name="rating"
                                value={currentRating}
                                onClick={() => setStar(currentRating)}
                            />
                            <CiStar size={50} color="#FFD700" />
                        </label>
                    );
                })}
            </div>
            <textarea className="w-full" placeholder="comment" />
        </div>
    );
};

export default InputFeedback;
