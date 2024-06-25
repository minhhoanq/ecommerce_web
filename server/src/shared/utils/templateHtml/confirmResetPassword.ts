export const ConfirmResetPassword = (resetToken: string) => {
    return `Vui lòng click vào link dưới đây để thay đổi mật khẩu. Link này sẽ hết hạn sau 10 phút kể từ bây giờ. 
        <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Nhấn vào đây</a>`;
};
