# COMP1531 Major Project

**✨ 🥜 Toohak 🥜 ✨**

## Contents

[[_TOC_]]

## Change Log

* 16/06: `adminQuizDescriptionUpdate` has correct error conditions added.
* 03/07: See commit for changes - mostly slight fixes to swagger and other tweaks. 4.10. "Error Returning" also has some clearer explanations of the order to throw errors in.
* 04/07: Clarification of the order of errors to be thrown in. The docs automatically changed the ordering from how they're defined. See section 4.10.
* 05/07: Correctly stated auth/logout is `POST` (previously it was `PUT`); GET `admin/quiz/{quizid}` no longer includes thumbnail; `trash/empty` route now correctly includes the `quizIds` in query.
* 08/07: For people using a JSONified object as a token, we have added advice on encoding and decoding in section 4.9;  `/v1/admin/quiz/{quizid}/question` has clarification that the "answer" colour should be randomly generated, not the question. This is apparent when looking at the data types, but it was written incorrectly in the spec there
* 11/07: Clarified for `/v1/admin/quiz/trash` that you are viewing the trash "for the logged in user"
* 17/07: Slight elaborate of what "colours of a question" meant
* 23/07: Fixed mistake in trash swagger; Replaced "c + 1" with "c" in marking criteria for iter3
* 24/07: Aligned comments on `tsc` in iteration 3 to match lecture instructions
* 25/07: Clarification on FINISH_COUNTDOWN length; Clarified some language in the requirements iteration 3 section; `/v1/admin/quiz/{quizid}/session/{sessionid}` removed double token. Typo fix on password update route. Typos fixed in 4 spots e.g. "Session Id does not refer to a valid question within this quiz"
* 02/08: Route `/v1/admin/quiz/{quizid}/sessions` added to spec. Clarified that for iteration 3 requirements modifying the swagger is encouraged but not required.

## 🫡 0. Aims:

1. Demonstrate effective use of software development tools to build full-stack end-user applications.
2. Demonstrate effective use of static testing, dynamic testing, and user testing to validate and verify software systems.
3. Understand key characteristics of a functioning team in terms of understanding professional expectations, maintaining healthy relationships, and managing conflict.
4. Demonstrate an ability to analyse complex software systems in terms of their data model, state model, and more.
5. Understand the software engineering life cycle in the context of modern and iterative software development practices in order to elicit requirements, design systems thoughtfully, and implement software correctly.
6. Demonstrate an understanding of how to use version control and continuous integration to sustainably integrate code from multiple parties.

## 🌈 1. Overview

UNSW has been having severe issues with lecture attendance - student's just aren't coming to class, and they're citing that class isn't interesting enough for them.

UNSW must resort to giving into the limited attention span of students and gamify lecture and tutorial time as much as possible - by doing interactive and colourful quizzes.

However, instead of licensing well-built and tested software, UNSW is hoping to use the pool of extremely talented and interesting COMP1531 students to create their own version to distribute around campus for free. The chosen game to "take inspiration from" is **<a href="https://kahoot.com/">Kahoot</a>**.

The 23T2 cohort of COMP1531 students will build the **backend Javascript server** for a new quiz game platform, **Toohak**. We plan to task future COMP6080 students to build the frontend for Toohak, something you won't have to worry about.

**Toohak** is the questionably-named quiz tool that allows admins to create quiz games, and players to join (without signing up) to participate and compete.

We have already specified a **common interface** for the frontend and backend to operate on. This allows both courses to go off and do their own development and testing under the assumption that both parties will comply with the common interface. This is the interface **you are required to use**.

The specific capabilities that need to be built for this project are described in the interface at the bottom. This is clearly a lot of features, but not all of them are to be implemented at once.

(For legal reasons, this is a joke).

