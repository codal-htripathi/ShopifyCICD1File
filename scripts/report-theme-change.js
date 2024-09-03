const fetch = require('node-fetch');
const bot = require('./utils');
const checkThemeUpdate = require('./check-theme-update');

/**
 * Triggered from `github-script` within Github Action to perform file change check
 * and pass the result to either Github API to post to PR comment if triggered by `pull_request`
 * or Webhook URL if triggered by `repository_dispatch`.
 *
 * @param {Github} params.github An Octokit client
 * @param {Context} params.context A Github action context
 * @param {string[]} params.files A list of file path to check against
 * @param {boolean} params.isPR A boolean to indicate whether this is invoked from pull request or not
 */
async function reportThemeChange({ github, context, files, isPR }) {
  const webHookUrl = process.env.THEME_CHECK_SLACK_WEBHOOK_URL;
  const baseEnv = (process.env.ENV_PREFIX || '').toLowerCase();
  const updated = await checkThemeUpdate({ files });

  if (isPR) {
    let body = updated.map(({ asset: { key }, patchText }) => {
      const title = `### 👀 \`${key}\` has differences from remote file in: \`${baseEnv}\``;
      return patchText
        ? `
${title}

Review and incorporate the remote change if necessary.

<details>
<summary>Diff</summary>
<p>

\`\`\`diff
${patchText}
\`\`\`

</p>
</details>
`
        : title;
    });

    const keys = updated.map(({ asset: { key } }) => key);
    body = body.concat(
      files
        .filter((file) => !keys.includes(file))
        .map((file) => `✅ \`${file}\` is in sync in \`${baseEnv}\`.`)
    ).join(`

  ---

`);
    // posts to Pull Request comment
    if (body) bot({ github, context, body });
  } else if (webHookUrl) {
    // posts to Slack channel
    let text = '';
    let blocks = [];
    if (!updated.length) {
      text = `:white_check_mark: Theme files are in sync in \`${baseEnv}\``;
      blocks = [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text
          }
        }
      ];
    } else {
      text = `:exclamation: Theme files are out of sync in \`${baseEnv}\``;
      blocks = updated.map(({ asset: { key }, patchText }) => {
        return {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:exclamation: \`${key}\` is out of sync in \`${baseEnv}\`

\`\`\`
${patchText}
\`\`\`
`
          }
        };
      });
    }

    try {
      const response = await fetch(webHookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          blocks
        })
      });
      const res = await response.text();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = reportThemeChange;
