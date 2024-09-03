module.exports = ({ github, context, body }) => {
  if (context.issue && context.issue.number) {
    github.rest.issues.createComment({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body
    });
  }
};
