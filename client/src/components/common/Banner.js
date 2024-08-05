import React, { memo } from "react";

const Banner = () => {
    return (
        <div className="w-full h-[500px]">
            <img
                src="https://digital-world-2.myshopify.com/cdn/shop/files/slideshow3-home2_1920x.jpg?v=1613166679"
                alt="banner"
                className="md:h-[500px] w-full md:object-cover object-contain h-[500px]"
            />
        </div>
    );
};

export default memo(Banner);
