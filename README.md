[ ![Codeship Status for A24Group/a24-ember-test-lib](https://app.codeship.com/projects/9df22820-7471-0135-5e9a-22a90e89452a/status?branch=master)](https://app.codeship.com/projects/243939)

# a24-ember-test-lib
A standardised set of ember test improvements focussing on stricter comparisons

# Intent
To improve upon the current test compares for a rendered component to actually compare html as apposed to just text.

## Requirements
This addon is built to run on node `v0.10.26` due to a legacy production environment

This will be upgraded in the future, but for now, it is recomended that the above version is used

**See [guidelines](https://github.com/A24Group/a24-ember-test-lib/blob/master/CONTRIBUTING.md) for contribution guidlines**

### TO USE THIS LIB
 * Copy the testProp folder from the root of this project to your own projects root
 * Copy the ember.sh file from the root of this project to your own projects root
 * Move all integration tests from the `tests` folder to the `testsTemplates` folder
 * Run tests using `./ember.sh test` or `./ember.sh test-serve` both accepting an optional filter string
