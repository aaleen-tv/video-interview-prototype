

const doList = [
    "Ensure you have a stable internet connection.",
    "Use a device with a working camera and microphone.",
    "Test your equipment before the interview to avoid technical issues.",
    "Choose a quiet, well-lit space free from distractions.",
    "Use a neutral background to maintain a professional appearance."
];

const dontList = [
    "Connect any external device to your primary device.",
    "Refresh screen, change tab or window during test.",
    "Make any unnecessary eye or body movement.",
    "Avoid interruptions"

]

const reactInterviewQuestions = [
    {
        "id": 1,
        // "screeningTestId": "1",
        "question": "Explain the concept of hooks in React. How do they differ from class-based components?",
        "difficulty": "Easy",
        // "duration": "",
        // "answerUrl": "",
        // "videoUrl": "",
        // "score": null,
        // "timestamp": "2024-07-04 06:15:33"
    },
    {
        "id": 2,
        // "screeningTestId": "1",
        "question": "What are the use cases for useEffect and how does it differ from useLayoutEffect?",
        "difficulty": "Moderate",
        // "duration": "",
        // "answerUrl": "",
        // "videoUrl": "",
        // "score": null,
        // "timestamp": "2024-07-04 06:16:49"
    },
    {
        "id": 3,
        // "screeningTestId": "1",
        "question": "How would you optimize a large React application for performance?",
        "difficulty": "Moderate",
        // "duration": "",
        // "answerUrl": "",
        // "videoUrl": "",
        // "score": null,
        // "timestamp": "2024-07-04 06:17:20"
    },
    {
        "id": 4,
        // "screeningTestId": "1",
        "question": "Describe how context works in React and provide an example of when you would use it.",
        "difficulty": "Hard",
        // "duration": "",
        // "answerUrl": "",
        // "videoUrl": "",
        // "score": null,
        // "timestamp": "2024-07-04 06:17:41"
    },
    {
        "id": 5,
        // "screeningTestId": "1",
        "question": "Explain the differences between React.memo and useMemo. When would you use each?",
        "difficulty": "Easy",
        // "duration": "",
        // "answerUrl": "",
        // "videoUrl": "",
        // "score": null,
        // "timestamp": "2024-07-04 06:18:06"
    }
];

const jobDesc = `<body>
<h2> Job Summary </h2>
<p>
The ideal candidate will be a highly skilled and motivated Full Stack Developer who will play a critical role in designing, developing, and maintaining our cutting-edge software applications. He/She will work on both the front-end and back-end components, ensuring seamless integration and excellent user experiences.
</p>

<h2> Key Responsibilities </h2>
<ul>
<li> Design and develop user interfaces using ReactJS best practices.</li>
<li> Develop server-side logic using Node.js, ensuring high performance and responsiveness.</li>
<li> Maintain and troubleshoot existing applications.</li>
<li> Use JavaScript to create interactive web applications.</li>
<li> Design and implement APIs in support of front-end services and help create a highly scalable, flexible, and secure backend.</li>
<li> Work alongside graphic designers for web design features.</li>
<li> Ensure cross-platform optimization for mobile devices.</li>
<li> Stay abreast of developments in technology trends.</li>
</ul>

<h2> Qualification </h2>
<p>
  A degree in Computer Science, Information Technology or related field with a minimum of 5 years of experience in Full Stack development using React, Node, and JavaScript.
 </p>

<h2> Skills </h2>
<h3> Technical Skills </h3>
<ul>
<li> Proficiency with ReactJS, NodeJS, and Javascript.</li>
<li> Understanding and implementation of security and data protection.</li>
<li> Familiarity with JavaScript module loaders, such as Require.js and module bundlers like Webpack.</li>
<li> Experience with data structure libraries.</li>
<li> Knowledge of modern authorization mechanisms, such as JSON Web Token.</li>
<li> Familiarity with modern front-end build pipelines and tools.</li>
<li> Experience with common development tools such as Babel, Webpack, etc.</li>
<li> Ability to understand business requirements and translate them into technical requirements.</li>
 </ul>

<h3> Non-Technical Skills </h3>
 <ul>
<li> Exceptional problem-solving skills.</li>
<li> Good verbal and written communication skills.</li>
<li> Strong organizational and time management skills.</li>
<li> Attention to detail and a high level of accuracy.</li>
<li> Ability to work independently and as part of a team.</li>
<li> Capacity to manage high stress situations.</li>
 </ul>
 </body>`

export {
    doList,
    dontList,
    reactInterviewQuestions,
    jobDesc
};