const tasks = require('jfrog-pipelines-tasks');
const axios = require('axios');

async function jira_comment() {
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

  const comment = tasks.getInput('comment');
  if (comment == "") {
    tasks.error("comment input cannot be empty");
    return process.exit(1);
  }

  const jira_integration = tasks.getIntegration(jira_integration_name);
  const username = jira_integration.username;
  let endpoint = jira_integration.url;
  const token = jira_integration.token;
  const apiSuffix = "/rest/api/2";

  endpoint = endpoint.replace(/^\/|\/$/g, ''); // removes trailing slash
  endpoint = endpoint.replace(apiSuffix, '');

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
      'body': comment
    },
    url: endpoint + '/rest/api/2/issue/' + issue_key + '/comment'
  };
  return await axios(options);
}

module.exports = jira_comment;
