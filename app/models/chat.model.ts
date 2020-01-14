export class Chat {
    constructor
      (
        public id?: string,
        public message?: string,
        public ufrom?: string,
        public to?: string,
        public date?: Date
      )
    { }
}