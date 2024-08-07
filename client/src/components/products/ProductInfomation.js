import React, { memo, useState, useCallback, useEffect } from "react";
import { productInfoTabs } from "../../ultils/contants";
import { Votebar, Button, VoteOption, Comment } from "..";
import { renderStarFromNumber } from "../../ultils/helpers";
import { apiRatings, getFeedbackApi } from "../../apis";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import Swal from "sweetalert2";
import path from "../../ultils/path";
import { useNavigate, useParams } from "react-router-dom";
import PaginationFeedback from "components/pagination/PaginationFeedback";

const ProductInfomation = ({ ratings, nameProduct, pid, rerender, socket }) => {
    const [activedTab, setActivedTab] = useState(1);
    const [feedbacks, setFeedback] = useState([]);
    const [totalRatings, setTotalRatings] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { isLoggedIn } = useSelector((state) => state.user);

    // const handleSubmitVoteOption = async ({ comment, score }) => {
    //     if (!comment || !pid || !score) {
    //         alert("Please vote when click submit");
    //         return;
    //     }
    //     await apiRatings({ star: score, comment, pid, updatedAt: Date.now() });
    //     dispatch(showModal({ isShowModal: false, modalChildren: null }));
    //     rerender();
    // };
    // const handleVoteNow = () => {
    //     if (!isLoggedIn) {
    //         Swal.fire({
    //             text: 'Login to vote',
    //             cancelButtonText: 'Cancel',
    //             confirmButtonText: 'Go login',
    //             title: 'Oops!',
    //             showCancelButton: true,
    //         }).then((rs) => {
    //             if (rs.isConfirmed) navigate(`/${path.LOGIN}`)
    //         })
    //     } else {
    //         dispatch(showModal({
    //             isShowModal: true, modalChildren: <VoteOption
    //                 nameProduct={nameProduct}
    //                 handleSubmitVoteOption={handleSubmitVoteOption}
    //             />
    //         }))
    //     }
    // };

    useState(() => {
        (async () => {
            const res = await getFeedbackApi(params.title);
            setFeedback(res.metadata);
        })();
    }, []);
    const limit = 4;

    // Function to paginate data
    const paginate = (data, page, limit) => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return data.slice(start, end);
    };

    // Example usage
    const paginatedData = paginate(feedbacks, currentPage, limit);

    useEffect(() => {
        socket?.on("serverComment", (msg) => {
            setFeedback((prev) => [{ ...msg }, ...prev]);
        });

        // Cleanup khi component unmount
        return () => {
            socket?.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        const totalStars = feedbacks.reduce(
            (sum, feedback) => sum + feedback.star,
            0
        );
        const count = feedbacks.length;
        const averageStar = totalStars / count;

        setTotalRatings(averageStar.toFixed(2));
    }, [feedbacks]);

    return (
        <div>
            <div className="flex items-center gap-2 relative bottom-[-1px]">
                {productInfoTabs.map((el) => (
                    <span
                        className={`py-2 px-4 cursor-pointer ${
                            activedTab === +el.id
                                ? "bg-white border border-b-0"
                                : "bg-gray-200"
                        }`}
                        key={el.id}
                        onClick={() => setActivedTab(el.id)}
                    >
                        {el.name}
                    </span>
                ))}
            </div>
            <div className="w-full border p-4 whitespace-pre-line">
                {productInfoTabs.some((el) => el.id === activedTab) &&
                    productInfoTabs.find((el) => el.id === activedTab)?.content}
            </div>

            <div className="flex flex-col py-8 w-main">
                <div className="flex border">
                    <div className="flex-4 flex-col flex items-center justify-center ">
                        <span className="font-semibold text-3xl">{`${
                            +totalRatings > 0 ? totalRatings : 0
                        }/5`}</span>
                        <span className="flex items-center gap-1">
                            {renderStarFromNumber(totalRatings)?.map(
                                (el, index) => (
                                    <span key={index}>{el}</span>
                                )
                            )}
                        </span>
                        <span className="text-sm">{`${feedbacks?.length} người đánh giá và phản hồi`}</span>
                    </div>
                    <div className="flex-6 flex gap-2 flex-col p-4">
                        {Array.from(Array(5).keys())
                            .reverse()
                            .map((el) => (
                                <Votebar
                                    key={el}
                                    number={el + 1}
                                    ratingTotal={feedbacks?.length}
                                    ratingCount={
                                        feedbacks?.filter(
                                            (i) => i.star === el + 1
                                        )?.length
                                    }
                                />
                            ))}
                    </div>
                </div>
                {/* <div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
                    <span>Do you review this product?</span>
                    <Button handleOnClick={handleVoteNow}>Vote now!</Button>
                </div> */}
                <div className="flex flex-col gap-4 pt-4">
                    {paginatedData?.map((el, index) => (
                        <Comment
                            key={index}
                            star={el?.star}
                            updatedAt={el?.createdAt}
                            comment={el?.content}
                            name={`${el?.user.lastName} ${el?.user.firstName}`}
                            avatar={el?.user.avatar}
                            images={el?.imageFeedbacks}
                        />
                    ))}
                    {feedbacks.length > 0 && (
                        <PaginationFeedback
                            currentPage={currentPage}
                            totalPages={Math.ceil(feedbacks.length / 4)}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(ProductInfomation);
