Assumptions:
auth.js:
    - adminAuthRegister():
        + For every registration, the function will check parameters in this order:
        email -> password -> nameFirst -> nameLast. For that, even if all errors occur at once, it will return 
        error in the listed order.
        + Just like Google, I will assume that all users will type their email in lower case, even in the testing. 
    - adminAuthLogin():
        + It will not check email conditions like adminAuthRegister function, instead just search whether the given
        email happens to be in the database or not, same thing applies with password.

quiz.js
    + Quiz Id's are immutable, unique and non-reusable so when removing quizId's the object isn't removed, however every 
    other element is deleted and only the quizId remains 

    + Quizzes of the same name registered under different users are valid
    
    + Quizzes are, by defualt, already in END state

    + Quizzes can have the same description

