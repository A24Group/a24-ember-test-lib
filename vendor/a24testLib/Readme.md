# Integration Test Cases

### Overview

**This readme is here to give developers an overview on how to write integration tests so that all the tests conform to our integration test standards.**
**These standards are put in place to ensure that any tests that are added, do not affect any of the existing or future tests.**

### Something to note

Even though the integration helper code deals with a lot of things for you, we can however not control the machine that the tests are running on.
For that reason, **when running tests in chrome, ALWAYS maintain focus in your browsers test tab**. If you switch to any other application or tab, the tests
can not focus the correct components and thus might cause a test to fail. If you re-run tests using commands, switch back to your browser tab as fast as possible.

### How do I start

First of all, you need to be running `ember generate` to generate all your files for you.
There are some common pitfalls to take note of
 * Do one test at a time
 * Solve failing tests from the top down. A test failing may break the ember environment and thus should be fixed before trying to debug any tests that fail after it
 * Give each test the correct name before starting on it. Copy pasting previous tests without renaming is extremely difficult to debug
 * Always use the Ember run loop 

### Ember run loop

**This is a requirement for all tests**

Since there is asynchronous code running in our components, we want to ensure that the test does not miss out on covering
these cases. This is where the wait comes in to play.
Returning wait at the end of your test tells the test to deal with all of ember run loops before exiting.

```
return wait();
```

### What does the integration test setup do for me?

The integration tests make use of some generic code that ties in to the `beforeEach` and `afterEach` functionality.
This code will take all our global js helpers (e.g. `a24`) and create backup copies of them. It will restore these copies once your test is done running.
Doing means that you can replace functions on the global js helpers on the fly without it going to affect any other test.
 
#### But I need my own before/after each

So you need a before/after each of your own but you do not want to overwrite the existing helper code.
Good news! You can pass in your own implementations without it affecting the existing helpers.

You should see something similar to this in the auto generated code
```js
moduleForComponent(
    "your-component-here",
    "Integration | Component | your component here",
    a24GenerateIntegrationSetup(
        Ember,
        setBreakpointForIntegrationTest
    )
);
```
You can simply add your beforeEach and afterEach like this
```js
moduleForComponent(
    "your-component-here",
    "Integration | Component | your component here",
    a24GenerateIntegrationSetup(
        Ember,
        setBreakpointForIntegrationTest,
        function() {
            //BEFORE EACH
        },
        function() {
            //AFTER EACH
        }
    )
);
```
**Note: When referencing `this` in the beforeEach and afterEach you will get the same scope as `this` in your test case.**

The other thing that the test does is that it resets the viewport.
 * Width: `1240px`
 * Height: `720px`
 * ScreenSize: `Desktop`
 * Base Font Size: `15.5px`
 * This will also set the ember-view, that the code renders in, to `zoom: 100%;` since ember defaults it to `50%`;
 * The ember-view will also be wrapped in a scrolling container (known as the viewport) which should allow the browser to be any size without it affecting tests

The helper also resets the delay task for all tests
 
### Other helpers

##### The template compare helper:

This compares the output of your component with that of a template file.
It internally deals with removing and clearing some things off the template that is not consistent like ember-ids and empty styles.
It standardises the html so that we don't have strange behaviour due to spacing, etc.

```
a24TemplateCompare(
    objAssert,
    objThis.$().html().trim(),
    "@@/html/integration/components/your-component-here-test/DescribeScenario.html@@"
);
```

**Note that it will replace the file path between `@@` and `@@` with the actual template contents of that file**

##### The a24DoTask helper:

This is used to run any task (optionally with a delay) that deals with the ember run loop. This ensures that the 
ember run loop does not cause any issues. Note that if you use `Ember.run.later` in your code, or if your component does animations
that you will have to pass in the delay to ensure that the timing still works correctly.
```
a24DoTask(
    0,
    function() {
        // Your code with no delay
    }
);
```
and
```
a24DoTask(
    500,
    function() {
        // Your code with 500ms delay
    }
);
```

**Note that the time is incremental so you just need to tell the function how much longer after the previous a24DoTask it must run. Not the entire time
of the test**

##### The a24SetBrowserWidthByName helper:

This function is used to set the browser width to one of the pre-configured sizes
```
a24SetBrowserWidthByName("desktop");
```

##### The a24SetBrowserWidthByPixels helper:

This function is used to set the browser width to a specific px size
```
a24SetBrowserWidthByPixels(154);
```

##### The a24SetBrowserHeightByPixels helper:

This function is used to set the browser height to a specific px size
```
a24SetBrowserHeightByPixels(567);
```