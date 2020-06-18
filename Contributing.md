# Contribution Guidelines

- **Issue Reports** are for issues with the software, where its behavior does not follow the intended result. Colloquially, this is a bug. Issue reports do not cover feature enhancements, nor do they cover alternative behaviors out of the designed scope.
    - All issue reports must be filed through [GitHub Issues](https://github.com/opticdev/optic/issues).
    - Search our open issues first, to see if it has already been reported.
    - Issues should provide a reproduction so we can see it happen locally, including at a minimum:
        - What were you trying to accomplish when you ran into the issue?
        - What did you expect to happen?
        - What happened instead?
    - Please provide [debugging information](https://docs.useoptic.com/debugging-diffs).
    - It's possible your report is not part of the designed scope. It may be closed as such. If so, feel free to consider submitting a **Feature Request**.
- **Feature Requests** cover all requests for additional behavior and requests for changes in designed scope. If the software is not working as intended, that's an **Issue** which needs to be reported.
    - All feature requests must be filed through [GitHub Issues](https://github.com/opticdev/optic/issues).
    - Feature requests should include, at minimum:
        - A summary of the feature.
        - Documented use case(s) demonstrating the flow and value of the feature.
        - Key behaviors/business rules that must be met.
    - If there is domain specific knowledge that applies to your use case, a summary or explanatory link helps.
    - Submission of a feature request does not mean it will be accepted for work. Feature requests can't all be satisfied. Your request may be closed as not part of the future intended scope of the project. It may also be put in a backlog for future consideration with no plan or schedule to deliver.
- **Contributions** are welcome. Here's how to make a contribution that will benefit the Optic community.
    - Contributions don't have to be code! There are many ways to contribute, such as providing reproducible **Issues**, offering user story and feedback for potential **Features**, and adding helpful documentation or other practical artifacts on how Optic has been useful to you. If you have a question, you're likely not the only person who will have that question.
    - Before working on a contribution, please review our open [GitHub Issues](https://github.com/opticdev/optic/issues) for **Issue Reports**. Resolving these is generally the highest value to the community.
    - If you wan to work on a new **Feature**, great! Please reach out to the community first with a **Feature Request** to make sure it fits with Optic's intended future scope. Features submitted that don't further the goals of the Optic community may not be accepted.
    - Fork the repository, and consider using a topic branch so that you can submit additional changesets for review as necessary.
    - Review `Developer-setup.md` to get your local environment ready. Follow the workflow there and use project scripts where available for consistency.
    - When submitting your contribution, use a pull request and document what the change covers. If this relates to an existing artifact, such as an open issue, please link to it for reference. Pull requests should target the `develop` branch.