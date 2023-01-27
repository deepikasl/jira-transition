const tasks = require('jfrog-pipelines-tasks');
const axios = require("axios");

const jira_comment = require("../jira_comment");

const jiraIntegration = {
  username: "name",
  url: "https://sample.com",
  token: "token"
};

jest.mock('jfrog-pipelines-tasks', () => ({
  getInput: jest.fn().mockReturnValue('TAS-1'),
  getIntegration: jest.fn().mockReturnValue(jiraIntegration)
}));

const expectedResponse = {
  "id": "10006",
  "body": "test comment"
};

jest.mock('axios', () => 
  jest
  .fn()
  .mockReturnValue(expectedResponse)
);


it("Ability to comment on the requested jira successfully", async () => {
  axios.mockResolvedValueOnce(expectedResponse);
  const response = await jira_comment();
  expect(axios).toBeCalledWith({
    method: 'POST',
    url: 'https://sample.com/rest/api/2/issue/TAS-1/comment',
    headers: { 'Content-Type': 'application/json' },
    auth: {
      "password": "token",
      "username": "name",
    },
    data: {
      "body": "TAS-1"
    },
  });
  expect(response).toEqual(expectedResponse);
});
