import React, { memo } from "react";
import avatar from "assets/avatarDefault.png";
import moment from "moment";
import { renderStarFromNumber } from "ultils/helpers";

const Comment = ({
    image = avatar,
    name = "Anonymous",
    updatedAt = Date.now,
    comment,
    star,
    images,
}) => {
    return (
        <div className="flex gap-4">
            <div className="flex-none">
                <img
                    src={image}
                    alt="avatar"
                    className="w-[25px] h-[25px] object-cover rounded-full"
                />
            </div>
            <div className="flex flex-col flex-auto">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{name}</h3>
                    <span className="text-xs italic">
                        {moment(updatedAt)?.fromNow()}
                    </span>
                </div>
                <div className="flex flex-col gap-2 pl-4 text-sm mt-4 border border-gray-300 py-2 bg-gray-100">
                    <span className=" flex items-center gap-1">
                        <span className="flex items-center gap-1">
                            {renderStarFromNumber(star)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}
                        </span>
                    </span>
                    <span className=" flex gap-1">
                        <span className="flex items-center gap-1 text-gray-500 text-xs">
                            {moment(updatedAt)?.format("DD/MM/YYYY hh:mm")}
                        </span>
                    </span>
                    <span className=" flex gap-1">
                        {/* <span className="font-semibold">Comment:</span> */}
                        <span className="flex items-center gap-1">
                            {comment}
                        </span>
                    </span>
                    <div className="flex space-x-2">
                        {images.map((image, index) => (
                            <img
                                className="h-[100px] w-[100px] object-cover"
                                src={image.src}
                                key={index}
                                alt="feedback"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Comment);
