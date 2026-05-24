import bcrypt from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { SignUpInput, LoginInput } from "../schemas/auth.schema.js";

export const loginUser = async (input: LoginInput, app: FastifyInstance) => {
  const user = await app.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const rightCred = await bcrypt.compare(input.password, user.password);

  if (!rightCred) {
    throw new Error("Invalid password");
  }

  const token = app.jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    { expiresIn: "1h" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
export const signupUser = async (input: SignUpInput, app: FastifyInstance) => {
  const emailExist = await app.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });
  if (emailExist) {
    throw new Error("Email already Exists");
  }
  const hashedPass = await bcrypt.hash(input.password, 10);
  const user = await app.prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPass,
      role: input.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return user;
};