We highly recommend **creating and playing** a Kahoot game to better understand your task:
- To sign up and log in as an admin, go to [kahoot.com](https://kahoot.com/).
- To join a game created by an admin, go to [kahoot.it](https://kahoot.it/).

## 🐭 2. Iteration 0: Getting Started

[You can watch the iteration 0 introductory video here.](https://youtu.be/K2pSKB-xQok) This video is not required watching (the specification is clear by itself) though many students find it useful as a starting point.

### 🐭 2.1. Task

This iteration is designed as a warm-up to help you setup your project, learn Git and project management practises (see Marking Criteria), and understand how your team works together.

In this iteration, you are expected to:
1. Write stub code for the basic functionality of Toohak. The basic functionality is defined as the `adminAuth*`, `adminQuiz*` capabilities/functions, as per the interface section below (2.2).
    * A stub is a function declaration and sample return value (see example below). **Do NOT write the implementation** for the stubbed functions. That is for the next iteration. In this iteration you are just focusing on setting up your function declarations and getting familiar with Git.
    * Each team member must stub **AT LEAST 1** function each.
    * Function stub locations should be inside files named a corresponding prefix e.g. `adminQuiz*` inside `quiz.js`.
    * Return values should match the interface table below (see example below).
```javascript
// Sample stub for the authLoginV1 function
// Return stub value matches table below
function adminAuthLogin(email, password) {
  return {
    authUserId: 1,
  }
}
```
1. Design a structure to store all the data needed for Toohak, and place this in the [code block](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks) inside the `data.md` file. Specifically, you must consider how to store information about **users** and **quizzes** and populate ONE example `user` and `quiz` in your data structure (any values are fine - see example below).
    * Use the interface table (2.2) to help you decide what data might need to be stored. This will require making some educated guesses about what would be required to be stored in order to return the types of data you see.
    * As functions are called, this structure would be populated with more users and quizzes, so consider this in your solution.
    * Focus on the structure itself (object/list composition), rather than the example contents.
```javascript
// Example values inside of a 'user' object might look like this
// NOTE: this object's data is not exhaustive,
// - you may need more/fewer fields stored as you complete this project. 
// We won't be marking you down for missing/adding too much sample data in this iteration.
{
  uId: 1,
  nameFirst: 'Rani',
  nameLast: 'Jiang',
  email: 'ranivorous@gmail.com',
}
```

1. Follow best practices for git and teamwork as discussed in lectures.
    * You are expected to have **at least 1 meeting** with your group, and document the meeting(s) in meeting minutes which should be stored at a timestamped location in your repo (e.g. uploading a word doc/pdf or writing in the GitLab repo Wiki after each meeting).
    * For this iteration you will need to make a minimum of **1 merge request per person** in your group, into the `master` branch.
    * **1 merge request per function** must be made (9 in total).
    * Check out the lab on Git from week 1 to get familiar with using Git.

### 🐭 2.2. Functions to stub

The following are strings: `email`, `password`, `nameFirst`, `nameLast`, `name`, `description`.

The following are integers: `authUserId`, `quizId`.

In terms of file structure:
 * All functions starting with `adminAuth` or `adminUser` go in `auth.js`
 * All functions starting with `adminQuiz` go in `quiz.js`
 * `clear` goes in `other.js`

<table>
  <tr>
    <th>Name & Description</th>
    <th style="width:18%">Data Types</th>
  </tr>
  <tr>
    <td>
      <code>adminAuthRegister</code>
      <br /><br />
      Register a user with an email, password, and names, then returns their <code>authUserId</code> value.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( email, password, nameFirst, nameLast )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{
  authUserId: 1
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminAuthLogin</code>
      <br /><br />
      Given a registered user's email and password returns their <code>authUserId</code> value.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( email, password )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{
  authUserId: 1
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminUserDetails</code>
      <br /><br />
      Given an admin user's authUserId, return details about the user.
      <li>"<code>name</code>" is the first and last name concatenated with a single space between them</li>
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ user:
  {
    userId: 1,
    name: 'Hayden Smith',
    email: 'hayden.smith@unsw.edu.au',
    numSuccessfulLogins: 3,
    numFailedPasswordsSinceLastLogin: 1,
  }
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizList</code>
      <br /><br />
      Provide a list of all quizzes that are owned by the currently logged in user.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ quizzes: [
    {
      quizId: 1,
      name: 'My Quiz',
    }
  ]
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizCreate</code>
      <br /><br />
      Given basic details about a new quiz, create one for the logged in user.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId, name, description )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{
  quizId: 2
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizRemove</code>
      <br /><br />
      Given a particular quiz, permanently remove the quiz.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId, quizId )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizInfo</code>
      <br /><br />
      Get all of the relevant information about the current quiz.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId, quizId )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{
  quizId: 1,
  name: 'My Quiz',
  timeCreated: 1683125870,
  timeLastEdited: 1683125871,
  description: 'This is my quiz',
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizNameUpdate</code>
      <br /><br />
      Update the name of the relevant quiz.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId, quizId, name )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizDescriptionUpdate</code>
      <br /><br />
      Update the description of the relevant quiz.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId, quizId, description )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
  </tr>
  <tr>
    <td>
      <code>clear</code>
      <br /><br />
      Reset the state of the application back to the start.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>()</code> no parameters
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
    <td>
    </td>
  </tr>
</table>

### 🐭 2.3 Marking Criteria
<table>
  <tr>
    <th>Section</th>
    <th>Weighting</th>
    <th>Criteria</th>
  </tr>
  <tr>
    <td>Automarking (Implementation)</td>
    <td>40%</td>
    <td><ul>
      <li>Correct implementation of specified stubs</li>
    </ul></td>
  </tr>
  <tr>
  <tr>
    <td>Documentation</td>
    <td>20%</td>
    <td><ul>
      <li>Clear and obvious effort and time gone into thinking about possible representation of data structure for the project containing users and quizzes, inside of <code>data.md</code>.</li>
    </ul></td>
  </tr>
  <tr>
    <td>Git Practices</td>
    <td>30%</td>
    <td><ul>
      <li>Meaningful and informative git commit messages being used (see <a href="https://initialcommit.com/blog/git-commit-messages-best-practices#:~:text=commit%20message%20style.-,General%20Commit%20Message%20Guidelines,-As%20a%20general">examples</a>)</li>
      <li>Effective use of merge requests (from branches being made) across the team (as covered in lectures)</li>
      <li>At least 1 merge request per person and 1 merge request per function (9 in total) made into the <code>master</code> branch</li>
    </ul></td>
  </tr>
  <tr>
    <td>Project Management & Teamwork</td>
    <td>10%</td>
    <td><ul>
      <li>A generally equal contribution between team members</li>
      <li>Effective use of course-provided MS Teams for communication, demonstrating an ability to competently manage teamwork online</li>
      <li>Had a meeting together that involves planning and managing tasks, and taken notes from said meeting (and stored in a logical place in the repo e.g. Wiki section)</li>
    </ul></td>
  </tr>
</table>

### 🐭 2.4. Dryrun

We have provided a dryrun for iteration 0 consisting of one test for each function. Passing these tests means you have a correct implementation for your stubs, and have earned the marks for the automarking component iteration 0.

To run the dryrun, you should on a CSE machine (i.e. using `VLAB` or `ssh`'ed into CSE) be in the root directory of your project (e.g. `/project-backend`) and use the command:

```bash
1531 dryrun 0
```

### 🐭 2.5. Submission

Please see section 6 for information on **due date** and on how you will **demonstrate this iteration**.

## 🐶 3. Iteration 1: Basic Functionality and Tests


[You can watch the iteration 1 introductory video here.](https://youtu.be/VPlNNy-gK2w) This video is not required watching (the specification is clear by itself) though many students will watch this for the practical demo of how to get started.

### 🐶 3.1. Task

In this iteration, you are expected to:

1. Write tests for and implement the basic functionality of Toohak. The basic functionality is defined as the `adminAuth*`, `adminQuiz*` capabilities/functions, as per the interface section below.
    * Test files you add should all be in the form `*.test.js`.
    * Do NOT attempt to try and write or start a web server. Don't overthink how these functions are meant to connect to a frontend yet. That is for the next iteration. In this iteration you are just focusing on the basic backend functionality.

2. Write down any assumptions that you feel you are making in your interpretation of the specification.
    * These should be placed in the `assumptions.md` file in the root of your repository. If you've not written markdown before (we assume most of you haven't), it's not necessary to research the format. [Markdown](https://www.markdownguide.org/basic-syntax/) is essentially plain text with a few extra features for basic formatting. You can just stick with plain text if you find that easier.
    * We will only be marking the quality of SIX of your assumptions. You can indicate which ones you would like marked, otherwise we will look at the first six.

3. Follow best practices for git, project management, and effective teamwork, as discussed in lectures.
    * The marking will be heavily biased toward how well you follow good practices and work together as a team. Just having a "working" solution at the end is not, on its own, sufficient to even get a passing mark.

    * You need to use the [**GitLab Issue Boards**](https://docs.gitlab.com/ee/user/project/issue_board.html) for your task tracking and allocation. Spend some time getting to know how to use the taskboard. If you would like to use another collaborative task tracker e.g. Jira, Trello, Airtable, etc. you must first get approval from your tutor and grant them administrator access to your team board.

    * You are expected to meet regularly with your group and document the meetings via meeting minutes, which should be stored at a timestamped location in your repo (e.g. uploading a word doc/pdf or writing in the GitLab repo Wiki after each meeting).

    * You should have regular standups and be able to demonstrate evidence of this to your tutor.

    * For this iteration, you will need to collectively make a minimum of **12 merge requests** into `master`.


### 🐶 3.2. Storing data

Nearly all of the functions will likely have to reference some "data source" to store information. E.g. If you register two users, create two quizzes, all of that information needs to be "stored" somewhere. The most important thing for iteration 1 is not to overthink this problem.

Firstly, you should **not** use an SQL database, or something like firebase.

Secondly, you don't need to make anything persist. What that means is that if you run all your tests, and then run them again later, it's OK for the data to be "fresh" each time you run the tests. We will cover persistence in another iteration.

Inside `src/dataStore.js` we have provided you with an object called `data` which will contain the information that you will need to access across multiple functions. An explanation of how to `get` and `set` the data is in `dataStore.js`. You will need to determine the internal structure of the object. If you wish, you are allowed to modify this data structure.

For example, you could define a structure in a file that is empty, and as functions are called, the structure populates and fills up like the one below:

```javascript
let data = {
    users: [
        {
            id: 1,
            nameFirst: 'user1',
        },
        {
            id: 2,
            nameFirst: 'user2',
        },
    ],
    quizzes: [
        {
            id: 1,
            name: 'quiz1',
        },
        {
            id: 2,
            name: 'quiz2',
        },
    ],
}
```
### 🐶 3.3. Implementing and testing features

You should first approach this project by considering its distinct "features". Each feature should add some meaningful functionality to the project, but still be as small as possible. You should aim to size features as the smallest amount of functionality that adds value without making the project more unstable. For each feature you should:

1. Create a new branch.
1. Write function stub/s for your feature. This may have been completed in iteration 0 for some functions.
1. Write tests for that feature and commit them to the branch. These will fail as you have not yet implemented the feature.
1. Implement that feature.
1. Make any changes to the tests such that they pass with the given implementation. You should not have to do a lot here. If you find that you are, you're not spending enough time on your tests.
1. Consider any assumptions you made in the previous steps and add them to `assumptions.md`.
1. Create a merge request for the branch.
1. Get someone in your team who **did not** work on the feature to review the merge request.
1. Fix any issues identified in the review.
1. After merge request is **approved** by a different team member, merge the merge request into `master` .

For this project, a feature is typically sized somewhere between a single function, and a whole file of functions (e.g. `auth.js`). It is up to you and your team to decide what each feature is.

There is no requirement that each feature is implemented by only one person. In fact, we encourage you to work together closely on features, especially to help those who may still be coming to grips with Javascript.

Please pay careful attention to the following:

* We want to see **evidence that you wrote your tests before writing the implementation**. As noted above, the commits containing your initial tests should appear *before* your implementation for every feature branch. If we don't see this evidence, we will assume you did not write your tests first and your mark will be reduced.
* Merging in merge requests with failing tests is **very bad practice**. Not only does this interfere with your team's ability to work on different features at the same time, and thus slow down development, it is something you will be **penalised** for in marking.
* Similarly, merging in branches with untested features is also **bad practice**. We will assume, and you should too, that any code without tests does not work.
* Pushing directly to `master` is not possible for this repo. The only way to get code into `master` is via a merge request. If you discover you have a bug in `master` that got through testing, create a bugfix branch and merge that in via a merge request.
* As is the case with any system or functionality, there will be some things that you can test extensively, some things that you can test sparsely/fleetingly, and some things that you can't meaningfully test at all. You should aim to test as extensively as you can, and make judgements as to what things fall into what categories.

### 🐶 3.4. Testing guidelines & advice

#### 🐶 3.4.1. Test Structure
The tests you write should be as small and independent as possible. This makes it easier to identify why a particular test may be failing. Similarly, try to make it clear what each test is testing for. Meaningful test names and documentation help with this. An example of how to structure tests has been done in:

* `src/echo.js`
* `src/echo.test.js`

_The echo functionality is tested, both for correct behaviour and for failing behaviour. As echo is relatively simple functionality, only 2 tests are required. For the larger features, you will need many tests to account for many different behaviours._

#### 🐶 3.4.2. Black Box Testing

Your tests should be *black box* unit tests:
  * Black box means they should not depend your specific implementation, but rather work with *any* faithful implementation of the project interface specification. I.e. you should design your tests such that if they were run against another group's backend they would still pass.
  * For iteration 1, you should *not* be importing the `data` object itself or directly accessing it via the `get` or `set` functions from `src/dataStore.js` inside your tests.
  * Unit tests mean the tests focus on testing particular functions, rather than the system as a whole. Certain unit tests will depend on other tests succeeding. It's OK to write tests that are only a valid test if other functions are correct (e.g. to test `quiz` functions you can assume that `auth` is implemented correctly).

This will mean you will use code like this to test login, for instance:

```javascript
let result = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella')
adminAuthLogin('validemail@gmail.com', '123abc!@#') // Expect to work since we registered
```

#### 🐶 3.4.3. Resetting state

You should reset the state of the application (e.g. deleting all users, quizzes, etc.) at the start of every test. That way you know none of them are accidentally dependent on an earlier test. You can use a function for this that is run at the beginning of each test (hint: `clear`).

#### 🐶 3.4.4. Other help

* If you find yourself needing similar code at the start of a series of tests, consider using Jest's [**beforeEach**](https://jestjs.io/docs/api#beforeeachfn-timeout) to avoid repetition.

Sometimes you may ask "What happens if X?". In cases where we don't specify behaviour, we call this **undefined behaviour**. When something has undefined behaviour, you can have it behave any reasonable way you want - because there is no expectation or assumption of how it should act.

A common question asked throughout the project is usually "How can I test this?" or "Can I test this?". In any situation, most things can be tested thoroughly. However, some things can only be tested sparsely, and on some other rare occasions, some things can't be tested at all. A challenge of this project is for you to use your discretion to figure out what to test, and how much to test. Often, you can use the functions you've already written to test new functions in a black-box manner.

### 🐶 3.5. Iteration 1 Interface

The functions required for iteration 1 are described below.

All error cases should return <code>{error: 'specific error message here'}</code>, where the error message in quotation marks can be anything you like (this will not be marked).

The following are strings: `email`, `password`, `nameFirst`, `nameLast`, `name`, `description`.

The following are integers: `authUserId`, `quizId`.

<table>
  <tr>
    <th>Name & Description</th>
    <th style="width:18%">Data Types</th>
    <th style="width:32%">Error returns</th>
  </tr>
  <tr>
    <td>
      <code>adminAuthRegister</code>
      <br /><br />
      Register a user with an email, password, and names, then returns their <code>authUserId</code> value.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( email, password, nameFirst, nameLast )</code>
      <br /><br />
      <b>Return type if no error:</b><br />
      <code>{ authUserId }</code>
    </td>
    <td>
      <b>Return object <code>{error: 'specific error message here'}</code></b> when any of:
      <ul>
        <li>Email address is used by another user</li>
        <li>Email does not satisfy this: https://www.npmjs.com/package/validator (validator.isEmail function)</li>
        <li>NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes</li>
        <li>NameFirst is less than 2 characters or more than 20 characters</li>
        <li>NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes</li>
        <li>NameLast is less than 2 characters or more than 20 characters</li>
        <li>Password is less than 8 characters</li>
        <li>Password does not contain at least one number and at least one letter</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminAuthLogin</code>
      <br /><br />
      Given a registered user's email and password returns their <code>authUserId</code> value.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( email, password )</code>
      <br /><br />
      <b>Return type if no error:</b><br />
      <code>{ authUserId }</code>
    </td>
    <td>
      <b>Return object <code>{error: 'specific error message here'}</code></b> when any of:
      <ul>
        <li>Email address does not exist</li>
        <li>Password is not correct for the given email</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminUserDetails</code>
      <br /><br />
      Given an admin user's authUserId, return details about the user.
      <li>"name" is the first and last name concatenated with a single space between them</li>
      <li>numSuccessfulLogins includes logins direct via registration, and is counted from the moment of registration starting at 1</li>
      <li>numFailedPasswordsSinceLastLogin is reset every time they have a successful login, and simply counts the number of attempted logins that failed due to incorrect password, only since the last login</li>
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId )</code>
      <br /><br />
      <b>Return type if no error:</b><br />
      <code>{ user:
  {
    userId,
    name,
    email,
    numSuccessfulLogins,
    numFailedPasswordsSinceLastLogin,
  }
}</code>
    </td>
    <td>
      <b>Return object <code>{error: 'specific error message here'}</code></b> when any of:
      <ul>
        <li>AuthUserId is not a valid user</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizList</code>
      <br /><br />
      Provide a list of all quizzes that are owned by the currently logged in user.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId )</code>
      <br /><br />
      <b>Return type if no error:</b><br />
      <code>{ quizzes: [
    {
      quizId,
      name,
    }
  ]
}</code>
    </td>
    <td>
      <b>Return object <code>{error: 'specific error message here'}</code></b> when any of:
      <ul>
        <li>AuthUserId is not a valid user</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizCreate</code>
      <br /><br />
      Given basic details about a new quiz, create one for the logged in user.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId, name, description )</code>
      <br /><br />
      <b>Return type if no error:</b><br />
      <code>{ quizId }</code>
    </td>
    <td>
      <b>Return object <code>{error: 'specific error message here'}</code></b> when any of:
      <ul>
        <li>AuthUserId is not a valid user</li>
        <li>Name contains any characters that are not alphanumeric or are spaces</li>
        <li>Name is either less than 3 characters long or more than 30 characters long</li>
        <li>Name is already used by the current logged in user for another quiz</li>
        <li>Description is more than 100 characters in length (note: empty strings are OK)</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizRemove</code>
      <br /><br />
      Given a particular quiz, permanently remove the quiz.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId, quizId )</code>
      <br /><br />
      <b>Return type if no error:</b><br />
      <code>{ }</code>
    </td>
    <td>
      <b>Return object <code>{error: 'specific error message here'}</code></b> when any of:
      <ul>
        <li>AuthUserId is not a valid user</li>
        <li>Quiz ID does not refer to a valid quiz</li>
        <li>Quiz ID does not refer to a quiz that this user owns</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizInfo</code>
      <br /><br />
      Get all of the relevant information about the current quiz.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId, quizId )</code>
      <br /><br />
      <b>Return type if no error:</b><br />
      <code>{
  quizId,
  name,
  timeCreated,
  timeLastEdited,
  description,
}</code>
    </td>
    <td>
      <b>Return object <code>{error: 'specific error message here'}</code></b> when any of:
      <ul>
        <li>AuthUserId is not a valid user</li>
        <li>Quiz ID does not refer to a valid quiz</li>
        <li>Quiz ID does not refer to a quiz that this user owns</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizNameUpdate</code>
      <br /><br />
      Update the name of the relevant quiz.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId, quizId, name )</code>
      <br /><br />
      <b>Return type if no error:</b><br />
      <code>{ }</code>
    </td>
    <td>
      <b>Return object <code>{error: 'specific error message here'}</code></b> when any of:
      <ul>
        <li>AuthUserId is not a valid user</li>
        <li>Quiz ID does not refer to a valid quiz</li>
        <li>Quiz ID does not refer to a quiz that this user owns</li>
        <li>Name contains any characters that are not alphanumeric or are spaces</li>
        <li>Name is either less than 3 characters long or more than 30 characters long</li>
        <li>Name is already used by the current logged in user for another quiz</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminQuizDescriptionUpdate</code>
      <br /><br />
      Update the description of the relevant quiz.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( authUserId, quizId, description )</code>
      <br /><br />
      <b>Return type if no error:</b><br />
      <code>{ }</code>
    </td>
    <td>
      <b>Return object <code>{error: 'specific error message here'}</code></b> when any of:
      <ul>
        <li>AuthUserId is not a valid user</li>
        <li>Quiz ID does not refer to a valid quiz</li>
        <li>Quiz ID does not refer to a quiz that this user owns</li>
        <li>Description is more than 100 characters in length (note: empty strings are OK)</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>clear</code>
      <br /><br />
      Reset the state of the application back to the start.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( )</code>
      <br /><br />
      <b>Return type if no error:</b><br />
      <code>{ }</code>
    </td>
    <td>
    </td>
  </tr>
