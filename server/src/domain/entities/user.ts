export default class User {
    constructor(
        public id: number,
        public username: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public avatar: string,
        public gender: string,
        public dob: string,
        public phone: number,
        public roleId: number,
        public status: string,
        public isVerify: string,
        public passwordChangedAt: string,
        public passwordResetToken: string,
        public passwordResetExpires: string,
        public createdAt: string,
        public updatedAt: string
    ) {}
}
