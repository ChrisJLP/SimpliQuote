22/10/24
I've started the project by sketching out designs, trying to think of all the featueres I want to add, before starting development. I've created a file structure with all the files I'll need for the project. I've planned the project out a lot more than my previous project, to try to avoid feature creep and to have development be more streamlined.

This is the current file structure:

simpliquote/
├── node_modules/
├── public/
│ └── vite.svg
├── src/
│ ├── assets/
│ │ └── react.svg
│ ├── components/
│ │ ├── Button.jsx
│ │ ├── Footer.jsx
│ │ ├── FormInput.jsx
│ │ └── Navbar.jsx
│ ├── features/
│ │ ├── Costs/
│ │ │ ├── CreateCosts.jsx
│ │ │ ├── EditCosts.jsx
│ │ │ └── ViewCosts.jsx
│ │ ├── Project/
│ │ │ ├── CreateProject.jsx
│ │ │ ├── EditProject.jsx
│ │ │ ├── ProjectList.jsx
│ │ │ └── ProjectSummary.jsx
│ │ ├── Shared/
│ │ │ ├── ListItem.jsx
│ │ │ ├── ProjectTaskForm.jsx
│ │ │ └── SummaryView.jsx
│ │ ├── Task/
│ │ │ ├── CreateTask.jsx
│ │ │ ├── EditTask.jsx
│ │ │ └── TaskSummary.jsx
│ ├── hooks/
│ │ └── useForm.js
│ ├── pages/
│ │ ├── Homepage.jsx
│ │ ├── OpenProject.jsx
│ │ └── OpenTask.jsx
│ ├── styles/
│ │ └── index.css
│ ├── utils/
│ │ ├── calculateCost.js
│ │ └── generateQuote.js
│ ├── App.jsx
│ ├── main.jsx
│ └── tests/
│ ├── components/
│ │ ├── Button.test.jsx
│ │ ├── Navbar.test.jsx
│ │ └── FormInput.test.jsx
│ ├── features/
│ │ ├── Project/
│ │ │ ├── CreateProject.test.jsx
│ │ │ ├── EditProject.test.jsx
│ │ │ └── ProjectList.test.jsx
│ │ ├── Task/
│ │ │ ├── CreateTask.test.jsx
│ │ │ └── TaskSummary.test.jsx
│ │ └── Costs/
│ │ └── CreateCosts.test.jsx
│ ├── hooks/
│ │ └── useForm.test.js
│ ├── pages/
│ │ ├── Homepage.test.jsx
│ │ └── OpenProject.test.jsx
│ └── utils/
│ ├── calculateCost.test.js
│ └── generateQuote.test.js
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js

I've tried to separate concepts to different components so that everything is modular and easy to maintain and work on during development.

29/10/2024

I've made a homepage for the app, and added some basic tests.
Next, I'll be working on the form to create a new project. First, I'll be looking at creating a basic form without validation or subtasks etc.

02/10/24

I found that in the form that appears when 'create a new project' is clicked, it's not that obvious that the form is scrollable once it reaches a certain size. So, I force enabled the scrollbar on the right once the form reaches 75% the height of the viewport and becomes scrollable.
