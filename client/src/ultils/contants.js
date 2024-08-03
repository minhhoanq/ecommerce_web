import path from "./path";
import icons from "./icons";

export const navigation = [
    {
        id: 1,
        value: "TRANG CHỦ",
        path: `/${path.HOME}`,
    },
    {
        id: 2,
        value: "SẢN PHẨM",
        path: `/${path.PRODUCTS}`,
    },
    {
        id: 3,
        value: "BLOGS",
        path: `/${path.BLOGS}`,
    },
    {
        id: 4,
        value: "DỊCH VỤ CỦA CHÚNG TÔI",
        path: `/${path.OUR_SERVICES}`,
    },
    {
        id: 5,
        value: "HỎI ĐÁP",
        path: `/${path.FAQ}`,
    },
];
const { RiTruckFill, BsShieldShaded, BsReplyFill, FaTty, AiFillGift } = icons;
export const productExtraInfomation = [
    {
        id: "1",
        title: "Guarantee",
        sub: "Quality Checked",
        icon: <BsShieldShaded />,
    },
    {
        id: "2",
        title: "Free Shipping",
        sub: "Free On All Products",
        icon: <RiTruckFill />,
    },
    {
        id: "3",
        title: "Special Gift Cards",
        sub: "Special Gift Cards",
        icon: <AiFillGift />,
    },
    {
        id: "4",
        title: "Free Return",
        sub: "Within 7 Days",
        icon: <BsReplyFill />,
    },
    {
        id: "5",
        title: "Consultancy",
        sub: "Lifetime 24/7/356",
        icon: <FaTty />,
    },
];

export const productInfoTabs = [
    {
        id: 1,
        name: "THÔNG TIN",
        content: `Technology: GSM / HSPA / LTE
        Dimensions: 153.8 x 75.5 x 7.6 mm
        Weight: 154 g
        Display: IPS LCD 5.5 inches
        Resolution: 720 x 1280
        OS: Android OS, v6.0 (Marshmallow)
        Chipset: Octa-core
        CPU: Octa-core
        Internal: 32 GB, 4 GB RAM
        Camera: 13MB - 20 MP`,
    },
    {
        id: 2,
        name: "BẢO HÀNH",
        content: `THÔNG TIN BẢO HÀNH GIỚI HẠN BẢO HÀNH 
        Hạn chế Bảo hành không được chuyển nhượng. 
        Các Bảo hành có giới hạn sau đây được cung cấp cho người mua bán lẻ ban đầu của Ashley Furniture Industries, Inc. 
        Các sản phẩm sau: Khung được sử dụng trong các sản phẩm bọc và da Bảo hành trọn đời có giới hạn Bảo hành có giới hạn trọn đời áp dụng cho tất cả các khung được sử dụng trong ghế sofa, ghế dài, ghế tình yêu, bọc nệm ghế, ghế dài có đệm, mặt cắt và giường ngủ. 
        Ashley Furniture Industries, Inc. đảm bảo các thành phần này cho bạn, người mua lẻ ban đầu, không có lỗi sản xuất vật liệu`,
    },
    {
        id: 3,
        name: "VẬN CHUYỂN",
        content: `MUA VÀ GIAO HÀNG 
        Trước khi mua hàng, bạn nên biết số đo của khu vực bạn dự định đặt đồ nội thất.
        Bạn cũng nên đo bất kỳ ô cửa và hành lang nào mà đồ đạc sẽ đi qua để đến đích cuối cùng. 
        Việc nhận hàng tại cửa hàng Shopify Shop yêu cầu tất cả các sản phẩm đều phải được kiểm tra kỹ lưỡng TRƯỚC KHI bạn mang về nhà để đảm bảo không có bất ngờ nào xảy ra. 
        Nhóm của chúng tôi sẵn lòng mở tất cả các gói hàng và sẽ hỗ trợ trong quá trình kiểm tra. 
        Sau đó chúng tôi sẽ niêm phong lại các gói hàng để vận chuyển an toàn. 
        Chúng tôi khuyến khích tất cả khách hàng mang theo đệm hoặc chăn để bảo vệ đồ đạc trong quá trình vận chuyển cũng như dây thừng hoặc dây buộc. Shopify Shop sẽ không chịu trách nhiệm về những hư hỏng xảy ra sau khi rời khỏi cửa hàng hoặc trong quá trình vận chuyển. 
        Trách nhiệm của người mua là đảm bảo rằng các mặt hàng chính xác được nhận và ở trong tình trạng tốt. Giao hàng Khách hàng có thể chọn ngày giao hàng tiếp theo phù hợp nhất với lịch trình của họ. Tuy nhiên, để định tuyến các điểm dừng hiệu quả nhất có thể, Shopify Shop sẽ cung cấp khung thời gian. 
        Khách hàng sẽ không được chọn thời gian. Bạn sẽ được thông báo trước khung thời gian dự kiến ​​của bạn. Vui lòng đảm bảo rằng một người lớn có trách nhiệm (18 tuổi trở lên) sẽ có mặt ở nhà vào thời điểm đó. Để chuẩn bị cho việc giao hàng, vui lòng loại bỏ đồ nội thất, tranh ảnh, gương, phụ kiện, v.v. hiện có để tránh hư hỏng. 
        Đồng thời, hãy đảm bảo rằng khu vực bạn muốn đặt đồ đạc không có bất kỳ đồ nội thất cũ nào và bất kỳ vật dụng nào khác có thể cản trở lối đi của đội giao hàng. Shopify Shop sẽ giao hàng, lắp ráp và sắp xếp việc mua đồ nội thất mới của bạn cũng như loại bỏ tất cả vật liệu đóng gói khỏi nhà bạn. Đội ngũ giao hàng của chúng tôi không được phép di chuyển đồ đạc hiện có của bạn hoặc các đồ gia dụng khác. 
        Nhân viên giao hàng sẽ cố gắng giao các mặt hàng đã mua một cách an toàn và có kiểm soát nhưng sẽ không cố gắng đặt đồ đạc nếu họ cảm thấy việc đó sẽ dẫn đến hư hỏng sản phẩm hoặc nhà của bạn. Nhân viên giao hàng không thể tháo cửa, nâng đồ đạc hoặc mang đồ đạc lên hơn 3 tầng cầu thang. 
        Phải có thang máy để giao hàng từ tầng 4 trở lên.`,
    },
    {
        id: 4,
        name: "THANH TOÁN",
        content: `Khách hàng có thể chọn ngày giao hàng tiếp theo phù hợp nhất với lịch trình của họ. 
        Tuy nhiên, để định tuyến các điểm dừng hiệu quả nhất có thể, Shopify Shop sẽ cung cấp khung thời gian. 
        Khách hàng sẽ không được chọn thời gian. 
        Bạn sẽ được thông báo trước khung thời gian dự kiến ​​của bạn. 
        Vui lòng đảm bảo rằng một người lớn có trách nhiệm (18 tuổi trở lên) sẽ có mặt ở nhà vào thời điểm đó. 
        Để chuẩn bị cho việc giao hàng, vui lòng loại bỏ đồ nội thất, tranh ảnh, gương, phụ kiện, v.v. hiện có để tránh hư hỏng. 
        Đồng thời, hãy đảm bảo rằng khu vực bạn muốn đặt đồ đạc không có bất kỳ đồ nội thất cũ nào và bất kỳ vật dụng nào khác có thể cản trở lối đi của đội giao hàng. Shopify Shop sẽ giao hàng, lắp ráp và sắp xếp việc mua đồ nội thất mới của bạn cũng như loại bỏ tất cả vật liệu đóng gói khỏi nhà bạn. Đội ngũ giao hàng của chúng tôi không được phép di chuyển đồ đạc hiện có của bạn hoặc các đồ gia dụng khác. 
        Nhân viên giao hàng sẽ cố gắng giao các mặt hàng đã mua một cách an toàn và có kiểm soát nhưng sẽ không cố gắng đặt đồ đạc nếu họ cảm thấy việc đó sẽ dẫn đến hư hỏng sản phẩm hoặc nhà của bạn. Nhân viên giao hàng không thể tháo cửa, nâng đồ đạc hoặc mang đồ đạc lên hơn 3 tầng cầu thang. 
        Phải có thang máy để giao hàng từ tầng 4 trở lên.`,
    },
];

