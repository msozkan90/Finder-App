const userService = require('../../src/services/userService');
const User = require('../../src/models/User');

jest.mock('../../src/models/User');

describe('User Service', () => {
  describe('createUser', () => {
    it('should create a user', async () => {
      const userData = { name: 'Test', email: 'test@example.com', password: 'password' };
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(userData)
      }));

      const user = await userService.createUser(userData);
      expect(user).toEqual(userData);
    });
  });

});
