export class AuthDTO {
  userId: string;
  access_token: string;
  username: string;
  password: string;

  constructor(
    userId: string,
    access_token: string,
    username: string,
    password: string
  ) {
    this.userId = userId;
    this.access_token = access_token;
    this.username = username;
    this.password = password;
  }
}
