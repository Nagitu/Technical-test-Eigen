const request = require('supertest');
const { app, startServer, stopServer } = require('../index'); // path ke file index.js
const memberService = require('../member/member.service');

// Mock getById function
jest.mock('../member/member.service', () => ({
    getById: jest.fn(),
}));
let server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await stopServer();
});

describe('GET /members/:id', () => {
  it('should return member data for given id', async () => {
    const mockMember = [{
      "code": "M001",
      "name": "Angga",
      "warningDate": null
  }];
    memberService.getById.mockResolvedValue(mockMember);

    const res = await request(app).get('/members/M001');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ data: mockMember });
    expect(memberService.getById).toHaveBeenCalledWith('M001');
  });

  it('should return 404 if member not found', async () => {
    memberService.getById.mockResolvedValue([]);

    const res = await request(app).get('/members/2');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'member doesnt exist' });
    expect(memberService.getById).toHaveBeenCalledWith('2');
  });
});
