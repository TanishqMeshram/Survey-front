import React from 'react';
import Form from './components/Form';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 rounded-md flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/survey.jpeg')` }}>
      <div className="max-w-md w-full p-6 bg-white rounded shadow-lg bg-gradient-to-r from-blue-200 to-white-200">
        <h2 className="text-xl font-semibold mb-4 text-center">Advanced Dynamic Form</h2>
        <Form />
      </div>
    </div>
  );
}

export default App;