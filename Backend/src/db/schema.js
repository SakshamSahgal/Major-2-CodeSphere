const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    DueTimestamp: { type: Date, required: true },
    Year: {
        type: String,
        required: true,
        enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year'],
    },
    Batches: [{ type: String, required: true }],
    PostedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    AssignmentName: { type: String, required: true, unique: true },
    SubmittedBy: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    Questions: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    PostedOn: { type: Date, required: true },
});


const registeredCollegesSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Batches: [{ type: String, required: true }],
});

const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneValidator = /^\d{10}$/;

const RequestedCollegesSchema = new mongoose.Schema({
    CollegeName: { type: String, required: true },
    Name: { type: String, required: true },
    Email: {
        type: String,
        required: true,
        match: [emailValidator, 'Invalid email address'],
    },
    PhoneNo: {
        type: String,
        required: true,
        match: [phoneValidator, 'Invalid phone number'],
    },
});

const professorsSchema = new mongoose.Schema({
    Username: { type: String, required: true },
    Name: { type: String, required: true },
    Password: { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
    Constraints: { type: String, required: true },
    ProblemStatement: { type: String, required: true },
    QuestionName: { type: String, required: true, unique: true },
    RandomTestCode: { type: String, required: false },
    SolutionCode: { type: String, required: true },
    TestCases: [{
        input: { type: String, required: true },
        sampleTestCase: { type: Boolean, required: true },
    }],
    RandomTestChecked: { type: Boolean, required: true },
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
});

// Conditional validation for RandomTestCode
QuestionSchema.path('RandomTestCode').required(function () {
    return this.RandomTestChecked === true;
}, 'RandomTestCode is required when RandomTestChecked is true');

const StudentsSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Batch: { type: String, required: true },
    Year: {
        type: String,
        required: true,
        enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year'],
    },
    Username: { type: String, required: true },
    Password: { type: String, required: true },
});

const EvaluationSchema = new mongoose.Schema({
    Questions: [{
        QuestionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        Marks: { type: Number, required: true },
    }],
    DurationinSeconds: { type: Number, required: true },
    StartTime: { type: Date, required: true },
    EndTime: { type: Date, required: true },
    Batches: {
        type: [{ type: String, required: true }],
        validate: {
            validator: function (array) {
                return array && array.length > 0; // Check if the array is not empty
            },
            message: 'Batches should not be empty.',
        },
    },
    Year: {
        type: String,
        required: true,
        enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year']
    },
    AssignedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    Name: { type: String, required: true },
    SubmittedBy: [{ type: mongoose.Schema.Types.ObjectId, required: true }]
});

const SubmitAssignmentsSchema = new mongoose.Schema({
    AssignmentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    StudentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    Submission: [{
        SubmittedCode: { type: String, required: true },
        QuestionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    }],
    SubmittedOn: { type: Date, required: true },
});

const SubmitEvaluationSchema = new mongoose.Schema({
    EvaluationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    StudentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    Submission: [{
        SubmittedCode: { type: String, required: true },
        QuestionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    }],
    SubmittedOn: { type: Date, required: true },
});

module.exports = {
    assignmentSchema,
    registeredCollegesSchema,
    RequestedCollegesSchema,
    professorsSchema,
    QuestionSchema,
    StudentsSchema,
    EvaluationSchema,
    SubmitAssignmentsSchema,
    SubmitEvaluationSchema
};