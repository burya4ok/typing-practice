import { Role } from "../entities/role";
import { Admin } from "../entities/admin";
import { Client } from "../entities/client";
import { Operation } from "../entities/operation";
import { User } from "../entities/user";
import { castTo, RoleToUser } from "../entities/role-to-user";

export default class UserService {
  private users: readonly User[] = [];

  async getAllUsers(): Promise<readonly User[]> {
    if (this.users.length !== 0) {
      return this.users;
    }
    const response = await this.fetch();
    this.users = response.default.map((u: any) => {
      return User.check(u);
    });
    return this.users;
  }

  private fetch(): Promise<any> {
    return import("../mocks/users.json");
  }

  async updateUserRole<R extends Role>(user: RoleToUser[R], newRole: R) {
    const newUser = castTo(newRole, user);
    this.users = this.users.map((u) => (u.id === user.id ? newUser : u));
    return this.users;
  }

  getAvailableOperations(user: User, currentUser: User): Operation[] {
    // Вам нужно поменять логику внутри getAvailableOperations для того, что бы это работало с логином
    // throw new Error("Not Implemented")
    if (Admin.guard(user) || Client.guard(user)) {
      return [Operation.UPDATE_TO_MODERATOR];
    }

    return [Operation.UPDATE_TO_CLIENT, Operation.UPDATE_TO_ADMIN];
  }
}