</table>

### 🐶 3.6. Authorisation

Elements of securely storing passwords and other tricky authorisation methods are not required for iteration 1. You can simply store passwords plainly, and use the user ID to identify each user. We will discuss ways to improve the quality and methods of these capabilities in the later iterations.

Note that the `authUserId` variable is simply the user ID of the user who is making the function call. For example,
* A user registers an account with Toohak and is assigned some integer ID, e.g. `42` as their user ID.
* When they make subsequent calls to functions, their user ID - in this case, `42` - is passed in as the `authUserId` argument.

Since `authUserId` refers to the user ID of the user calling the functions, you do NOT need to store separate user IDs (e.g. a uId or userId + a authUserId) to identify each user in your data structure - you only need to store one user ID. How you name this user ID property in your data structure is up to you.

### 🐶 3.7. Bad Assumptions

Here are a few examples of bad assumptions:

* Assume that all groups store their data in a field called data which is located in dataStore.js
* Assume all individual return values are returned as single values rather than being stored in an object
* Assume the functions are written correctly
* Assume the input authUserId is valid

Bad assumptions are usually ones that directly contradict an explicit or implicit requirement in the specification. Good assumptions are ones that fill holes or gaps in requirements. 

Avoid "assumptions" that simply describe the implementation details irrelevant to the client, e.g. a particular method of ID generation. Instead, consider the scenarios in which the expected behaviour of Toohak is not addressed clearly in the spec and document, with reasoning, your assumptions regarding such scenarios.

### 🐶 3.8. Working in parallel

This iteration provides challenges for many groups when it comes to working in parallel. Your group's initial reaction will be that you need to complete registration before you can complete quiz creation, and then quiz creation must be done before you update a quiz name, etc.

There are several approaches that you can consider to overcome these challenges:

* Have people working on down-stream tasks (like the quiz implementation) work with stubbed versions of the up-stream tasks. E.g. The register function is stubbed to return a successful dummy response, and therefore two people can start work in parallel.
* Co-ordinate with your team to ensure prerequisite features are completed first (e.g. Giuliana completes `adminAuthRegister` on Monday meaning Hayden can start `adminQuizCreate` on Tuesday).
* You can pull any other remote branch into your own using the command `git pull origin <branch_name>`.
    * This can be helpful when two people are working on functions on separate branches where one function is a prerequisite of the other, and an implementation is required to keep the pipeline passing.
    * You should pull from `master` on a regular basis to ensure your code remains up-to-date.

### 🐶 3.9. Marking Criteria

<table>
  <tr>
    <th>Section</th>
    <th>Weighting</th>
    <th>Criteria</th>
  </tr>
  <tr>
    <td>Automarking (Testing & Implementation)</td>
    <td>40%</td>
    <td><ul>
      <li>Correct implementation of specified functions</li>
      <li>Correctly written tests based on the specification requirements</li>
    </ul></td>
  </tr>
  <tr>
    <td>Code Quality</td>
    <td>25%</td>
    <td><ul>
      <li>Demonstrated an understanding of good test <b>coverage</b> (no need to run a coverage checker in this iteration)</li>
      <li>Demonstrated an understanding of the importance of <b>clarity</b> in communicating the purpose of tests and code</li>
      <li>Demonstrated an understanding of thoughtful test <b>design</b></li>
      <li>Appropriate use of Javascript data structures (arrays, objects, etc.)</li>
      <li>Appropriate style as covered so far in introductory programming.
    </ul></td>
  </tr>
  <tr>
    <td>Git Practices</td>
    <td>15%</td>
    <td><ul>
      <li>Meaningful and informative git commit names being used</li>
      <li>Effective use of merge requests (from branches being made) across the team (as covered in lectures)</li>
      <li>At least 12 merge requests into master made</li>
    </ul></td>
  </tr>
  <tr>
    <td>Project Management & Teamwork</td>
    <td>15%</td>
    <td><ul>
      <li>A generally equal contribution between team members</li>
      <li>Clear evidence of reflection on group's performance and state of the team, with initiative to improve in future iterations</li>
      <li>Effective use of course-provided MS Teams for communication, demonstrating an ability to competently manage teamwork online</li>
      <li>Use of issue board on Gitlab OR another tool approved by your tutor to track and manage tasks</li>
      <li>Effective use of agile methods such as standups</li>
      <li>Minutes/notes taken from group meetings (and stored in a logical place in the repo)</li>
    </ul></td>
  </tr>
  <tr>
    <td>Assumptions markdown file</td>
    <td>5%</td>
    <td><ul>
      <li>Clear and obvious effort and time gone into thinking about possible assumptions that are being made when interpreting the specification</li>
    </ul></td>
  </tr>
