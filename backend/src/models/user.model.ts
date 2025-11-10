import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

type User = {
  id: string;
  username: string;
  password: string; // hashed
  firstname: string;
  lastname: string;
};

export type PublicUser = Omit<User, "password">;

const users: User[] = [];

const toPublic = (u: User): PublicUser => ({
  id: u.id,
  username: u.username,
  firstname: u.firstname,
  lastname: u.lastname
});

export const UserModel = {
  findByUsername(username: string): PublicUser | null {
    const u = users.find(x => x.username === username);
    return u ? toPublic(u) : null;
  },

  login(username: string, password: string): PublicUser | null {
    const u = users.find(x => x.username === username);
    if (!u) return null;
    const ok = bcrypt.compareSync(password, u.password);
    return ok ? toPublic(u) : null;
  },

  create(newUser: { username: string; password: string; firstname: string; lastname: string; }): PublicUser {
    const exists = users.some(x => x.username === newUser.username);
    if (exists) throw new Error("USERNAME_TAKEN");
    const hashed = bcrypt.hashSync(newUser.password, 10);
    const user: User = {
      id: uuidv4(),
      username: newUser.username,
      password: hashed,
      firstname: newUser.firstname,
      lastname: newUser.lastname
    };
    users.push(user);
    return toPublic(user);
  }
};
