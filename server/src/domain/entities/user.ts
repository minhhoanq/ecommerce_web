export default class User {
    constructor(
        public id: number,
        public username: string,
        public email: string,
        public password: string,
        public type: string
    ) {}
}
