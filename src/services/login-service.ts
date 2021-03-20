import { User } from "../entities/user";

const PASSWORD_ERROR_MESSAGE = "Wrong password";
const NOT_FOUND_USER_ERROR_MESSAGE = "User not found";

export default class LoginService {
  public async login(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (user) {
      if (user.password === password) {
        return User.check(user);
      }

      throw new Error(PASSWORD_ERROR_MESSAGE);
    }

    throw new Error(NOT_FOUND_USER_ERROR_MESSAGE);
  }

  private async findByEmail(email: string) {
    const users = await this.fetch();

    return users.default.find((user: { email: string }) => user.email === email);
  }

  private fetch(): Promise<any> {
    return import("../mocks/users.json");
  }
}
