import axios from "axios";

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

describe("Login Testing", () => {
  test("Invalid user test", () => {
    let user = { email: "fail@polarapp.xyz", password: "password" };
    axios
      .post("https://api.polarapp.xyz/user/login", user)
      .then(res => {
        expect(false).toBeTruthy();
      })
      .catch(err => {
        expect(err.response.data.code).toBe(400);
        expect(err.response.data).toContainEqual({
          message: "Incorrect credentials provided"
        });
      });
  });

  test("Invalid user test", () => {
    let user = { email: "admin@polarapp.xyz", password: "wrongpassword" };
    axios
      .post("https://api.polarapp.xyz/user/login", user)
      .then(res => {
        expect(false).toBeTruthy();
      })
      .catch(err => {
        expect(err.response.data.code).toBe(400);
        expect(err.response.data).toContainEqual({
          message: "Incorrect credentials provided"
        });
      });
  });

  test("Admin user test", () => {
    let user = { email: "admin@polarapp.xyz", password: "password" };
    axios
      .post("https://api.polarapp.xyz/user/login", user)
      .then(res => {
        expect(res).toContain("data");
        expect(res.data).toContain("auth");
        expect(res.data).toContain("firstName");
        expect(res.data).toContain("lastName");
        expect(res.data).toContain("permissions");
        expect(res.data.permissions).toHaveLength(11);
      })
      .catch(err => {
        expect(false).toBeTruthy();
      });
  });
});
sleep(5000);
