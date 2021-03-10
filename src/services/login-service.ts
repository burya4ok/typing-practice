import { User } from "../entities/user";

export default class LoginService {
  public async login(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (user) {
      if (user.password === password) {
        return User.check(user);
      }

      throw new Error("Wrong password");
    }

    throw new Error("User not found");
  }

  private async findByEmail(email: string) {
    const users = await this.fetch();

    return users.default.find((user: { email: string }) => user.email === email);
  }

  private fetch(): Promise<any> {
    return import("../mocks/users.json");
  }
}
