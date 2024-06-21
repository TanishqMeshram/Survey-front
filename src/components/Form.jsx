import React, { useState, useEffect } from 'react';
import Field from './Field';

const Form = () => {
  const initialFormData = {
    fullName: '',
    email: '',
    surveyTopic: '',
    favoriteProgrammingLanguage: '',
    yearsOfExperience: '',
    exerciseFrequency: '',
    dietPreference: '',
    highestQualification: '',
    fieldOfStudy: '',
    feedback: '',
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [currentStep, setCurrentStep] = useState(1);
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false); 
  const [showSummary, setShowSummary] = useState(false); 

  const fetchAdditionalQuestions = async (topic) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_QUESTION_API_URL}${topic}`);
      if (!response.ok) {
        throw new Error('Failed to fetch additional questions');
      }
      const data = await response.json();
      setAdditionalQuestions(data);
    } catch (error) {
      console.error('Error fetching additional questions:', error);
      setError(error.message || 'Failed to fetch additional questions');
    }
  };

  useEffect(() => {
    if (additionalQuestions.length > 0) {
      setCurrentStep(2);
      setError(null);
    }
  }, [additionalQuestions]);

  const validateNonNegative = (fields) => {
    const errors = {};
    fields.forEach((field) => {
      const value = formData[field];
      if (value === '' || value === undefined || value === null) {
        errors[field] = 'This field is required';
      } else if (typeof value === 'number' && value < 0) {
        errors[field] = 'This field must be a non-negative number';
      }
    });
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep === 1 && formData.surveyTopic) {
      fetchAdditionalQuestions(formData.surveyTopic);
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numberFields = ['yearsOfExperience']; 

    const validateFields = (fields) => {
      const errors = {};
      fields.forEach((field) => {
        const value = formData[field];
        if (value === '' || value === undefined || value === null) {
          errors[field] = 'This field is required';
        }
      });
      return errors;
    };

    const additionalFields = additionalQuestions.map((q) => q.name);
    const generalErrors = validateFields(['feedback', ...additionalFields]);
    const numberErrors = validateNonNegative(numberFields);

    setSubmitting(true);

    const mergedData = {
      ...formData,
      ...additionalQuestions.reduce((acc, question) => {
        acc[question.name] = formData[question.name];
        return acc;
      }, {}),
    };

    try {
      const response = await fetch(import.meta.env.VITE_SUBMIT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData: mergedData, additionalQuestions }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();

      setShowSummary(true);
      setSubmitting(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to submit form');
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({ ...initialFormData });
    setAdditionalQuestions([]);
    setCurrentStep(1);
    setShowSummary(false);
    setError(null);
  };

  return (
    <div>
      {!showSummary && (
        <form onSubmit={currentStep === 2 ? handleSubmit : handleNext}>
          {currentStep === 1 && (
            <>
              <Field
                label="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Field
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Field
                label="Survey Topic"
                type="select"
                name="surveyTopic"
                value={formData.surveyTopic}
                onChange={handleChange}
                required
                options={[
                  { value: '', text: 'Select a topic' },
                  { value: 'Technology', text: 'Technology' },
                  { value: 'Health', text: 'Health' },
                  { value: 'Education', text: 'Education' },
                ]}
              />
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                Next
              </button>
            </>
          )}
          {currentStep === 2 && (
            <>
              {additionalQuestions.map((question, index) => (
                <Field
                  key={index}
                  label={question.label}
                  type={question.type}
                  name={question.name}
                  value={formData[question.name]}
                  onChange={handleChange}
                  required={question.required}
                  options={question.options || []}
                />
              ))}
              <Field
                label="Feedback"
                type="textarea"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                minLength={50}
              />
              <div className="flex space-x-4">
                <button type="button" onClick={handlePrev} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                  Previous
                </button>
                <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md">
                  Submit
                </button>
              </div>
            </>
          )}
          {error && <div className="text-red-500">{error}</div>}
        </form>
      )}

      {showSummary && (
        <div className="mt-8 p-4 border border-gray-300 rounded-md">
          <h2 className="text-lg font-bold mb-4">Summary of Submitted Data</h2>
          <p><strong>Full Name:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Survey Topic:</strong> {formData.surveyTopic}</p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Additional Questions:</h3>
          <ul>
            {additionalQuestions.map((question, index) => (
              <li key={index}>
                <strong>{question.label}:</strong> {formData[question.name]}
              </li>
            ))}
          </ul>
          <p className="mt-4"><strong>Feedback:</strong> {formData.feedback}</p>
          <button
            onClick={handleResetForm}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Submit Another Response
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;
