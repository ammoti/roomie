const validator = require("email-validator");

export class User {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  isComplete: boolean;
  city: string;
  image: string;
  constructor(
    id?: string,
    name?: string,
    password?: string,
    email?: string,
    surname?: string,
    dateOfBirth?: string,
    isComplete?: boolean,
    city?: string,
    image?: string
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.dateOfBirth = dateOfBirth;
    this.isComplete = isComplete;
    this.city = city;
    this.image = image;
  }
  isValidEmail() {
    return validator.validate(this.email);
  }
}
