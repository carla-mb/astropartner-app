export class UserDTO {
  userId?: string;
  access_token?: string;
  username: string;
  password: string;
  birthDate: string;
  zodiacSign: string;

  constructor(
    username: string, 
    password: string, 
    birthDate: string, 
    zodiacSign: string
  ) {
    this.username = username;
    this.password = password;
    this.birthDate = birthDate;
    this.zodiacSign = zodiacSign;
  }
}
