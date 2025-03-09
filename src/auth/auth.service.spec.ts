import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { getModelToken } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { User } from "./schemas/user.schema";
import * as bcrypt from "bcrypt";
import { ConflictException, UnauthorizedException } from "@nestjs/common";

const mockUserModel = {
  where: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue("mocked-jwt-token"),
};

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("register", () => {
    it("should successfully register a user", async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(true);

      const authDto = { username: "testuser", password: "testpass" };

      await expect(authService.register(authDto)).resolves.toBeUndefined();
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it("should throw an error if the user already exists", async () => {
      mockUserModel.findOne.mockResolvedValue({ username: "testuser" });

      const authDto = { username: "testuser", password: "testpass" };

      await expect(authService.register(authDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe("login", () => {
    it("should return a token if credentials are correct", async () => {
      const user = {
        _id: "123",
        username: "testuser",
        password: await bcrypt.hash("testpass", 10),
        role: "user",
      };
      mockUserModel.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const result = await authService.login({
        username: "testuser",
        password: "testpass",
      });

      expect(result).toEqual({ access_token: "mocked-jwt-token" });
    });

    it("should throw an error if the user does not exist", async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(
        authService.login({ username: "testuser", password: "testpass" }),
      ).rejects.toThrow(ConflictException);
    });

    it("should throw an error if the password is incorrect", async () => {
      const user = {
        username: "testuser",
        password: await bcrypt.hash("testpass", 10),
      };
      mockUserModel.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await expect(
        authService.login({ username: "testuser", password: "wrongpass" }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
