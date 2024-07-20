import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jobDesc } from '../../Utils/commonJSON';

const gptModels = ["gpt-4", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"];
const roles = ["system", "user", "assistant"];


let hcPromptR1 = "You are an expert interviewer. Generate 10 React, Typescript, Node interview questions for a candidate with 5 years of experience. Return minified JSON with the following fields: srNo, question, difficulty(Easy, Moderate, Hard)."
let hcPromptR2 = "You are an expert interviewer. Generate 10 interview questions with the help of the following Job Description. Return minified JSON with the following fields: srNo, question, difficulty(Easy, Moderate, Hard). Job Description:\n\n"+jobDesc
let hcPromptR3 = "You are expert interviewer. Evaluate the following answer for the question and provide a score out of 10.\nConsider the following evaluation criteria: Relevance, Completeness, Correctness and Clarity.\nQuestion: What is React? \nAnswer: React is a Javascript library that lets you build user interfaces as building blocks. It lets you write resuable components and has HTMl like syntax.\nScore:"
let hcPromptR4 = "Create a JD for Fullstack Developer having 5 years experience in React, Node, Javascript. Take help of the short summary: \n\n'highly skilled and motivated Full Stack Developer who will play a critical role in designing, developing, and maintaining our cutting-edge software applications. Work on both the front-end and back-end components, ensuring seamless integration and exceptional user experiences'\n\nJD should just have the following parameters: Job Summary, Key Responsibilities, Qualification (in one line), Skills (Technical and Non Technical)\nreturn HTML <body> tag only"
let hcPromptR5 = "Act as an experienced Interviewer.\nWe only want to shortlist the best candidates, as there are very few openings for the role.\nEvaluate the following resume based on the given job description. Provide a score between 0 and 10.\nJob Description:\n"



const TestAI = () => {
  const [formData, setFormData] = useState({
    model: 'gpt-4', //default is the largest available model
    temperature: 0.8, // default
    max_tokens: 0, //model-specific
    stop: "", //NO default
    user: 'user-1234', //NO default
    top_p: 1.0, //default
    frequency_penalty: 0.0,//default
    presence_penalty: 0.0,//default

    // best_of: 1, //default NOT SUPPORTED IN chat/completions model
    // logit_bias: '{}',//default
    // role: 'user'
  });

  const [screenLoading, setScreenLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRequestIndex, setSelectedRequestIndex] = useState(0);
  const [prompt, setPrompt] = useState(hcPromptR1);
  const [usePromptOnly, setUsePromptOnly] = useState(false);

  const [field, setField] = useState('');
  const [experience, setExperience] = useState('');

  const [jobDescription, setJobDescription] = useState('');

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [jobTitle, setJobTitle] = useState('');
  const [experience2, setExperience2] = useState('');
  const [skills, setSkills] = useState('');
  const [shortSummary, setShortSummary] = useState('');


  const [ChatGPTResponse, setChatGPTResponse] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [role, setRole] = useState('user');

  const [availableModels, setAvailableModels] = useState(gptModels);

  useEffect(() => {
    setScreenLoading(true)
    getModels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let isNumeric = false;
    if (name === 'temperature' || name === 'max_tokens' || name === 'top_p' || name === 'frequency_penalty' || name === 'presence_penalty') {
      isNumeric = true;
    }
    setFormData({ ...formData, [name]: isNumeric ? Number(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleRequestTypeChange = (index) => {
    let prompt = '';
    setChatGPTResponse('');
    switch (index) {
      case 0:
        prompt = hcPromptR1
        break;

      case 1:
        prompt = hcPromptR2
        break;

      case 2:
        prompt = hcPromptR3
        break;

      case 3:
        prompt = hcPromptR4
        break;

      case 4:
        prompt = hcPromptR5
        break;

      default:
        break;
    }
    setPrompt(prompt)
    setSelectedRequestIndex(index);
  };

  const getModels = async () => {
    try {
      const response = await axios.get('https://ai-service.santosh-517.workers.dev/getModels');
      setScreenLoading(false);
      console.log(response.data.data.data);
      if(response.data.data.data && response.data.data.data.length > 0){
        setAvailableModels(response.data.data.data);} 
    } catch (error) {
      setScreenLoading(false);
      console.error(error);
    }
  };

  const generateQuestionsByParams = async () => {
    setLoading(true);

    //write code to check if any value in formData is empty or 0 then remove the key and value
    let formData2 = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== '' && v !== 0));

    const postData = {
      field: field,
      experience: experience,
      configurations: formData2,

      role: role
    };

    if (usePromptOnly) {
      postData.field = "Field";
      postData.experience = "Experience";
      postData.hcPrompt = prompt;
      postData.role = role;
    } else if (!usePromptOnly && (field === '' || experience === '')) {
      alert("Please enter field and experience OR \nSelect 'Use prompt only' option");
      setLoading(false)
      return;
    }

    // console.log("POST DATA", postData);
    // setLoading(false)
    // return;

    try {
      const response = await axios.post('https://ai-service.santosh-517.workers.dev/generateQuestionsByParams', postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Questions generated successfully:', response.data);
      setLoading(false);
      setChatGPTResponse(response.data.data);
    } catch (error) {
      console.error('Error generating questions:', error.response.data);
      alert(error.response.data.message)
      setLoading(false)
    }
  };


  const generateQuestionsByJD = async () => {
    setLoading(true);

    //write code to check if any value in formData is empty or 0 then remove the key and value
    let formData2 = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== '' && v !== 0));

    const postData = {
      jobDescription: jobDescription,
      configurations: formData2,
      role: role
    };

    if (usePromptOnly) {
      postData.jobDescription = "jobDescription";
      postData.hcPrompt = prompt;
      postData.role = role

    } else if (!usePromptOnly && (jobDescription === '')) {
      alert("Please enter JD OR \nSelect 'Use prompt only' option");
      setLoading(false)
      return;
    }

    // console.log("POST DATA", postData);
    // setLoading(false)
    // return;

    try {
      const response = await axios.post('https://ai-service.santosh-517.workers.dev/generateQuestionsByJD', postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Questions generated successfully:', response.data);
      setLoading(false);
      setChatGPTResponse(response.data.data);
    } catch (error) {
      console.error('Error generating questions:', error.response.data);
      alert(error.response.data.message)
      setLoading(false)
    }
  };

  const evaluateAnswerByQuestion = async () => {
    setLoading(true);

    //write code to check if any value in formData is empty or 0 then remove the key and value
    let formData2 = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== '' && v !== 0));

    const postData = {
      question: question,
      answer: answer,
      configurations: formData2,
      role: role
    };

    if (usePromptOnly) {
      postData.question = "Question";
      postData.answer = "Answer";
      postData.hcPrompt = prompt;
      postData.role = role;
    } else if (!usePromptOnly && (question === '' || answer === '')) {
      alert("Please enter question and answer OR \nSelect 'Use prompt only' option");
      setLoading(false)
      return;
    }

    try {
      const response = await axios.post('https://ai-service.santosh-517.workers.dev/evaluateAnswerByQuestion', postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Evaluation success:', response.data);
      setLoading(false);
      setChatGPTResponse(response.data.data);
    } catch (error) {
      console.error('Evaluation failed:', error.response.data);
      alert(error.response.data.message)
      setLoading(false)
    }
  };

  const generateJobDescriptionByParams = async () => {
    setLoading(true);

    //write code to check if any value in formData is empty or 0 then remove the key and value
    let formData2 = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== '' && v !== 0));

    const postData = {
      jobTitle: jobTitle,
      experience: experience2,
      skills: skills,
      summary: shortSummary,
      configurations: formData2,
      role: role
    };

    if (usePromptOnly) {
      postData.jobTitle = "jobTitle";
      postData.experience = "Experience";
      postData.skills = "skills";
      postData.summary = "Summary";
      postData.hcPrompt = prompt;
      postData.role = role
    } else if (!usePromptOnly && (jobTitle === '' || experience2 === '' || skills === '')) {
      alert("Please enter job title, experience and skills OR \nSelect 'Use prompt only' option");
      setLoading(false)
      return;
    }

    try {
      const response = await axios.post('https://ai-service.santosh-517.workers.dev/generateJobDescriptionByParams', postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Questions generated successfully:', response.data);
      setLoading(false);
      setChatGPTResponse(response.data.data);
    } catch (error) {
      console.error('Error generating questions:', error.response.data);
      alert(error.response.data.message)
      setLoading(false)
    }
  };


  return (
    screenLoading ? <div className="loader-container"><div className="loader"></div></div> :
    <div className="min-h-screen p-5 bg-white-100">
      <div className="flex space-x-4 mb-4">
        <button onClick={() => handleRequestTypeChange(0)} className="btn" style={{ margin: "0px, 0px", padding: "0px, 16px", color: selectedRequestIndex == 0 ? "#FF622D" : 'grey' }}>Generate Questions (by Params)</button>
        <button onClick={() => handleRequestTypeChange(1)} className="btn" style={{ margin: "0px, 8px", padding: "0px, 16px", color: selectedRequestIndex == 1 ? "#FF622D" : 'grey' }}>Generate Questions (by JD)</button>
        <button onClick={() => handleRequestTypeChange(2)} className="btn" style={{ margin: "0px, 8px", padding: "0px, 16px", color: selectedRequestIndex == 2 ? "#FF622D" : 'grey' }}>Evaluate Answer</button>
        <button onClick={() => handleRequestTypeChange(3)} className="btn" style={{ margin: "0px, 8px", padding: "0px, 16px", color: selectedRequestIndex == 3 ? "#FF622D" : 'grey' }}>Generate JD</button>
        <button onClick={() => handleRequestTypeChange(4)} className="btn" style={{ margin: "0px, 8px", padding: "0px, 16px", color: selectedRequestIndex == 4 ? "#FF622D" : 'grey' }}>Evaluate Resume</button>
      </div>
      <div className="flex space-x-10">
        <div className="flex-1">
          <form onSubmit={handleSubmit}>

            <div name="Configuration">
              <h2 className="text-lg font-bold mb-4 text-left">Configurations</h2>

              <div className='flex flex-row'>
                <div className="mb-4">
                  <label className="block text-gray-700 text-left">Model</label>
                  <select
                    value={model}
                    onChange={(event) => { 
                      setModel(event.target.value); setFormData({ ...formData, model: event.target.value }) }}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}>{availableModels.map(item => {
                      return <option>{item.id}</option>
                    })}</select>
                </div>
                <div className="mb-4 ml-4">
                  <label className="block text-gray-700 text-left">Temperature</label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="2"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}
                  />
                </div>
                <div className="mb-4 ml-4">
                  <label className="block text-gray-700 text-left">Max Tokens</label>
                  <input
                    type="number"
                    name="max_tokens"
                    value={formData.max_tokens}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}
                  />
                </div>

              </div>

              <div className='flex flex-row'>
                <div className="mb-4">
                  <label className="block text-gray-700 text-left">Stop Sequences</label>
                  <input
                    type="text"
                    name="stop"
                    value={formData.stop}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}
                  />
                </div>
                <div className="mb-4 ml-4">
                  <label className="block text-gray-700 text-left">User</label>
                  <input
                    type="text"
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}
                  />
                </div>
                <div className="mb-4 ml-4">
                  <label className="block text-gray-700 text-left">Role</label>
                  <select
                    value={role}
                    onChange={(event) => { setRole(event.target.value); setFormData({ ...formData, role: event.target.value }) }}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}>{roles.map(item => {
                      return <option>{item}</option>
                    })}</select>
                </div>

              </div>

              <div className='flex flex-row'>

                <div className="mb-4">
                  <label className="block text-gray-700 text-left">Top_p</label>
                  <input
                    type="number"
                    name="top_p"
                    value={formData.top_p}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="1"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}
                  />
                </div>

                <div className="mb-4 ml-4">
                  <label className="block text-gray-700 text-left">Presence Penalty</label>
                  <input
                    type="number"
                    name="presence_penalty"
                    value={formData.presence_penalty}
                    onChange={handleChange}
                    step="0.1"
                    min="-2"
                    max="2"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}
                  />
                </div>
                <div className="mb-4 ml-4">
                  <label className="block text-gray-700 text-left">Frequency Penalty</label>
                  <input
                    type="number"
                    name="frequency_penalty"
                    value={formData.frequency_penalty}
                    onChange={handleChange}
                    step="0.1"
                    min="-2"
                    max="2"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}
                  />
                </div>
              </div>

              <div className='flex flex-row'>
                {/* <div className="mb-4">
                  <label className="block text-gray-700 text-left">Best Of</label>
                  <input
                    type="number"
                    name="best_of"
                    value={formData.best_of}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}
                  />
                </div> */}

                {/* <div className="mb-4 ml-4">
                  <label className="block text-gray-700 text-left">Logit Bias</label>
                  <input
                    type="text"
                    name="logit_bias"
                    value={formData.logis_bias}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    style={{ width: 200 }}
                  />
                </div> */}

              </div>




            </div>

            <h2 className="text-lg font-bold mb-4 text-left">Params</h2>
            <div name="Params" className='flex flex-row' style={{ width: '100%' }}>
              {selectedRequestIndex == 0 ?
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-left">Fields</label>
                    <input
                      type="text"
                      name="field"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded w-100"
                      style={{ width: 400 }}
                    />
                  </div>

                  <div className="mb-4 ml-4">
                    <label className="block text-gray-700 text-left">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded"
                    />
                  </div>
                </> :
                selectedRequestIndex == 1 ?
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-left">Job Description</label>
                      <textarea
                        name="prompt"
                        value={jobDescription}
                        onChange={(event) => { setJobDescription(event.target.value) }}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                        style={{ width: 750, height: 200 }}
                      />
                    </div>
                  </>
                  :
                  selectedRequestIndex == 2 ?
                    <div className='flex flex-col'>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-left">Question</label>
                        <input
                          type="text"
                          name="field"
                          value={question}
                          onChange={(event) => { setQuestion(event.target.value) }}
                          className="w-full mt-1 p-2 border border-gray-300 rounded w-100"
                          style={{ width: 750 }}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 text-left">Answer</label>
                        <textarea
                          name="prompt"
                          value={answer}
                          onChange={(event) => { setAnswer(event.target.value) }}
                          className="w-full mt-1 p-2 border border-gray-300 rounded"
                          style={{ width: 750, height: 200 }}
                        />
                      </div>
                    </div>
                    :
                    selectedRequestIndex == 3 ?
                      <div className='flex flex-col'>
                        <div className='flex flex-row'>

                          <div className="mb-4">
                            <label className="block text-gray-700 text-left">Job Title</label>
                            <input
                              type="text"
                              name="field"
                              value={jobTitle}
                              onChange={(event) => { setJobTitle(event.target.value) }}
                              className="w-full mt-1 p-2 border border-gray-300 rounded w-100"
                              style={{ width: 520 }}
                            />
                          </div>

                          <div className="mb-4 ml-4">
                            <label className="block text-gray-700 text-left">Experience</label>
                            <input
                              type="text"
                              name="experience"
                              value={experience2}
                              onChange={(event) => { setExperience2(event.target.value) }}
                              className="w-full mt-1 p-2 border border-gray-300 rounded"
                              style={{ width: 220 }}
                            />
                          </div>

                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-left">Skills</label>
                          <input
                            type="text"
                            name="field"
                            value={skills}
                            onChange={(event) => { setSkills(event.target.value) }}
                            className="w-full mt-1 p-2 border border-gray-300 rounded w-100"
                            style={{ width: 750 }}
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 text-left">Short Job Summary (OPTIONAL)</label>
                          <textarea
                            name="prompt"
                            value={shortSummary}
                            onChange={(event) => { setShortSummary(event.target.value) }}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                            style={{ width: 750, height: 200 }}
                          />
                        </div>
                      </div> :
                      selectedRequestIndex == 4 ?
                        <>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-left">Job Description</label>
                            <textarea
                              name="prompt"
                              value={formData.prompt}
                              onChange={handleChange}
                              className="w-full mt-1 p-2 border border-gray-300 rounded"
                              style={{ width: 650, height: 200 }}
                            />
                          </div>
                        </>
                        :
                        null}
            </div>

            <div className="mb-4">
              <div className='flex flex-row justify-between'>
                <label className="block text-gray-700 text-left">Prompt</label>
                <div onClick={() => setUsePromptOnly(!usePromptOnly)}>
                  <input type="checkbox" checked={usePromptOnly} />
                  <label> Use prompt only</label>
                </div>

              </div>
              <textarea
                name="prompt"
                readOnly={!usePromptOnly}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                }}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                style={{ height: 150, backgroundColor: usePromptOnly ? "#fff" : "#eee" }}
              />
            </div>
            <button
              onClick={() => {
                if (!loading) {
                  switch (selectedRequestIndex) {
                    case 0:
                      generateQuestionsByParams()
                      break;

                    case 1:
                      generateQuestionsByJD()
                      break;

                    case 2:
                      evaluateAnswerByQuestion()
                      break;

                    case 3:
                      generateJobDescriptionByParams()
                      break;

                      case 4:
                      alert("This is not implemented yet.")
                      break;

                    default:
                      break;
                  }
                }
              }}
              type="submit" className="btn mt-4"
              style={{ backgroundColor: loading ? "#ccc" : '#FF622D', color: "#fff", width: 200 }}>{
                loading ? "Generating..." :
                  "Generate Response"}</button>
          </form>
        </div>


        <div className="flex-1">
          <h2 className="text-lg font-bold mb-4">ChatGPT Response</h2>
          {/* <div className="p-4 border border-gray-300 rounded bg-white flex-1" style={{ height: '90%' }}> */}
          {/* This is where the ChatGPT response will be displayed */}
          <textarea
            readOnly
            name="prompt"
            value={ChatGPTResponse}
            onChange={(event) => { setChatGPTResponse(event.target.value) }}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            style={{ height: '90%', }}
          />
          {/* </div> */}
        </div>
      </div >
    </div >
  );
};

export default TestAI;
