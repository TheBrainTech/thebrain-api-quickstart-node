import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image'
;
import { Inter } from 'next/font/google'
;

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [brainId, setBrainId] = useState('');
  const [sourceThoughtId, setSourceThoughtId] = useState('');
  const [newThoughtName, setNewThoughtName] = useState('');
  const [newThoughtLabel, setNewThoughtLabel] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isGuid = (value) => {
    const guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return guidPattern.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!brainId || !isGuid(brainId)) {
      setErrorMessage('Invalid Brain ID');
      return;
    }

    if (!sourceThoughtId || !isGuid(sourceThoughtId)) {
      setErrorMessage('Invalid Source Thought ID');
      return;
    }

    if (!newThoughtName) {
      setErrorMessage('Please provide a New Thought Name');
      return;
    }

    const body = {
      name: newThoughtName,
      kind: 1,
      label: newThoughtLabel,
      typeId: "00000000-0000-0000-0000-000000000000",
      sourceThoughtId: sourceThoughtId,
      relation: 1,
      acType: 0
    };

    try {
      const response = await fetch(`/api/createThought?brainId=${brainId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Success! New Thought ID: ${data}`);
      } else {
        setErrorMessage(data.error || 'An error occurred while creating the thought.');
      }
    } catch (error) {
      setErrorMessage('Error during fetch operation: ' + error.message);
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gray-800 p-4">
      
      <Head>
        <title>TheBrain API Quickstart</title>
      </Head>

      <div className="mb-8">
        <div className="text-center text-4xl font-bold mb-4">Create New Thought</div>
        <hr className="mb-4 border-gray-500"/>
        <ol>
          <li>Log in to the embedded Web Client below with your TheBrain Account credentials.</li>
          <li>Open a brain and activate a thought.</li>
          <li>Right-click the thought and select <code>Open in New Tab</code>.</li>
          <li>Copy the first Guid in the URL and paste into the <code>Brain ID</code> text entry on this page.</li>
          <li>Copy the second Guid in the URL and paste into the <code>Source Thought ID</code> text entry on this page.</li>
          <li>Fill in the <code>Name</code> and <code>Label</code> field for the thought to create.</li>
          <li>Click <code>Create Thought</code> and watch the magic happen!</li>
        </ol>
      </div>

      <form id="createThoughtCard" onSubmit={handleSubmit} className="flex flex-col bg-gray-600 w-full max-w-[800px] rounded-lg shadow-lg p-8 mb-12">

        <div className="flex flex-row justify-center divide-x divide-gray-500">

          <div className="flex flex-col w-full pr-4">
            <div className="mb-4">
              <h1 className="text-center text-xl font-bold mb-4">Brain ID</h1>
              <input 
                type="text" 
                placeholder="Brain ID to create the new thought in" 
                className="block w-full border rounded p-2" 
                value={brainId}
                onChange={(e) => setBrainId(e.target.value)} 
              />
            </div>

            <div className="mb-4">
              <h1 className="text-center text-xl font-bold mb-4">Source Thought ID</h1>
              <input 
                type="text" 
                placeholder="Thought ID to link the new thought to" 
                className="block w-full border rounded p-2"
                value={sourceThoughtId}
                onChange={(e) => setSourceThoughtId(e.target.value)} 
              />
            </div>

          </div>

          <div className="flex flex-col w-full pl-4">
            <div className="mb-4">
              <h1 className="text-center text-xl font-bold mb-4">New Thought Name</h1>
              <input 
                type="text" 
                placeholder="Name of the new thought" 
                className="block w-full border rounded p-2"
                value={newThoughtName}
                onChange={(e) => setNewThoughtName(e.target.value)} 
              />
            </div>

            <div className="mb-4">
              <h1 className="text-center text-xl font-bold mb-4">New Thought Label</h1>
              <input 
                type="text" 
                placeholder="Label of the new thought" 
                className="block w-full border rounded p-2"
                value={newThoughtLabel}
                onChange={(e) => setNewThoughtLabel(e.target.value)} 
              />
            </div>

          </div>

        </div>

        <div className="flex flex-row justify-center">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded w-full mt-4 py-2 transition-colors duration-150 ease-out">
            Create Thought
          </button>
        </div>
        
        <div className="text-center">
          {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
          {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
        </div>

      </form>

      <iframe src="https://app.thebrain.com" className="w-full max-w-[800px] h-[600px] bg-[#1f2125] border border-gray-600 rounded-lg shadow-lg"/>

    </main>
  )
}
