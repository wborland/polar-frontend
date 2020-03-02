import axios from 'axios';

describe('Password Reset Testing', () => {
    test('Non-existent account',  () => {
        let data = {email: "randomPerson1@polarapp.xyz"}
        axios.post('https://api.polarapp.xyz/user/forgotPassword', data).then((res) => {
            expect(false).toBeTruthy();
        }).catch((err) => {
            expect(err.response.data.code).toBe(400);
            expect(err.response.data).toContainEqual({'message': "Email is already assigned"});
        });
    });

    test('Real account',  async () => {
        let data = {email: "kunalsinha98@polarapp.xyz"}
        axios.post('https://api.polarapp.xyz/user/forgotPassword', data).then((res) => {
            expect(res.data).toContain("Success");
        }).catch((err) => {
            expect(false).toBeTruthy();
        });
    });

});