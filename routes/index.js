module.exports = {
    USER: require('./Users/usersRoutes'),
    AUTH: require('./Users/authRoutes'),
    QUIZZ: require('./Quizz/quizz'),
    COURSES: require('./Courses/coursesRoutes'),
    SHARED: require('./Courses/coursesSharedRoutes'),
    FLIPCARDS: require('./FlipCards/flip_cards_questions'),
    ROLES: require('./Courses/roles')
};