import React, { memo } from "react";
import icons from "ultils/icons";

const { MdEmail } = icons;
const Footer = () => {
    return (
        <div className="w-full">
            <div className="h-[103px] w-full bg-main flex items-center py-4 justify-center">
                <div className="w-main flex items-center flex-col lg:flex-row justify-center lg:justify-between">
                    <div className="flex flex-col flex-1">
                        <span className="text-[20px] text-gray-100">
                            ĐĂNG KÝ BẢN TIN
                        </span>
                        <small className="text-[13px] text-gray-300">
                            Đăng ký ngay và nhận bản tin hàng tuần
                        </small>
                    </div>
                    <div className="flex-1 flex items-center">
                        <input
                            className="p-4 pr-0 rounded-l-full w-full bg-[#F04646] outline-none text-gray-100 placeholder:text-sm placeholder:text-gray-200 placeholder:italic placeholder:opacity-50"
                            type="text"
                            placeholder="Địa chỉ email"
                        />
                        <div className="h-[56px] w-[56px] bg-[#F04646] rounded-r-full flex items-center justify-center text-white">
                            <MdEmail size={18} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:h-[407px] w-full bg-gray-900 flex items-center justify-center text-white text-[13px]">
                <div className="lg:w-main lg:flex-grow-0 flex">
                    <div className="flex-2 flex flex-col gap-2">
                        <h3 className="mb-[20px] mt-8 text-[15px] font-medium border-l-2 border-main pl-[15px]">
                            VỀ CHÚNG TÔI
                        </h3>
                        <span>
                            <span>Địa chỉ: </span>
                            <span className="opacity-70">
                                Thành phố Hồ Chí Minh
                            </span>
                        </span>
                        <span>
                            <span>Số điện thoại: </span>
                            <span className="opacity-70">(+1234)56789xxx</span>
                        </span>
                        <span>
                            <span>Mail: </span>
                            <span className="opacity-70">
                                mh.tranminhhoang@gmail.com
                            </span>
                        </span>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <h3 className="mb-[20px] mt-8 text-[15px] font-medium border-l-2 border-main pl-[15px]">
                            THÔNG TIN
                        </h3>
                        <span>Kiểu chữ</span>
                        <span>Phòng trưng bày</span>
                        <span>Vị trí cửa hàng</span>
                        <span>Ưu đãi hôm nay</span>
                        <span>Liên hệ</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <h3 className="mb-[20px] mt-8 text-[15px] font-medium border-l-2 border-main pl-[15px]">
                            CHÚNG TA LÀ AI
                        </h3>
                        <span>Hỗ trợ</span>
                        <span>Miễn phí vận chuyển</span>
                        <span>Hỏi đáp</span>
                        <span>Hoàn trả & Đổi trả</span>
                        <span>Giấy phép kinh doanh</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <h3 className="mb-[20px] mt-8 text-[15px] font-medium border-l-2 border-main pl-[15px]">
                            #DIGITALWORLDSTORE
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Footer);
