import axios from 'axios';

describe('Registration Testing', () => {
    test('Used account',  () => {
        let user = {email: "admin@polarapp.xyz", password: "password", firstName: "admin", lastName: "test", phone: "9046165471"}
        axios.post('https://api.polarapp.xyz/user/register', user).then((res) => {
            expect(false).toBeTruthy();
        }).catch((err) => {
            expect(err.response.data.code).toBe(400);
            expect(err.response.data).toContainEqual({'message': "Email is already assigned"});
        });
    });

    test('Missing Info',  () => {
        let user = {email: "registrationtest@polarapp.xyz", password: "wrongpassword", firstName: "", lastName: "", phone: ""}
        axios.post('https://api.polarapp.xyz/user/register', user).then((res) => {
            expect(false).toBeTruthy();
        }).catch((err) => {
            expect(err.response.data.code).toBe(400);
            expect(err.response.data).toContainEqual({'message': "Incorrect credentials provided"});
        });
    });

    test('New user test',  () => {
        let user = {email: "registrationtest@polarapp.xyz", password: "password", firstName: "registration", lastName: "test", phone: "9046165471"}
        axios.post('https://api.polarapp.xyz/user/register', user).then((res) => {
            expect(res).toContain('data');
            expect(res.data).toContain('auth');
            expect(res.data).toContain('firstName');
            expect(res.data).toContain('lastName');
            expect(res.data).toContain('permissions');
            expect(res.data.permissions).toHaveLength(11);
        }).catch((err) => {
            expect(false).toBeTruthy();
        });
    });

    test('New user test - no phone',  () => {
        let user = {email: "registrationtest@polarapp.xyz", password: "password", firstName: "registration", lastName: "test", phone: ""}
        axios.post('https://api.polarapp.xyz/user/register', user).then((res) => {
            expect(res).toContain('data');
            expect(res.data).toContain('auth');
            expect(res.data).toContain('firstName');
            expect(res.data).toContain('lastName');
            expect(res.data).toContain('permissions');
            expect(res.data.permissions).toHaveLength(11);
        }).catch((err) => {
            expect(false).toBeTruthy();
        });
    });
});