# Todo 2 Issue
CLI tool to synchronize code-base TODO into GitHub issues.

## What does it do?
 
At the first run, it:
- finds TODOs and FIXMEs in your code
- groups them using their text
- creates a GitHub issue for each group with a specific label
- references the issue in the code-base like `TODO(#123) Do something`

When ran again, it:
- discovers new TODOs and handles them with the steps above
- updates GitHub issues with current location of the TODOs (file and line)
- closes GitHub issues with no corresponding TODO in the code-base

The tool works with a sub-set of issues tagged by a specific label (by default that
is `TODO`). This label should not be assigned to issues manually, because such
issues will be closed on the next run as there are no corresponding TODOs in the code-base.

## Installation

```shell
npm i todo2issue --save-dev
```
or
```shell
yarn add todo2issue --dev
```

## Configuration

The tool is configurable through `package.json`.

### Repository
First you need to ensure that the `repository` property is present and properly populated:
```json
{
  // ...
  "repository": {
    "type": "git",
    "url": "git+https://github.com/salsita/todo2issue.git"
  },
  // ...
}
```

### Preferences
Then you should configure behavior of the tool using `todo2issue` property:
```json
{
  // ...
  "todo2issue": {
    "filePatterns": [
      "**/*.ts?(x)",
      "**/*.js?(x)"
    ],
    "issueLabel": "TODO",
    "branch": "develop"
  },
  // ...  
}
```

- `filePatterns` - a list of glob patterns matching files in which the tool
  should search for TODOs
  - `.gitignore` files are respected
  - defaults to `['**/*.[tj]s?(x)']` (JavaScript and TypeScript files)
- `issueLabel` - name of the label that defines a set of GitHub issues governed by the tool 
  - this label should not be used for anything else than for the purpose of this tool
  - this label **MUST NOT** be assigned / unassigned manually
- `branch` - name of the branch to be used when referencing code from the generated issues
  - defaults to active Git branch, but it is highly recommended fixing this in the config 

### GitHub token
The tool needs GitHub personal access token to interact with GitHub API on your behalf.
You can provide it in various ways:

- through an `GITHUB_TOKEN` environment variable
- through `.env` file with `GITHUB_TOKEN` variable
    - needs reside in the directory where the tool is executed
- through the `--token` command line option

## Usage

Ensure you're running the commands in the root directory of your project - where
`package.json` resides.

### Full sync

Simply run the tool with no parameters:

```shell
todo2issue
```
This will perform create, update and close issues using the configuration specified
in `package.json`. Newly discovered TODOs will be updated to reference the issues that
were created. This will yield a change in the code-base. Make sure you commit and push
these changes.

### Dry-run

```shell
todo2issue --dry-run
```

This will simulate the full sync, but it won't write anything to GitHub. Todos will
still be updated with references, but the issue numbers will be just sequentially
generated locally.

This is useful for validating settings and TODO discovery. Each mocked operation is
also logged into the console, and you can review the issues about to be created in
detail before running the sync for real.

**DO NOT COMMIT** the generated changes from a dry-run since the TODOs don't reference
actual issues, but rather some fake numbers.

**ROLL BACK** the changes before making a real sync!

### Help
The tool's commandline API is self-descriptive through the standard `--help` option.

```shell
todo2issue --help
```
