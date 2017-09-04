# Contributing guidelines

## Using additional npm libraries, not already in package.json
Each lib will need to be reviewed and evaluated before it can be used within the project. If you feel that there are benefits to adding a particular
lib, speak to the relevant person and get approval.

## Issues
Each ticket in a project will be broken down to a single or small set of required features. If you feel the scope of the ticket is too large, speak to the relevant person.
PRs should be created per ticket.

## Linting
Linting is enforced using [jshint](http://jshint.com/), this is built in to the ember tests.

## Coding Standards
We use 4 spaces for indentation of files, not tabs and not 2 spaces

## Workflow & Process
Outlines the process and steps to be followed for contributions to the project.

### Step 1: Clone the project
Clone the project.

### Step 2: Branch
You should assign yourself to the ticket you are about to start working on.
You should now remove the `Ready` label for the ticket you are working on. Ensure to use the project to move it to the respective swimlane.
Create a branch before you start coding on a ticket, do not work on your master branch.
Read through the ticket, and buddy with the creator to ensure that everything is understood and requirements are clear.
If there are any questions / comments feel free to ask them on the issue / via slack message / google meet / skype.
Your local branch name can be anything to your liking, when pushing to the main repo follow the naming conventions outlined [here](#branch-naming-conventions)

### Step 3: Commit
Each commit should be related to a single ticket. Messages should be clear and contain details relating to the change
A commit message should also contain a reference to the issue.

An example commit message
```
One line summary of the commit

More detailed description of the changes made within this commit

Issue: link to the current ticket you are working on
```

### Step 4: Sync with main repo
Before testing / pushing / creating a PR to master, you will need to make sure that you are up to date with master.

### Step 5: Testing
Refer to [here](#required-test-cases) for all the test cases that are required.
You are required to run all test cases locally.
Run tests in phantom (an optional filter string can be passed as a param)
```
./ember.sh test
```
Run tests in serve mode using chrome (an optional filter string can be passed as a param)
```
./ember.sh test-serve
```

### Step 6: Pushing to main repo
You should be pushing on a regular basis, and you should do an end of day commit everyday.
Once you have feel you have completed the requirements on the ticket create the PR (if you have not already done so).
Note that each push to the main repo will kick off various processes:
* Codeship Builds

If you want to prevent certain processes from firing you can use the following flags in your commit
* Codeship Build
  * `--skip-ci`

### Step 7: Review process
Ensure to use the project to move it to the respective swimlane.
This process will ensure that the requirements have been covered, and also a review on the actual code submitted.

Code will be evaluated for readability and whether or not it meets the coding standards. Code should meet coding standards defined in the provided jshint configurations.

Code should at all times be easy to read and understand. Each function should always have a function comment that explains the purpose of the function, the function parameters, the type for each parameter and the return data.

### Step 8: Testing
Once the code has passed the review process, the code will be tested by one of the other developers.
Once happy the code can be merged and tagged.

### Step 9: Production and Merging
Ensure to use the project to move it to the respective swimlane.

After a successful Testing step, the PR is merged into the master branch.
A new release is then drafted on [github](https://github.com/A24Group/A24EmberCalendar/releases)
The versions are done as follows:
`Major.Minor.Bug`
**Major:** versions imply that switching to this version will cause the user of the addon to make major refactoring since it breaks some existing
implementations.
**Minor:** versions imply that switching to this version will add a new feature or enhancement to the existing code however, the user of the addon should not have to make any changes to their own code in order to have it work.
**Bug:** versions imply that the pr only contains bugfixes.

## References:

### Branch Naming Conventions
The branch name should contain a short feature description and the ticket number the branch is related to at the end of the branch name.
Note that all branches should either be marked as `feature-` or `hotfix-`

**Example branch names:**
 * feature-add-button-3
 * feature-some-other-thing-44
 * hotfix-remove-console-log-23
 * hotfix-invalid-reference-removed-21

### Required Test Cases

#### Unit tests
Ember generate should place down any tests classes that you need to fill. It is up to the developer to ensure that they
have as much coverage as they can.

#### Integration Test Cases
These are based on a per implementation case. This should try and cover as much cases as possible. 

### Some additional info
 * If you feel that these guidelines are unclear or are missing something, feel free to add it. Note that this will have to be done
using the traditional PR to the project.
