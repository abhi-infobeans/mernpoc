import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "./Login";

const mockLogin = vi.fn();

const renderLogin = () => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe("Login Component", () => {

  test("should allow user to enter email and password", async () => {

    const user = userEvent.setup();

    renderLogin();

    const emailInput =
      screen.getByPlaceholderText("Your Email Address");

    const passwordInput =
      screen.getByPlaceholderText("Password");

    await user.type(emailInput, "test@gmail.com");

    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@gmail.com");

    expect(passwordInput).toHaveValue("password123");

  });

});