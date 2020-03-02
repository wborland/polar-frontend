import axios from "axios";

describe("Login Testing", () => {
  test("Invalid user test", () => {
    let user = { email: "admin@polarapp.xyz", roles: [1,2,3] };
    axios
      .post("https://api.polarapp.xyz/iam/invite", user)
      .then(res => {
        expect(false).toBeTruthy();
      })
      .catch(err => {
        expect(err.response.data.code).toBe(400);
        expect(err.response.data).toContainEqual({
          message: "Email already exists"
        });
      });
  });

  test("New user test", () => {
    let user = { email: "newPersonTest@polarapp.xyz", roles: [1,2,3] };
    axios
      .post("https://api.polarapp.xyz/user/login", user)
      .then(res => {
        expect(res).toContain("data");
        expect(res.data).toContain("message");
      })
      .catch(err => {
        expect(false).toBeTruthy();
      });
  });
});