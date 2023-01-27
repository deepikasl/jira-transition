const tasks = require('jfrog-pipelines-tasks');
const axios = require('axios');

async function jira_transition() {
  const issue_key = tasks.getInput('issue_key');
  if (issue_key == "") {
    tasks.error("issue_key input cannot be empty");
    return process.exit(1);
  }

  const jira_integration_name = tasks.getInput('jira_integration_name');
  if (jira_integration_name == "") {
    tasks.error("jira_integration_name input cannot be empty");
    return process.exit(1);
  }

  const transitionName = tasks.getInput('transitionName');
  if (transitionName == "") {
    tasks.error("transitionName input cannot be empty");
    return process.exit(1);
  }

  const jira_integration = tasks.getIntegration(jira_integration_name);
  const username = jira_integration.username;
  let endpoint = jira_integration.url;
  const token = jira_integration.token;
  const apiSuffix = "/rest/api/2";

  endpoint = endpoint.replace(/^\/|\/$/g, ''); // removes trailing slash
  endpoint = endpoint.replace(apiSuffix, '');

  const transitionOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    auth: {
        username: username,
        password: token
    },
    url: endpoint + '/rest/api/2/issue/' + issue_key + '/transitions'
  };

  try {
    let tranisitionResult = await axios(transitionOptions);
    tranisitionResult = tranisitionResult.transitions || [];
  } catch (e) {
    tasks.error(`Failed to fetch the transitions with error: ${e}`);
    return process.exit(1);
  }
  const requiredTranisition = tranisitionResult.find(
    ({ name }) => name === transitionName
  );
  if (!requiredTranisition) {
    tasks.error(`No transition with name: ${transitionName}`);
    return process.exit(1);
  }

  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      auth: {
          username: username,
          password: token
      },
      data: {
          "transition": {
              "id": requiredTranisition.id
          }
      },
      url: endpoint + '/rest/api/2/issue/' + issue_key + '/transitions'
  };
  await axios(options);
}

module.exports = jira_transition;
