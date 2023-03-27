const tasks = require('jfrog-pipelines-tasks');
const axios = require("axios");

const jira_transition = require("../jira_transition");

const jiraIntegration = {
  username: "name",
  url: "https://sample.com",
  token: "token"
};

jest.mock('jfrog-pipelines-tasks', () => ({
  getInput: jest.fn().mockReturnValueOnce('TAS-1').mockReturnValueOnce('name').mockReturnValueOnce('To Do'),
  getIntegration: jest.fn().mockReturnValue(jiraIntegration)
}));

const transitionResponse = {
  data: {
    transitions: [
      {
        id: 11,
        name: 'To Do'   
      },
      {
        id: 12,
        name: 'Done'   
      }
    ]
  }
};
const expectedResponse = {
  id: 12
};

jest.mock('axios', () => 
  jest
  .fn()
  .mockReturnValueOnce(transitionResponse)
  .mockReturnValueOnce(expectedResponse)
);

it("Ability to change transition from To DO to In Progress on the requested jira successfully", async () => {
    axios.mockReturnValueOnce(transitionResponse).mockReturnValueOnce(expectedResponse);
    const response = await jira_transition();
    expect(axios).toBeCalledWith({
      method: 'GET',
      url: 'https://sample.com/rest/api/2/issue/TAS-1/transitions',
      headers: { 'Content-Type': 'application/json' },
      auth: {
        "password": "token",
        "username": "name",
      },
    });
    expect(response).toEqual(expectedResponse);
  });

