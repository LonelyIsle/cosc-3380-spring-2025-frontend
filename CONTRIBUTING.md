# Contribution Guidelines

Contributing guides are important for maintaining a clean commit history and a better maintainable code base!

This is a straight forward contributing guide for Uma's Spring 2025 Databases class, team 4.

<hr>

### ❗ Issues

We will primarily use issues as a checklist. Each issue will have an assigned member using GitHub's issue assignment feature, ensuring accountability.
We will be using issues a lot to keep track of the organization and progress of our project!

We will be using the **enhancement** tag on issues that plan on adding new features.

If an existing feature <u>needs</u> attention, simply create a traditional issue with the appropriate corresponding tag. (bug, invalid).

**Remember, this project relies a lot on code peer reviews. Respond to issues and if you see any and make issues if you must!**

#### Issues Format

To follow a consistent format, these are the guidelines you are going to follow when creating an issue.

- For the name, just simply describe the feature/issue.

- For the description, attach this copy and paste below and fill it out. Fairly straight forward. (be descriptive!)

```
## Issue Overview
-
## Description
-
```

- After creating the issue, in the development section, **attach a branch corresponding to the issue.** All issues will correspond to a development branch. If there isn't one currently, then just create one!

  > [!NOTE]
  > Refer to section on creating a new branch.

#### Completed Issues

Finally, once the issue has been completed, you will make a closing comment. Ensure that you attach a linked PR if there is one (don't close until the PR has been fully peer reviewed and accepted!)

```
- Linked PR: #
- Bugfix or enhancement?
- Description of what was done:
```

<hr>

### ✍️ Making Changes

When creating a new feature for the project, create a new branch to keep all of your changes local on to that branch. **NEVER FORCE PUSH YOUR CHANGES TO MAIN BRANCH!**

#### Creating a new branch

- Before creating a branch, be sure to `git pull` the latest changes. This will ensure your local repository is synced with the main branch.
- Create your new branch with `git checkout -b branch/name`
  - **Before you do!** Branch names are important. We will be using the naming convention of `what/imperative-hyphen-description`, some good examples:
    - docs/update-contributing-guidelines
    - feature/setup-mysql-database
    - bugfix/fix-syntax-error
    - refactor/improve-frontend-ui
  - Notice that they are using <u>imperative mood</u>, when describing that you are adding a README for example, you will say 'Add README' instead of 'Adding README'. For an easier time, **think of it as you giving a concise order**

Awesome! ✨ You created your branch. Make your changes, and commit often! Hold on, commiting..?

#### How do you commit?

Commit messages are VERY important. They will be used by your team as an overview of what you have done, that's why we must establish a good practice convention.

A commit consists of two things:

- Title (REQUIRED)
- Description (OPTIONAL, BUT ENCOURAGED)

The **title** will be following the <u>concise imperative mood</u> format. Git commit titles are `72` characters, so when committing we want to be short and concise. Here are some examples.

| Good Commit Titles                    | Bad Commit Titles           |
| ------------------------------------- | --------------------------- |
| Fix login bug                         | MUSTAAAAAAAAAAAAAAAARD      |
| Add user authentication               | Stuff                       |
| Update README with setup instructions | Fix things                  |
| Remove deprecated API calls           | I am removing this dumb bug |
| Improve page load performance         | Final version               |

A good commit title tells a developer what the commit changes are going to be. A bad commit title leaves you guessing.

Always **commit often** so you could keep your commits as concise! You wouldn't want multiple unrelated changes in one commit.

The **description** exists to **strengthen** and **support** what the commit title is. Here, you can freely describe, in whatever format, what your commit title means and the changes that you made.

<hr>

### 🤼 Pull Requests

Once your feature is implemented and ready for review, you will create a Pull Request (PR) to merge your branch into the main branch.

**When to Create a PR?**

1️⃣ **For small, completed features:** Create a PR once your changes are fully implemented and tested.
2️⃣ **For large or complex features:** Open a Draft PR when your work is around 50-75% complete. This allows the team to provide early feedback and prevents major rework later.

**Creating a PR**

- Push your branch to the remote repository (git push origin branch/name).
- Navigate to the GitHub repository and open a PR.
- If your feature is complete, mark the PR as "Ready for Review".
- If your feature is still in progress and needs feedback, mark it as a "Draft PR".
- Provide a clear PR description, linking the appropriate related issue.

**Reviewing PRs**

- Every PR must be reviewed by at least one team member before merging.
- Leave constructive comments and suggest improvements.
- Request changes if necessary before approving the PR.

**Merging PRs**

- Once approved, you may merge the PR into the main branch.
- Ensure the main branch remains stable and functional at all times.
- Delete the branch after merging to keep the repository clean.

<u>**Reminder: DO NOT MERGE YOUR OWN PR WITHOUT A REVIEW!**</u>

<hr>

### 🍾 Closing Notes

This contribution guide genuinely serves as a way to practice good github etiquette and to make working as a team a lot easier. Nothing serious to be honest, if we work together we work together but we gotta have some semblence of organization here lol.

This contribution guide is subject to changes.

- Commit often
- Just follow best practices
- Treat this project like Uma is always watching (don't be stupid!)
