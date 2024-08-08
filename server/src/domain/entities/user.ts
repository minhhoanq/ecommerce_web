export default class User {
    constructor(
        public id: number,
        public username: string,
        public firstName: string | null,
        public lastName: string | null,
        public email: string,
        public password: string,
        public avatar: string | null,
        public gender: string | null,
        public dob: string | null,
        public phone: string | null,
        public roleId: number,
        public status: boolean | null,
        public passwordChangedAt: string | null,
        public passwordResetToken: string | null,
        public passwordResetExpires: string | null,
        public createdAt: Date | null,
        public updatedAt: Date | null
    ) {}
}
