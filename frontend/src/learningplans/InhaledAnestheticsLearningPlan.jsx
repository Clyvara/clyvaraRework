import React from "react";
import {
  LearningPlanLayout,
  LessonVideoSection,
  CaseStudySection,
  QuizSection,
} from "../layouts/LearningPlanLayout";

import Video1 from "../assets/videos/InhaledAnesthetics1.mp4";

import ConceptMap1 from "../assets/conceptmaps/InhaledAnestheticsMap1.pdf";

import CaseStudy1 from "../assets/casestudies/Case1InhaledAnesthetics.pdf";
import CaseStudy2 from "../assets/casestudies/Case2InhaledAnesthetics.pdf";
import CaseStudy3 from "../assets/casestudies/Case3InhaledAnesthetics.pdf";

export default function InhaledAnestheticsLearningPlan() {
  return (
    <LearningPlanLayout
      title="Inhaled Anesthetics"
      subtitle="Learn more about inhaled anesthetics and their relation to anesthesia pharmacology."
    >
      <LessonVideoSection
        sectionTitle="What are Inhaled Anesthetics?"
        videoUrls={[Video1]}
      />

      <CaseStudySection
        sectionTitle="Concept Maps and Case Studies"
        initialText={``}
        allowEditing={false}
        pdfUrls={[
          ConceptMap1,
          CaseStudy1,
          CaseStudy2,
          CaseStudy3
        ]}
      />

      <QuizSection 
        topic="Inhaled Anesthetics"
        learningPlanTitle="Inhaled Anesthetics"
        caseStudy=""
        videoUrl={Video1}
        enableDatabase={true}
        enableGenerateQuestions={true}
      />
    </LearningPlanLayout>
  );
}
