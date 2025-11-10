// learningPlanQuestions.js

const learningPlanQuestions = [
    {
      id: 'q1',
      type: 'single',
      text: 'Which finding most strongly supports a cardiogenic cause of dyspnea in this case?',
      options: [
        'Fever of 99.1°F',
        'Bibasilar crackles and cardiomegaly on CXR',
        'Room air SpO₂ of 93%',
        'Respiration rate of 22',
      ],
      correctIndex: 1,
      explanation: 'Crackles with cardiomegaly on CXR are classic for fluid overload/congestive physiology.'
    },
    {
      id: 'q2',
      type: 'single',
      text: 'Which initial test BEST evaluates fluid status and LV function at bedside?',
      options: [
        'Arterial blood gas',
        'Point-of-care ultrasound (POCUS) with cardiac views',
        'D-dimer',
        'Peak flow meter',
      ],
      correctIndex: 1,
      explanation: 'POCUS can rapidly assess LV function, IVC dynamics, and B-lines for pulmonary edema.'
    },
    {
      id: 'q3',
      type: 'single',
      text: 'Which immediate intervention is MOST appropriate?',
      options: [
        'Large 2L crystalloid bolus',
        'Begin diuresis and supplemental oxygen as needed',
        'Empiric anticoagulation',
        'Non-action; observe for 24–48h',
      ],
      correctIndex: 1,
      explanation: 'In suspected cardiogenic pulmonary edema, diuresis and oxygen support are front-line.'
    }
  ];
  
  export default learningPlanQuestions;
  