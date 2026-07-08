import "responser";
import { MockResponser, MockNextFunction} from './../../globals/Stubs.ts';
import { assertEquals } from "@std/assert";
import { Request } from "express";
import { UserController } from "./UserController.ts";
import { UserService } from "./UserService.ts";

class MockUserService { 
}

const mockUserService = new MockUserService();
const userController = new UserController(
    mockUserService as unknown as UserService
);