export const colors = [
    "black",
    "brown",
    "gray",
    "white",
    "pink",
    "yellow",
    "orange",
    "purple",
    "green",
    "blue",
];

export const sorts = [
    {
        id: 1,
        value: "asc",
        text: "Giá: Thấp đến cao",
    },
    {
        id: 2,
        value: "desc",
        text: "GIá: Cao đến thấp",
    },
];

export const voteOptions = [
    {
        id: 1,
        text: "Terrible",
    },
    {
        id: 2,
        text: "Bad",
    },
    {
        id: 3,
        text: "Neutral",
    },

    {
        id: 4,
        text: "Good",
    },

    {
        id: 5,
        text: "Perfect",
    },
];
const { AiOutlineDashboard, MdGroups, TbBrandProducthunt, RiBillLine } = icons;
export const adminSidebar = [
    {
        id: 1,
        type: "SINGLE",
        text: "Dashboard",
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <AiOutlineDashboard size={20} />,
    },
    {
        id: 2,
        type: "SINGLE",
        text: "Manage users",
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <MdGroups size={20} />,
    },
    {
        id: 3,
        type: "PARENT",
        text: "Products",
        icon: <TbBrandProducthunt size={20} />,
        submenu: [
            {
                text: "Create product",
                path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
            },
            {
                text: "Manage products",
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
            },
        ],
    },
    {
        id: 4,
        type: "SINGLE",
        text: "Manage orders",
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <RiBillLine size={20} />,
    },
    {
        id: 31,
        type: "PARENT",
        text: "Blogs",
        icon: <TbBrandProducthunt size={20} />,
        submenu: [
            {
                text: "Create blog",
                path: `/${path.ADMIN}/${path.CREATE_BLOG}`,
            },
            {
                text: "Manage blogs",
                path: `/${path.ADMIN}/${path.MANAGE_BLOGS}`,
            },
        ],
    },
];
export const memberSidebar = [
    {
        id: 1,
        type: "SINGLE",
        text: "Thông tin cá nhân",
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <AiOutlineDashboard size={20} />,
    },
    {
        id: 2,
        type: "SINGLE",
        text: "Giỏ hàng",
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icon: <MdGroups size={20} />,
    },
    {
        id: 4,
        type: "SINGLE",
        text: "Đơn đã mua",
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <RiBillLine size={20} />,
    },
    {
        id: 40,
        type: "SINGLE",
        text: "Wishlist",
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <RiBillLine size={20} />,
    },
];

export const roles = [
    {
        code: 2,
        value: "Admin",
    },
    {
        code: 2,
        value: "User",
    },
];
export const blockStatus = [
    {
        code: true,
        value: "Blocked",
    },
    {
        code: false,
        value: "Active",
    },
];
export const statusOrders = [
    {
        label: "Cancalled",
        value: "Cancalled",
    },
    {
        label: "Succeed",
        value: "Succeed",
    },
];
