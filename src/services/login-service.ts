import { Admin } from "../entities/admin";
import { Client } from "../entities/client";
import { Moderator } from "../entities/moderator";
import { Role } from "../entities/role";
import type { User } from "../entities/user";

export default class LoginService {
  public async login(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (user) {
      if (user.password === password) {
        const User = this.getConstructorByRole(user.role);
        return User.from(user);
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

  getConstructorByRole(role: Role) {
    switch (role) {
      case Role.ADMIN:
        return Admin;
      case Role.CLIENT:
        return Client;
      case Role.MODERATOR:
        return Moderator;
    }
  }
}