</table>

For this and for all future milestones, you should consider the other expectations as outlined in section 6 below.

The formula used for automarking in this iteration is:

`Mark = t * i` (Mark equals `t` multiplied by `i`)

Where:
 * `t` is the mark you receive for your tests running against your code (100% = your implementation passes all of your tests)
 * `i` is the mark you receive for our course tests (hidden) running against your code (100% = your implementation passes all of our tests)

### 🐶 3.10. Dryrun

We have provided a very simple dryrun for iteration 1 consisting of a few tests, including your implementation of `adminAuthRegister`, `adminAuthLogin`, `adminQuizCreate`. These only check the format of your return types and simple expected behaviour, so do not rely on these as an indicator of the correctness of your implementation or tests.

To run the dryrun, you should be on a CSE machine (i.e. using `VLAB` or `ssh`'ed into CSE) and in the root directory of your project (e.g. `/project-backend`) and use the command:

```bash
1531 dryrun 1
```

Tips to ensure dryrun runs successfully:
* Files used for imports are appended with `.js` e.g. `import { clearV1 } from './other.js';`
* Files sit within the `/src` directory

### 🐶 3.11. Submission & Peer Assessment

Please see section 6 for information on **due date** and on how you will **demonstrate this iteration**.

Please see section 7.5 for information on **peer assessment**.


## 🐝 4. Iteration 2: Building a Web Server

### 🐝 4.1. Task

In this iteration, more features were added to the specification, and the focus has been changed to HTTP endpoints. Most of the theory surrounding iteration 2 is covered in week 4-5 lectures. Note that there will still be some features of the frontend that will not work because the routes will not appear until iteration 3. There is no introductory video for iteration 2.

Iteration 2 both reuses a lot of work from iteration 1, as well as has new work. Most of the work from iteration 1 can be recycled, but the following consideration(s) need to be made from previous work:
 * `DELETE /v1/admin/quiz/{quizid}` now requires also that all sessions for this quiz must be in END state. This was not a requirement for a similar route in iteration 1.

In this iteration, you are expected to:

1. Make adjustments to your existing code as per any feedback given by your tutor for iteration 1.
2. Migrate to Typescript by changing `.js` file extensions to `.ts`.
3. Implement and test the HTTP Express server according to the [entire interface provided in the specification](swagger.yaml).

    * Part of this section may be automarked.

    * Your implementation should build upon your work in iteration 1, and ideally your HTTP layer is just a wrapper for underlying functions you've written that handle the logic, see week 4 content.

    * Your implementation will need to include persistence of data (see section 4.7).

    * Introduce tokens for session management (see 5.7).

    * You can structure your tests inside a `/tests` folder (or however you choose), as long as they are appended with `.test.ts`. For this iteration and iteration 3 we will only be testing your HTTP layer of tests. You may still wish to use your iteration 1 tests and simply wrap up them - that is a design choice up to you. An example of an HTTP test can be found in section 4.4.

    * You do not have to rewrite all of your iteration 1 tests as HTTP tests - the latter can test the system at a higher level. For example, to test a success case for `POST /v1/admin/quiz/{quizid}/transfer` via HTTP routes you will need to call `POST /v1/admin/auth/register` and `POST /v1/admin/quiz`; this means you do not need the success case for those two functions seperately. Your HTTP tests will need to cover all success/error conditions for each endpoint, however.

4. Ensure your code is linted to the provided style guide

    * `eslint` should be added to your repo via `npm` and then added to your `package.json` file to run when the command `npm run lint` is run. The provided `.eslintrc.json` file is *very* lenient, so there is no reason you should have to disable any additional checks. See section 4.5 below for instructions on adding linting to your pipeline.

    * You are required to edit the `gitlab-ci.yml` file, as per section 4.5 to add linting to the code on `master`. **You must do this BEFORE merging anything from iteration 2 into `master`**, so that you ensure `master` is always stable.

5. Continue demonstrating effective project management and effective git usage

    * You will be heavily marked for your use of thoughtful project management and use of git effectively. The degree to which your team works effectively will also be assessed.

    * As for iteration 1, all task tracking and management will need to be done via the GitLab Issue Board or another tracking application approved by your tutor.

    * As for iteration 1, regular group meetings must be documented with meeting minutes which should be stored at a timestamped location in your repo (e.g. uploading a word doc/pdf or writing in the GitLab repo wiki after each meeting).

    * As for iteration 1, you must be able to demonstrate evidence of regular standups.

    * You are required to regularly and thoughtfully make merge requests for the smallest reasonable units, and merge them into `master`.

6. (Recommended) Remove any type errors in your code

    * Run `npm run tsc` and incrementally fix all type errors.
    
    * Either choose to change one file at a time, or change all file extensions and use `// @ts-nocheck` at the beginning of select files to disable checking on that specific file, omitting errors.

    * There are no explicit marks this term for completing this step, however:
      * Groups who ensure their code are type-safe tend to perform much better in the automarker
      * For iteration 3, if you make your entire code type safe you will receive 10 bonus marks! Starting early makes that easier!

A frontend has been built that you can use in this iteration, and use your backend to power it (note: an incomplete backend will mean the frontend cannot work). You can, if you wish, make changes to the frontend code, but it is not required. The source code for the frontend is only provided for your own fun or curiosity.

**As part of this iteration it is required that your backend code can correctly power the frontend**. You should conduct acceptance tests (run your backend, run the frontend and check that it works) prior to submission.

In this iteration we also expect for you to improve on any feedback left by tutors in iteration 1.

### 🐝 4.2. Running the server

To run the server you can the following command from the root directory of your project:

```bash
npm start
```

This will start the server on the port in the src/server.ts file, using `ts-node`.

If you get an error stating that the address is already in use, you can change the port number in `config.json` to any number from `49152` to `65535`. Is it likely that another student may be using your original port number.

### 🐝 4.3. Implementing and testing features

You should first approach this project by considering its distinct "features". Each feature should add some meaningful functionality to the project, but still be as small as possible. You should aim to size features as the smallest amount of functionality that adds value without making the project more unstable. For each feature you should:

1. Create a new branch.
2. Write tests for that feature and commit them to the branch. These will fail as you have not yet implemented the feature.
3. Implement that feature.
4. Make any changes to the tests such that they pass with the given implementation. You should not have to do a lot here. If you find that you are, you're not spending enough time on your tests.
5. Create a merge request for the branch.
6. Get someone in your team who **did not** work on the feature to review the merge request. When reviewing, **not only should you ensure the new feature has tests that pass.**
7. Fix any issues identified in the review.
8. Merge the merge request into master.

For this project, a feature is typically sized somewhere between a single function, and a whole file of functions (e.g. `auth.ts`). It is up to you and your team to decide what each feature is.

There is no requirement that each feature be implemented by only one person. In fact, we encourage you to work together closely on features, especially to help those who may still be coming to grips with Javascript.

Please pay careful attention to the following:

Your tests, keep in mind the following:
* We want to see **evidence that you wrote your tests before writing the implementation**. As noted above, the commits containing your initial tests should appear *before* your implementation for every feature branch. If we don't see this evidence, we will assume you did not write your tests first and your mark will be reduced.
* You should have black-box tests for all tests required (i.e. testing each function/endpoint). However, you are also welcome to write whitebox unit tests in this iteration if you see that as important.
* Merging in merge requests with failing pipelines is **very bad practice**. Not only does this interfere with your teams ability to work on different features at the same time, and thus slow down development, it is something you will be penalised for in marking.
* Similarly, merging in branches with untested features is also **very bad practice**. We will assume, and you should too, that any code without tests does not work.
* Pushing directly to `master` is not possible for this repo. The only way to get code into `master` is via a merge request. If you discover you have a bug in `master` that got through testing, create a bugfix branch and merge that in via a merge request.
* As is the case with any system or functionality, there will be some things that you can test extensively, some things that you can test sparsely/fleetingly, and some things that you can't meaningfully test at all. You should aim to test as extensively as you can, and make judgements as to what things fall into what categories.

### 🐝 4.4. Testing the interface

In this iteration, **the layer of abstraction has changed to the HTTP level**, meaning that you are only required to write integration tests that check the HTTP endpoints, rather than the style of tests you write in iteration 1 where the behaviour of the Javascript functions themselves was tested.

You will need to check as appropriate for each success/error condition:
* The return value of the endpoint;
* The behaviour (side effects) of the endpoint; and
* The status code of the response.

An example of how you would now test the echo interface is in `echo.test.ts`.

### 🐝 4.5. Testing time-based properties

Some routes will have timestamps as properties. The tricky thing about timestamps is that the client makes a request at a known time, but there is a delay between when the client sends the request and when the server processes it. E.G. You might send an HTTP request to create a quiz, but the server takes 0.3 seconds until it actually creates the object, which means that the timestamp is 0.3 seconds out of sync with what you'd expect.

To solve this, when checking if timestamps are what you would expect, just check that they are within a 1 second range.

E.G. If I create a quiz at 12:22:21pm I will then check in my tests if the timestamp is somewhere between 12:22:21pm and 12:22:22pm.

### 🐝 4.6. Continuous Integration

With the introduction of linting to the project with `ESlint`, you will need to manually edit the `gitlab-ci.yml` file to lint code within the pipeline. This will require the following:
 * Addition of `npm run lint` as a script under a custom `linting` variable, apart of `stage: checks`.

Refer to the lecture slides on continuous integration to find exactly how you should add these.

### 🐝 4.7. Storing data

You are required to store data persistently in this iteration.

Modify your backend such that it is able to persist and reload its data store if the process is stopped and started again. The persistence should happen at regular intervals so that in the event of unexpected program termination (e.g. sudden power outage) a minimal amount of data is lost. You may implement this using whatever method of serialisation you prefer (e.g. JSON).

### 🐝 4.8. Versioning

You might notice that some routes are prefixed with `v1`. Why is this? When you make changes to specifications, it's usually good practice to give the new function/capability/route a different unique name. This way, if people are using older versions of the specification they can't accidentally call the updated function/route with the wrong data input. If we make changes to these routes in iteration 3, we will increment the version to `v2`.

Hint: Yes, your `v1` routes can use the functions you had in iteration 1, regardless of whether you rename the functions or not. The layer of abstraction in iteration 2 has changed from the function interface to the HTTP interface, and therefore your 'functions' from iteration 1 are essentially now just implementation details, and therefore are completely modifiable by you.

### 🐝 4.9. User Sessions
Iteration 2 introduces the concept of <b>sessions</b>. With sessions, when a user logs in or registers, they receive a "token" (think of it like a ticket to a concert). These tokens are stored on the web browser (something the frontend handles), and nearly every time that user wants to make a request to the server, they will pass this "token" as part of this request. In this way, the server is able to take this token, look at it (like checking a ticket), and figure out who the user is.

The difference between an <code>authUserId</code> and a <code>token</code> is that an <code>authUserId</code> is a permanent identifier of a user, whereas a new token is generated upon each new login for a user.

A token (to represent a session) for iteration 2 can be as simple a randomly generated number (converted to a string as per the interface specifications) and stored as one of many possible sessions against a specific user.

A token is not necessarily a user session, but it will likely contain a user session. A good example of a token structure might be:
```text
token = {
  sessionId: 2930420934
  userId: 233
}
```

In this structure, this also means it's possible to "log out" a particular user's session without logging out other sessions. I.e. One user can log in on two different browser tabs, click logout on tab 1, but still functionally use the website on tab 2.

If you pass a JSONified object (as opposed to just a string or a number) as a token, we recommend that 
you use 
[encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) 
and [decodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) to encode it to be friendly for transfer over URLs.

### 🐝 4.10. Error returning

Either a `400 (Bad Request)` or `401 (Unauthorized)` or `403 (Forbidden)` is thrown when something goes wrong. A `400` error refers to issues with user input; a `401` error refers to when someone does not attempt to authenticate properly, and a a `403` error refers to issues with authorisation. Most of the routes in the API interface provided through types of these errors under various conditions.

To throw one of these errors, simply use the code `res.status(400).send(JSON.stringify({ error: 'specific error message here' }))` or `res.status(400).json({ error: 'specific error message here' })` in your server where 400 is the error.

Errors are thrown in the order that they are defined in the swagger doc, which is typically 401, then 403, then 400.

### 🐝 4.11. Working with the frontend

There is a SINGLE repository available for all students at 
https://nw-syd-gitlab.cseunsw.tech/COMP1531/23T2/project-frontend. 
You can clone this frontend locally. 

Please remember to pull regularly as we continue to work on the frontend

If you run the frontend at the same time as your express server is running on the backend, then you can power the frontend via your backend.

Please note: The frontend may have very slight inconsistencies with expected behaviour outlined in the specification. Our automarkers will be running against your compliance to the specification. The frontend is there for further testing and demonstration.

Please note: This frontend is experiment. It will not be perfect and is always under development.

#### 🐝 4.11.1. Example implementation

A working example of the Toohak application can be used at https://cgi.cse.unsw.edu.au/~cs1531/23T2/toohak/a/login. This is not a gospel implementation that dictates the required behaviour for all possible occurrences. Our implementation will make reasonable assumptions just as yours will, and they might be different, and that's fine. However, you may use this implementation as a guide for how your backend should behave in the case of ambiguities in the spec.

The data is reset occasionally, but you can use this link to play around and get a feel for how the application should behave.

Please note: This frontend and backend that powers this example is experiment. It will not be perfect and is always under 
development.

### 🐝 4.12. Recommended approach

Our recommendation with this iteration is that you start out trying to implement the new functions similarly to how you did in iteration 1.

1. Write HTTP tests. These will fail as you have not yet implemented the feature.
    * Hint: It would be a good idea to consider good test design and the usage of helper functions for your HTTP tests. Is there a way so that you do not have to completely rewrite your tests from iteration 1?
2. Implement the feature and write the Express route/endpoint for that feature too.
  * HINT: make sure GET and DELETE requests utilise query parameters, whereas POST and PUT requests utilise JSONified bodies.
3. Run the tests and continue following 4.3. as necessary.

**Please note, when you have a single route (e.g. `/my/route/name`) alongside a wildcard route (e.g. `/my/route/{variable}`) you need to define the single route before the variable route.**

### 🐝 4.13. Marking Criteria

<table>
  <tr>
    <th>Section</th>
    <th>Weighting</th>
    <th>Criteria</th>
  </tr>
  <tr>
    <td>Automarking (Testing & Implementation)</td>
    <td>50%</td>
    <td><ul>
      <li>Correct implementation of specified functions</li>
      <li>Correctly written tests based on the specification requirements</li>
      <li>Correctly linted code</li>
    </ul></td>
  </tr>
  <tr>
    <td>Code Quality</td>
    <td>30%</td>
    <td><ul>
      <li>Demonstrated an understanding of good test <b>coverage</b></li>
      <li>Demonstrated an understanding of the importance of <b>clarity</b> on the communication test and code purposes</li>
      <li>Demonstrated an understanding of thoughtful test <b>design</b></li>
      <li>Appropriate use of Javascript data structures (arrays, objects, etc.)</li>
      <li>Appropriate style as described in section 7.4</li>
      <li>Appropriate application of good software design practices</li>
      <li>Implementation of persistent state</li>
      <li>Demonstrated successful connection of the supplied frontend to the backend code required for iteration 2</li>
    </ul></td>
  </tr>
  <tr>
    <td>Git & Project Management</td>
    <td>20%</td>
    <td><ul>
      <li>Correctly altered gitlab-ci.yml file, before new code has been merged to master</li>
      <li>Meaningful and informative git commit names being used</li>
      <li>At least 12 merge requests into master made</li>
      <li>A generally equal contribution between team members</li>
      <li>Clear evidence of reflection on group's performance and state of the team, with initiative to improve in future iterations</li>
      <li>Effective use of course-provided MS Teams for communicating, demonstrating an ability to communicate and manage effectivelly digitally</li>
      <li>Use of issue board on Gitlab to track and manage tasks</li>
      <li>Effective use of agile methods such as standups</li>
      <li>Minutes/notes taken from group meetings (and stored in a logical place in the repo)</li>
    </ul></td>
  </tr>
</table>

For this and for all future milestones, you should consider the other expectations as outlined in section 7 below.

The formula used for automarking in this iteration is:

`Automark = 95*(t * i) + 5*e`
(Mark equals 95% of `t` multiplied by `i` plus 5% of `e`). This formula produces a value between 0 and 1.

Where:
 * `t` is the mark between 0-1 you receive for your tests running against your code (100% = your implementation passes all of your tests)
 * `i` is the mark between 0-1 you receive for our course tests (hidden) running against your code (100% = your implementation passes all of our tests)
 * `e` is the score between 0-1 achieved by running eslint against your code with the provided configuration


### 🐝 4.14. Dryrun

The dryrun checks the format of your return types and simple expected behaviour for a few basic routes. Do not rely on these as an indicator for the correctness of your implementation or tests.

To run the dryrun, you should be in the root directory of your project (e.g. `/project-backend`) and use the command:

```bash
1531 dryrun 2
```

### 🐝 4.15. Submission & Peer Assessment

Please see section 6 for information on **due date** and on how you will **demonstrate this iteration**.

Please see section 7.5 for information on **peer assessment**.


## 🦆 5. Iteration 3: Completing the Lifecycle

There is no pre-recorded introductory video for this iteration, as we will cover this iteration in regular lectures.

Iteration 3 builds off all of the work you've completed in iteration 1 and 2. If you haven't completed the implementation of iteration 2, you must complete it as part of this iteration. Most of the work from iteration 1 and 2 can be recycled, but the following consideration(s) need to be made from previous work:
* All routes that had token in the query or body now have it in the header
* `PUT /v2/admin/quiz/{quizid}/question/{questionid}` has different body input
* `GET /v2/admin/quiz/{quizid}` has different return type
* `POST /v2/admin/quiz/{quizid}/question` has a different input type

### 🦆 5.1. Task

In this iteration, you are expected to:

1. Make adjustments to your existing code and tests as per any feedback given by your tutor for iteration 2. In particular, you should take time to ensure that your code is well-styled and complies with good software writing practices and software and test design principles discussed in lectures.

2. Implement and test the HTTP Express server according to the [entire interface provided in the specification](swagger.yaml), including all new routes added in iteration 3.

    * Part of this section will be automarked.

    * It is required that your data is persistent, just like in iteration 2.

    * `eslint` is assessed identically to iteration 2.

    * Good coverage for all files that aren't tests will be assessed: see section 5.4 for details.

    * You can structure your test files however you choose, as long as they are appended with `.test.ts`. You may place them inside a `/tests` folder, if you wish. For this iteration, we will only be testing your HTTP layer of tests. 

    * In iteration 2 and 3, we provide a frontend that can be powered by your backend: see section 6.8 for details. Note that the frontend will not work correctly with an incomplete backend. As part of this iteration, it is required that your backend code can correctly power the frontend.
    
    * You must comply with instructions laid out in `5.3`

    * Ensure that you correctly manage sessions (tokens) and passwords in terms of authentication and authorisation, as per requirements laid out in section 6.9.

3. Continue demonstrating effective project management and git usage.

    * You will be heavily marked on your thoughtful approach to project management and effective use of git. The degree to which your team works effectively will also be assessed.

    * As for iteration 1 and 2, all task tracking and management will need to be done via the GitLab Taskboard or other tutor-approved tracking mechanism.

    * As for iteration 1 and 2, regular group meetings must be documented with meeting minutes which should be stored at a timestamped location in your repo (e.g. uploading a word doc/pdf or writing in the GitLab repo wiki after each meeting).

    * As for iteration 1 and 2, you must be able to demonstrate evidence of regular standups.

    * You are required to regularly and thoughtfully make merge requests for the smallest reasonable units, and merge them into `master`.

4. Document the planning of new features.

    * You are required to scope out 2-3 problems to solve for future iterations of Toohak. You aren't required to build/code them, but you are required to go through SDLC steps of requirements analysis, conceptual modelling, and design.

    * Full detail of this can be found in `5.6`.

### 🦆 5.2. Running the server

To run the server, you can run the following command from the root directory of your project (e.g. `/project-backend`):

```bash
npm start
```

This will start the server on the port in the `src/server.ts` file, using `ts-node`.

If you get an error stating that the address is already in use, you can change the port number in `config.json` to any number from 1024 to 49151. Is it likely that another student may be using your original port number.

Please note: For routes involving the playing of a game and waiting for questions to end, you are not required to account for situations where the server process crashes or restarts while waiting. If the server ever restarts while these active "sessions" are ongoing, you can assume they are no longer happening after restart.

### 🦆 5.3. Implementing and testing features

Continue working on this project by making distinct "features". Each feature should add some meaningful functionality to the project, but still be as small as possible. You should aim to size features as the smallest amount of functionality that adds value without making the project more unstable. For each feature you should:

1. Create a new branch.
2. Write tests for that feature and commit them to the branch. These will fail as you have not yet implemented the feature.
3. Implement that feature.
4. Make any changes to the tests such that they pass with the given implementation. You should not have to do a lot here. If you find that you are, you're not spending enough time on your tests.
5. Create a merge request for the branch.
6. Get someone in your team who **did not** work on the feature to review the merge request. When reviewing, **not only should you ensure the new feature has tests that pass, but you should also check that the coverage percentage has not been significantly reduced.**
7. Fix any issues identified in the review.
8. Merge the merge request into master.

For this project, a feature is typically sized somewhere between a single function, and a whole file of functions (e.g. `auth.ts`). It is up to you and your team to decide what each feature is.

There is no requirement that each feature be implemented by only one person. In fact, we encourage you to work together closely on features.

    * You are required to edit the `gitlab-ci.yml` file, as per section 4.5 to add linting to the code on `master`. **You must do this BEFORE merging anything from iteration 2 into `master`**, so that you ensure `master` is always stable.

* We want to see **evidence that you wrote your tests before writing the implementation**. As noted above, the commits containing your initial tests should appear *before* your implementation for every feature branch. If we don't see this evidence, we will assume you did not write your tests first and your mark will be reduced.
* You should have black-box tests for all tests required (i.e. testing each function/endpoint). However, you are also welcome to write white-box unit tests in this iteration if you see that as important.
* Merging in merge requests with failing pipelines is **very bad practice**. Not only does this interfere with your team's ability to work on different features at the same time, and thus slow down development - it is something you will be penalised for in marking.
* Similarly, merging in branches with untested features is also **very bad practice**. We will assume, and you should too, that any code without tests does not work.
* Pushing directly to `master` is not possible for this repo. The only way to get code into `master` is via a merge request. If you discover you have a bug in `master` that got through testing, create a bugfix branch and merge that in via a merge request.

### 🦆 5.4. Test coverage

To get the coverage of your tests locally, you will need to have two terminals open. Run these commands from the root directory of your project (e.g. `/project-backend`).

In the first terminal, run
```bash
npm run ts-node-coverage
```

In the second terminal, run jest as usual
```bash
npm run test
```

Back in the first terminal, stop the server with Ctrl+C or Command+C. There should now be a `/coverage` directory available. Open the `index.html` file in your web browser to see its output.

### 🦆 5.5. Planning for the next problems to solve

Software development is an iterative process - we're never truly finished. As we complete the development and testing of one feature, we're often then trying to understand the requirements and needs of our users to design the next set of features in our product.

For iteration 3 you are going to produce a short report in `planning.pdf` and place it in the repository. The contents of this report will be a simplified approach to understanding user problems, developing requirements, and doing some early designs.

N.B. If you don't know how to produce a PDF, you can easily make one in Google docs and then export to PDF.

We have opted not to provide you with a sample structure - because we're not interested in any rigid structure. Structure it however you best see fit, as we will be marking content.

#### [Requirements] Elicitation

Find 2-3 people to interview as target users. Target users are people who currently use a tool like Toohak, or intend to. Record their name and email address.

Develop a series of questions (at least 4) to ask these target users to understand what *problems* they might have with quiz tools that are currently unsolved by Toohak. Give these questions to your target users and record their answers.

Once you have done this, think about how you would solve the target users' problem(s) and write down a brief description of a proposed solution.

#### [Requirements] Analysis & Specification - Use Cases

Once you've elicited this information, it's time to consolidate it.

Take the responses from the elicitation step and express these requirements as **user stories** (at least 3). Document these user stories. For each user story, add user acceptance criteria as notes so that you have a clear definition of when a story has been completed.

Once the user stories have been documented, generate at least ONE use case that attempts to describe a solution that satifies some of or all the elicited requirements. You can generate a visual diagram or a more written-recipe style, as per lectures.

#### [Requirements] Validation

With your completed use case work, reach out to the 2-3 people you interviewed originally and inquire as to the extent to which these use cases would adequately describe the problem they're trying to solve. Ask them for a comment on this, and record their comments in the PDF.

#### [Design] Interface Design

Now that we've established our *problem* (described as requirements), it's time to think about our *solution* in terms of what capabilities would be necessary. You will specify these capabilities as HTTP endpoints, similar to what is described in `6.2`. There is no minimum or maximum of what is needed - it will depend on what problem you're solving.

**You are also encouraged to update your `swagger.yaml` file to include the routes associated with your new work.**

#### [Design] Conceptual Modelling - State Diagrams

Now that you have a sense of the problem to solve, and what capabilities you will need to provide to solve it, add at least ONE state diagram to your PDF to show how the state of the application would change based on user actions. The aim of this diagram is to help a developer understand the different states of the application.

### 🦆 5.6. States & Actions

Iteration 3 sees the introduction of a quiz session, which describes a particular instance of a quiz being run.e

Sessions can be in one of many states:
 * **LOBBY**: Players can join in this state, and nothing has started
 * **QUESTION_COUNTDOWN**: This is the question countdown period. It always exists before a question is open and the frontend makes the request to move to the question being open
 * **QUESTION_OPEN**: This is when players can see the question, and the answers, and submit their answers (as many times as they like)
 * **QUESTION_CLOSE**: This is when players can still see the question, and the answers, but can no longer submit answers
 * **ANSWER_SHOW**: This is when players can see the correct answer, as well as everyone playings' performance in that question, whilst they typically wait to go to the next countdown
 * **FINAL_RESULTS**: This is where the final results are displayed for all players and questions
 * **END**: The game is now over and inactive

There are 4 key actions that an admin can send that moves us between these states:
 * **NEXT_QUESTION**: Move onto the countdown for the next question
 * **GO_TO_ANSWER**: Go straight to the next most immediate answers show state
 * **GO_TO_FINAL_RESULTS**: Go straight to the final results state
 * **END**: Go straight to the END state

The constraints on moving between these states can be found in the state diagram here: https://miro.com/app/board/uXjVMNVSA6o=/?share_link_id=275801581370

**FINISH_COUNTDOWN note**: The countdown timer in the backend should be set to 0.1 seconds for your final submission. This will allow testing and timing to be done much more easily. However, during development or general play before submission, you may want to set it to a higher number just to make the game experience more realistic.

### 🦆 5.7. Error raising

In Iteration 3 we require you, for new /v1/ routes or any /v2/ routes, to use exceptions to throw errors instead of `res.send`. You can do so as the following:

```javascript
if (true) { // condition here
    throw HTTPError(403, "description")
}
```

The descriptions do not matter, they are up to you to spend time on (if at all).

To have these exceptions work effectively, you need to do two things:

(1) Install `middleware-http-errors`[https://www.npmjs.com/package/middleware-http-errors]. This is a package that is custom-made for COMP1531 students.

(2) Add `app.use(errorHandler())` to your `server.ts` file where errorHandler is the default export of the library above. This needs to be added AFTER all of your routes you define.

### 🦆 5.8. Safer Sessions and Secure Passwords

#### 🦆 5.8.1. Secure Passwords

For iteration 3, we require that passwords must be stored in a **hashed** form.

##### Background

Hashes are one-way encryption where you can convert raw text (e.g. a password like `password123`) to a hash (e.g. a sha256 hash `ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f`).

If we store passwords as the hash of the plain text password, as opposed to the plain text password itself, it means that if our data store is compromised that attackers would not know the plain text passwords of our users.

#### 🦆 5.8.2. More random session IDs

We require that you protect your sessions by using obfuscation. You can do this one of two ways:
 1. Using a randomly generated session ID (rather than incremental session IDs, such as 3492, 485845, 49030); or
 2. Returning a hash of a sequentially generated session ID (e.g. session IDs are 1, 2, 3, 4, but then you return the hash of it)

You may already be doing (1) depending on your implementation from the previous iteration.

##### Background

If we don't have some kind of randomness in our session IDs, then it's possible for users to potentially just change the session ID and trivially use someone elses session.

If you'd like to explore more tamper-proof tokens, then we suggest looking into and implementing a [JWT](https://jwt.io/)-like approach for potential bonus marks.

#### 🦆 5.8.3. Avoiding tokens being exposed in the URL

In this model, you will replace `token` query and body parameters with a `token` HTTP header when dealing with requests/routes only. You shouldn't remove `token` parameters from backend functions, as they must perform the validity checks.

You can access HTTP headers like so:
```javascript
const token = req.header('token');
```

This will also mean you no longer need to use `encodeURIComponent` or `decodeURIComponent` if you were using that in iteration 2.

##### Background

Any query parameters (those used by `GET/DELETE` functions) can be read in plaintext by an eavesdropper spying on your HTTP requests. Hence, by passing an authentication token as a query parameter, we're allowing an attacker to intercept our request, steal our token and impersonate other users! On the other hand, HTTP headers are encrypted (as long as you use HTTPS protocol), meaning an eavesdropper won't be able to read token values.

Note: While this safely protects sessions from man-in-the-middle attacks (intercepting our HTTP requests), it doesn't protect against client-side attacks, where an attacker may steal a token after the HTTP header has been decoded and received by the user. **You do not need to worry about mitigating client-side attacks**, but you can read more about industry-standard session management <a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#secure-attribute">here</a>.

#### 🦆 5.8.4. Summary

The following describes one potential way of implementing:

```text
A sample flow logging a user in might be as follows (other flows exist too):
1. Client makes a valid `auth/register` call
2. Server stores the hash of the plain text password that was provided over the request, but does not store the plain text password
3. Server generates an incremental session ID (e.g. 1, 2, 3) and then stores a hash of that session ID to create something obfuscated
4. Server returns that hash of the session ID as a token to the user in the response body
```

### 🦆 5.9. Uploading Images

Some parts of iteration 3 require you to upload an image. The process to follow is:
 * Taking a URL that the user provides and downloading the image onto the server
 * Storing the downloaded image on your server such that the server now has a local copy and can serve it on a URL such as http://localhost:5001/imgurl/adfnajnerkn23k4234.jpg (a unique url you generate)

Note: This is a harder part of the project

### 🦆 5.10. Scoring & Ranking

To determine the score a user receives for a particular question:
 * If they do not get the question correct, they receive a score of 0
 * If they do get the question correct, the score they received is P\*S where P is the points for the question, and S is the scaling factor of the question.
   * The scaling factor of the question is 1/N, where N is the number of how quickly they correctly answered the question. N = 1 is first person who answered correctly, N = 2 is second person who answered correctly, N = 3 is third person who answered correctly, etc
   * Players who answer the question at the exact same time results in undefined behaviour
 * For multiple-correct-answer questions, people need to select all the correct answers (no less, no more) to be considered having gotten the question correct.

When returned through any of the inputs:
 * All scores are rounded to the nearest 1 decimal place.
 * If there are players with the same score, they share the same rank, e.g. players scoring 5, 3, 3, 2, 2, 1 have ranks 1, 2, 2, 4, 4, 6

### 🦆 5.11. CSV Format

For the CSV format return, the format should be the following (and include the header line):
```text
Player,question1score,question1rank,...
X,Y,Z,...
X,Y,Z,...
X,Y,Z,...
```

An example for a quiz with 3 players and 2 questions might be:
```text
Player,question1score,question1rank,question2score,question2rank
Giuliana,1,3,2,2
Hayden,1.5,2,1.3,3
Yuchao,3,1,4,1
X,Y,Z,...
X,Y,Z,...
X,Y,Z,...
```

The CSV is ordered in alphabetical/ascii ascending order of player name.

If a player does not answer a question, their rank is 0 for that question.

### 🦆 5.12. Marking Criteria

<table>
  <tr>
    <th>Section</th>
    <th>Weighting</th>
    <th>Criteria</th>
  </tr>
  <tr>
    <td>Automarking (Testing & Implementation)</td>
    <td>55%</td>
    <td><ul>
      <li>Correct implementation of specified functions</li>
      <li>Correctly written tests based on the specification requirements</li>
      <li>Code coverage</li>
      <li>Correctly linted code (worth 5% of this iteration)</li>
      <li>**Up to 10% of the automarking will be done on iteration 2 routes that we still expect to be functional / backwards compatible**</li>
    </ul></td>
  </tr>
  <tr>
    <td>Code Quality</td>
    <td>10%</td>
    <td><ul>
      <li>Demonstrated an understanding of good test <b>coverage</b></li>
      <li>Demonstrated an understanding of the importance of <b>clarity</b> in communicating the purpose of tests and code</li>
      <li>Demonstrated an understanding of thoughtful test <b>design</b></li>
      <li>Appropriate use of Javascript data structures (arrays, objects, etc.)</li>
      <li>Appropriate style and documentation inline with course teachings</li>
      <li>Appropriate application of good software design practices</li>
      <li>Implementation of persistent state</li>
    </ul>
  </td>
  </tr>
  <tr>
    <td>Feature demonstrations</td>
    <td>10%</td>
    <td><ul>
      <li>Backend works with the supplied frontend</li>
      <li>Successful implementation of image upload routes</li>
    </ul>
  </td>
  </tr>
  <tr>
    <td>Git & Project Management</td>
    <td>10%</td>
    <td><ul>
      <li>Meaningful and informative git commit names being used</li>
      <li>At least 12 merge requests into master made</li>
      <li>A generally equal contribution between team members</li>
      <li>Clear evidence of reflection on group's performance and state of the team</li>
      <li>Effective use of course-provided MS Teams for communication, demonstrating an ability to competently manage teamwork online</li>
      <li>Use of issue board on GitLab or other approved tracking mechanism to manage tasks</li>
      <li>Effective use of agile methods such as standups</li>
      <li>Minutes/notes taken from group meetings (and stored in a logical place in the repo)</li>
    </ul>
  </td>
  </tr>
  <tr>
    <td>Requirements & Design for future work</td>
    <td>15%</td>
    <td><ul>
      <li>Requirements elicited from potential users, recorded as user stories with acceptance criteria for each</li>
      <li>User journey justified and expressed as use case(s)</li>
      <li>Interface proposed as a potential solution to provide capabilities</li>
      <li>State diagram(s) drawn to demonstrate how application responds to actions</li>
    </ul>
  </td>
  </tr>
  <tr>
    <td>(Bonus Marks) Typescript</td>
    <td>10%</td>
    <td><ul>
      <li>Up to 10% extra marks can be gained by ensuring your code is Typescript compliant using <code>npm run tsc</code>. This includes no use of the `any` keyword and includes no other check disabling keywords (e.g. "ts-nocheck")</li>
    </ul>
  </td>
  </tr>
</table>

The formula used for automarking in this iteration is:

`Mark = 95*(t * i * c^3) + 5*e`
(Mark equals 95% of `t` multiplied by `i` multiplied by `c` to the power of three, plus 5% of `e`)

Where:
 * `t` is the mark you receive for your tests running against your code (100% = your implementation passes all of your tests).
 * `i` is the mark you receive for our course tests (hidden) running against your code (100% = your implementation passes all of our tests).
 * `c` is the score achieved by running coverage on your entire codebase.
 * `e` is the score between 0-1 achieved by running <code>eslint</code> against your code and the provided configuration.

### 🦆 5.13. Dryrun

The dryrun checks the format of your return types and simple expected behaviour for a few basic routes. Do not rely on these as an indicator for the correctness of your implementation or tests.

To run the dryrun, you should be in the root directory of your project (e.g. `/project-backend`) and use the command:

```bash
1531 dryrun 3
```

### 🦆 5.14. Submission & Peer Assessment

Please see section 6 for information on **due date**. There will be no demonstration for iteration 3.

Please see section 7.5 for information on **peer assessment**.

## 🌸 6. Due Dates and Weightings

| Iteration | Due date                             | Demonstration to tutor(s)     | Assessment weighting (%) |
| --------- | ------------------------------------ | ----------------------------- | ------------------------ |
| 0         | 10pm Friday 9th June (**week 2**)    | No demonstration              | 5% of project mark       |
| 1         | 10pm Friday 23rd June (**week 4**)   | In YOUR **week 5** laboratory | 30% of project mark      |
| 2         | 10pm Friday 14th July (**week 7**)   | In YOUR **week 8** laboratory | 35% of project mark      |
| 3         | 10pm Friday 4th August (**week 10**) | No demonstration              | 30% of project mark      |

### 🌸 6.1. Submission & Late Penalties

To submit your work, simply have your master branch on the gitlab website contain your groups most recent copy of your code. I.E. "Pushing to master" is equivalent to submitting. When marking, we take the most recent submission on your master branch that is prior to the specified deadline for each iteration.

The following late penalties apply depending on the iteration:
 * Iteration 0: No late submissions at all
 * Iteration 1: No late submissions at all
 * Iteration 2: No late submissions at all
 * Iteration 3: Can submit up to 72 hours late, with 5% penalty applied every time a 24 hour window passes, starting from the due date 

We will not mark commits pushed to master after the final submission time for a given iteration.

If the deadline is approaching and you have features that are either untested or failing their tests, **DO NOT MERGE IN THOSE MERGE REQUESTS**. In some rare cases, your tutor will look at unmerged branches and may allocate some reduced marks for incomplete functionality, but `master` should only contain working code.

Minor isolated fixes after the due date are allowed but carry a penalty to the automark, if the automark after re-running the autotests is greater than your initial automark. This penalty can be up to 30% of the automark for that iteration, depending on the number and nature of your fixes. Note that if the re-run automark after penalty is lower than your initial mark, we will keep your initial mark, meaning your automark cannot decrease after a re-run. E.g. imagine that your initial automark is 50%, on re-run you get a raw automark of 70%, and your fixes attract a 30% penalty: since the 30% penalty will reduce the mark of 70% to 49%, your final automark will still be 50% (i.e. your initial mark).

**Groups are limited to making 1 automark re-run request per week.**

If you want to have your automarking re-run:  
* Create a branch, e.g. `iter[X]-fix`, based off the submission commit  
* Make the minimal number of necessary changes (i.e. only fix the trivial bugs that cost you many automarks)  
* Push the changes to GitLab on a new branch
* Create a merge request (but do not merge) and share that merge request with your tutor.

### 🌸 6.2. Demonstration

The demonstrations in weeks 5 and 8 will take place during your lab sessions. All team members **must** attend these lab sessions. Team members who do not attend a demonstration may receive a mark of 0 for that iteration. If you are unable to attend a demonstration due to circumstances beyond your control, you must apply for special consideration.

Demonstrations consist of a 15 minute Q&A in front of your tutor and potentially some other students in your tutorial. For online classes, webcams and audio are required to be on during this Q&A (your phone is a good alternative if your laptop/desktop doesn't have a webcam).

## 👌 7. Individual Contribution

While we do award a tentative mark to your group as a whole, your actual mark for each iteration is given to you individually. Your individual mark is determined by your tutor, with your group mark as a reference point.Your tutor will look at the following items each iteration to determine your mark:
 * Project check-in
 * Code contribution
 * Tutorial contributions
 * Peer assessment

In general, all team members will receive the same mark (a sum of the marks for each iteration), **but if you as an individual fail to meet these criteria, your final project mark may be scaled down**, most likely quite significantly.

### 👌 7.1. Project check-in

During your lab class, you and your team will conduct a short standup in the presence of your tutor. Each member of the team will briefly state what they have done in the past week, what they intend to do over the next week, and what issues they have faced or are currently facing. This is so your tutor, who is acting as a representative of the client, is kept informed of your progress. They will make note of your presence and may ask you to elaborate on the work you've done.

Project check-ins are also excellent opportunities for your tutor to provide you with both technical and non-technical guidance.

Your attendance and participation at project check-ins will contribute to your individual mark component for the project. In addition, your tutor will note down any absences from team-organised standups.

These are easy marks. They are marks assumed that you will receive automatically, and are yours to lose if you neglect them.

The following serves as a baseline for expected progress during project check-ins, in the specified weeks. For groups which do not meet this baseline, teamwork marks and/or individual scaling may be impacted.
| Iteration | Week/Check-in | Expected progress                                                                                                                                     |
| --------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0         | **Week 2**    | Twice-weekly standup meeting times organised, iteration 0 specification has been discussed in a meeting, at least 1 task per person has been assigned |
| 1         | **Week 3**    | Iteration 1 specification has been discussed in a meeting, at least 1 task per person has been assigned                                               |
| 1         | **Week 4**    | 1x function per person complete (tests and implementation in master)                                                                                  |
| 2         | **Week 5**    | Iteration 2 specification has been discussed in a meeting, at least 1 task per person has been assigned                                               |
| 2         | **Week 6**    | **(Checked by your tutor in week 7)** Server routes for all iteration 1 functions complete and in master                                              |
| 2         | **Week 7**    | 1x iteration 2 route per person complete (HTTP tests and implementation in master)                                                                    |
| 3         | **Week 8**    | Iteration 3 specification has been discussed in a meeting, at least 1 task per person has been assigned                                               |
| 3         | **Week 9**    | Exceptions & tokens in HTTP headers added across the project AND 1x iteration 3 route per person complete (HTTP tests and implementation in master)                            |
| 3         | **Week 10**    | 2x iteration 3 routes per person complete (HTTP tests and implementation in master)                            |

### 👌 7.2. Tutorial contributions

From weeks 2 onward, your individual project mark may be reduced if you do not satisfy the following:
* Attend all tutorials
* Participate in tutorials by asking questions and offering answers
* [online only] Have your web cam on for the duration of the tutorial and lab

We're comfortable with you missing or disengaging with 1 tutorial per term, but for anything more than that please email your tutor. If you cannot meet one of the above criteria, you will likely be directed to special consideration.

These are easy marks. They are marks assumed that you will receive automatically, and are yours to lose if you neglect them.

### 👌 7.3. Code contribution

All team members must contribute code to the project to a generally similar degree. Tutors will assess the degree to which you have contributed by looking at your **git history** and analysing lines of code, number of commits, timing of commits, etc. If you contribute significantly less code than your team members, your work will be closely examined to determine what scaling needs to be applied.

Note that **contributing more code is not a substitute for not contributing documentation**.

### 👌 7.4. Documentation contribution

All team members must contribute documentation to the project to a generally similar degree.

In terms of code documentation, your functions are required to contain comments in JSDoc format, including paramters and return values:

```javascript
/**
  * <Brief description of what the function does>
  * 
  * @param {data type} name - description of paramter
  * @param {data type} name - description of parameter
  * ...
  * 
  * @returns {data type} - description of condition for return
  * @returns {data type} - description of condition for return
*/
```

In each iteration you will be assessed on ensuring that every relevant function in the specification is appropriately documented.

In terms of other documentation (such as reports and other notes in later iterations), we expect that group members will contribute equally.

Note that, **contributing more documentation is not a substitute for not contributing code**.

### 👌 7.5. Peer Assessment

At the end of each iteration, there will be a peer assessment survey where you will rate and leave comments about each team member's contribution to the project up until that point. 

Your other team members will **not** be able to see how you rated them or what comments you left in either peer assessment. If your team members give you a less than satisfactory rating, your contribution will be scrutinised and you may find your final mark scaled down.

<table>
  <tr>
    <th>Iteration</th>
    <th>Link</th>
    <th>Opens</th>
    <th>Closes</th>
  </tr>
  <tr>
    <td>1</td>
    <td><a href="https://forms.office.com/r/2N7h1RY7Gu">Click here</a></td>
    <td>10pm Friday 23rd June</td>
    <td>9am Monday 26th June</td>
  </tr>
  <tr>
    <td>2</td>
    <td><a href="https://forms.office.com/r/RHegGHxPBk">Click here</a></td>
    <td>10pm Friday 14th July</td>
    <td>9am Monday 17th July</td>
  </tr>
  <tr>
    <td>3</td>
    <td><a href="https://forms.office.com/r/5TSZ7gxR5q">Click here</a></td>
    <td>10pm Friday 4th August</td>
    <td>9am Monday 7th August</td>
  </tr>
</table>

### 👌 7.6. Managing Issues

When a group member does not contribute equally, we are aware it can implicitly have an impact on your own mark by pulling the group mark down (e.g. through not finishing a critical feature), etc.

The first step of any disagreement or issue is always to talk to your team member(s) on the chats in MS Teams. Make sure you have:
1. Been clear about the issue you feel exists
2. Been clear about what you feel needs to happen and in what time frame to feel the issue is resolved
3. Gotten clarity that your team member(s) want to make the change.

If you don't feel that the issue is being resolved quickly, you should escalate the issue by talking to your tutor with your group in a project check-in, or alternatively by emailing your tutor privately outlining your issue.

It's imperative that issues are raised to your tutor ASAP, as we are limited in the mark adjustments we can do when issues are raised too late (e.g. we're limited with what we can do if you email your tutor with iteration 2 issues after iteration 2 is due).

## 💻 8. Automarking & Leaderboard

### 💻 8.1. Automarking

Each iteration consists of an automarking component. The particular formula used to calculate this mark is specific to the iteration (and detailed above).

When running your code or tests as part of the automarking, we place a 90 second minute timer on the running of your group's tests. This is more than enough time to complete everything unless you're doing something very wrong or silly with your code. As long as your tests take under 90 seconds to run on the pipeline, you don't have to worry about it potentially taking longer when we run automarking.

### 💻 8.2. Leaderboard

In the days preceding iterations 1, 2, and 3's due date, we will be running your code against the actual automarkers (the same ones that determine your final mark) and publishing the results of every group on a leaderboard. [The leaderboard will be available here once released](http://cgi.cse.unsw.edu.au/~cs1531/23T2/leaderboard).

You must have the code you wish to be tested in your `master` branch by **10pm** the night before leaderboard runs.

The leaderboard will be updated on Monday, Wednesday, and Friday morning during the week that the iteration is due.

Your position and mark on the leaderboard will be referenced against an alias for your group (for privacy). This alias will be emailed to your group in week 3. You are welcome to share your alias with others if you choose! (Up to you.)

The leaderboard gives you a chance to sanity check your automark (without knowing the details of what you did right and wrong), and is just a bit of fun.

If the leaderboard isn't updating for you, try hard-refreshing your browser (Ctrl+R or Command+R), clearing your cache, or opening it in a private window. Also note the HTTP (not HTTPS) in the URL, as the site is only accessible via HTTP.

## 👀 9. Plagiarism

The work you and your group submit must be your own work. Submission of work partially or completely derived from any other person or jointly written with any other person is not permitted. The penalties for such an offence may include negative marks, automatic failure of the course and possibly other academic discipline. Assignment submissions will be examined both automatically and manually for such submissions.

Relevant scholarship authorities will be informed if students holding scholarships are involved in an incident of plagiarism or other misconduct.

Do not provide or show your project work to any other person, except for your group and the teaching staff of COMP1531. If you knowingly provide or show your assignment work to another person for any reason, and work derived from it is submitted, you may be penalized, even if the work was submitted without your knowledge or consent. This may apply even if your work is submitted by a third party unknown to you.

Note: you will not be penalized if your work has the potential to be taken without your consent or knowledge.
