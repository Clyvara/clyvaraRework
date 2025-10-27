import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { downloadCarePlanTxt } from "../utils/exportCarePlan";
import { buildFormState } from "../utils/buildFormState";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #0f172a;
`;

const HeaderCard = styled.div`
  background: #eef3ff;
  border: 1px solid #dbe2ff;
  border-radius: 8px;
  padding: 24px;
  font-family: 'Rethink Sans', system-ui, sans-serif;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
  color: #0f172a;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  color: #4b5563;
  text-align: center;
`;

const SectionCard = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 24px;
  font-family: 'Rethink Sans', system-ui, sans-serif;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
`;

const SectionIcon = styled.span`
  font-size: 18px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
`;

const TabsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: #f8fafc;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  padding: 4px;
  width: 100%;
  max-width: 600px;
  gap: 5px;
`;

const TabButton = styled.button`
  flex: 1;
  min-width: max-content;
  background: ${p => (p.$active ? "#ffffff" : "transparent")};
  border: 0;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: ${p => (p.$active ? "600" : "500")};
  color: ${p => (p.$active ? "#0f172a" : "#4b5563")};
  text-align: center;
  cursor: pointer;

  &:hover {
    background: ${p => (p.$active ? "#ffffff" : "rgba(0,0,0,0.03)")};
  }

  &:focus {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }
`;

const FormGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 60px;
  margin-top: 16px;
  max-width: 800px;
`;

const VitalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 16px;
  column-gap: 48px;
  max-width: 800px;
`;

const FormRowFull = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  max-width: 800px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SmallGrid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 20px 40px;
  margin-top: 16px;
  max-width: 1000px;
`;

const SmallGrid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 20px 24px;
  margin-top: 16px;
  max-width: 1000px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
`;

const Req = styled.span`
  color: #dc2626;
  font-size: 14px;
  line-height: 1;
`;

const Input = styled.input`
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  color: #0f172a;
  font-family: inherit;

  &:focus {
    outline: 2px solid #4f46e5;
    border-color: #4f46e5;
  }
`;

const Select = styled.select`
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  color: #0f172a;
  font-family: inherit;

  &:focus {
    outline: 2px solid #4f46e5;
    border-color: #4f46e5;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  color: #0f172a;
  min-height: 70px;
  font-family: inherit;
  resize: none;

  &:focus {
    outline: 2px solid #4f46e5;
    border-color: #4f46e5;
  }
`;

const SmallInput = styled(Input)`
  width: 60%;
  min-width: 180px;
`;

const TinyInput = styled.input`
  width: 70%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 8px;
  min-height: 24px;
  font-size: 13px;
  color: #0f172a;
  font-family: inherit;
  line-height: 1.3;

  &:focus {
    outline: 2px solid #4f46e5;
    border-color: #4f46e5;
  }
`;

const AirwayTextArea = styled.textarea`
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 13px;
  color: #0f172a;
  min-height: 60px;
  font-family: inherit;
  resize: none;

  &:focus {
    outline: 2px solid #4f46e5;
    border-color: #4f46e5;
  }
`;

const AirwayGrid2x2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 24px;
  max-width: 800px;
  margin-top: 16px;
  align-items: start;
`;

const AirwayRow3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  column-gap: 48px;
  row-gap: 24px;
  max-width: 1000px;
  margin-top: 24px;
`;

const HintRow = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 8px 0 0 0;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SubsectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 32px 0 16px 0;
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  align-items: center;
`;

const BackButton = styled.button`
  background: #e5e7eb;
  color: #1f2937;
  font-size: 14px;
  font-weight: 500;
  border: 0;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;

  &:hover {
    background: #d1d5db;
  }

  &:focus {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }
`;

const NextButton = styled.button`
  background: #4f46e5;
  color: white;
  font-size: 14px;
  font-weight: 500;
  border: 0;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;

  &:hover {
    background: #4338ca;
  }

  &:focus {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }
`;

export default function CarePlanPage() {
  const [currentTab, setCurrentTab] = useState("info"); // "info" | "history" | "assessment" | "labs"

  /* TAB 1: Patient Info */
  const [age, setAge] = useState("please-select");
  const [sex, setSex] = useState("please-select");
  const [height, setHeight] = useState("please-select");
  const [weight, setWeight] = useState("please-select");

  const [diagnosis, setDiagnosis] = useState("");
  const [tempF, setTempF] = useState("");
  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const [rr, setRr] = useState("");

  /* TAB 2: History */
  const [pmh, setPmh] = useState("");
  const [psh, setPsh] = useState("");
  const [anesthesiaHx, setAnesthesiaHx] = useState("");
  const [meds, setMeds] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [substance, setSubstance] = useState("");

  /* TAB 3: Assessment */
  const [neuro, setNeuro] = useState("");
  const [heent, setHeent] = useState("");
  const [resp, setResp] = useState("");
  const [cardio, setCardio] = useState("");
  const [gi, setGi] = useState("");
  const [gu, setGu] = useState("");
  const [endo, setEndo] = useState("");
  const [otherFindings, setOtherFindings] = useState("");

  const [mallampati, setMallampati] = useState("please-select");
  const [ulbt, setUlbt] = useState("please-select");
  const [thyromental, setThyromental] = useState("");
  const [interincisor, setInterincisor] = useState("");
  const [dentition, setDentition] = useState("");
  const [neck, setNeck] = useState("");
  const [oralMucosa, setOralMucosa] = useState("");

  /* TAB 4: Labs / Tests */
  const [na, setNa] = useState("");
  const [k, setK] = useState("");
  const [cl, setCl] = useState("");
  const [co2, setCo2] = useState("");
  const [bun, setBun] = useState("");
  const [cr, setCr] = useState("");
  const [glu, setGlu] = useState("");
  const [wbc, setWbc] = useState("");
  const [hgb, setHgb] = useState("");
  const [hct, setHct] = useState("");
  const [plt, setPlt] = useState("");
  const [pt, setPt] = useState("");
  const [ptt, setPtt] = useState("");
  const [inr, setInr] = useState("");
  const [abg, setAbg] = useState("");
  const [otherLabs, setOtherLabs] = useState("");

  const [ekg, setEkg] = useState("");
  const [cxr, setCxr] = useState("");
  const [echo, setEcho] = useState("");
  const [otherImaging, setOtherImaging] = useState("");

  /* dropdown options */
  const sexOptions = ["Female", "Male", "Other"];

  const ageOptions = useMemo(() => {
    const arr = ["< 6 months"];
    for (let i = 1; i <= 100; i++) arr.push(`${i}`);
    return arr;
  }, []);

  const heightOptions = useMemo(() => {
    const arr = ["< 2 ft"];
    for (let feet = 2; feet <= 7; feet++) {
      for (let inch = 0; inch < 12; inch++) {
        arr.push(`${feet}'${inch}"`);
      }
    }
    arr.push("> 7 ft");
    return arr;
  }, []);

  const weightOptions = useMemo(() => {
    const arr = ["< 50 lbs"];
    let w = 50.0;
    while (w <= 250.0 + 0.001) {
      arr.push(`${w.toFixed(1)} lbs`);
      w += 2.5;
    }
    arr.push("> 250 lbs");
    return arr;
  }, []);

  const mallampatiOptions = ["Mallampati I", "Mallampati II", "Mallampati III", "Mallampati IV"];
  const ulbtOptions = ["Grade I", "Grade II", "Grade III"];

  const handleNext = () => {
    if (currentTab === "info") {
      setCurrentTab("history");
    } else if (currentTab === "history") {
      setCurrentTab("assessment");
    } else if (currentTab === "assessment") {
      setCurrentTab("labs");
    } else {
      console.log("Generate care plan!");
    }
  };

  const handleBack = () => {
    if (currentTab === "history") {
      setCurrentTab("info");
    } else if (currentTab === "assessment") {
      setCurrentTab("history");
    } else if (currentTab === "labs") {
      setCurrentTab("assessment");
    }
  };

  const renderFooter = (showBack, nextLabel) => (
    <FooterRow>
      <div>
        {showBack ? (
          <BackButton onClick={handleBack}>Back</BackButton>
        ) : (
          <span />
        )}
      </div>
      <NextButton onClick={handleNext}>{nextLabel}</NextButton>
    </FooterRow>
  );

  const renderInfoTab = () => (
    <>
      <HintRow>
        <Req>*</Req>
        <span>Suggested fields</span>
      </HintRow>

      <FormGrid2>
        <FieldGroup>
          <LabelRow>
            <Label>Age:</Label>
            <Req>*</Req>
          </LabelRow>
          <Select value={age} onChange={e => setAge(e.target.value)}>
            <option value="please-select" disabled>
              Please select
            </option>
            {ageOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <LabelRow>
            <Label>Sex:</Label>
            <Req>*</Req>
          </LabelRow>
          <Select value={sex} onChange={e => setSex(e.target.value)}>
            <option value="please-select" disabled>
              Please select
            </option>
            {sexOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <LabelRow>
            <Label>Height:</Label>
            <Req>*</Req>
          </LabelRow>
          <Select value={height} onChange={e => setHeight(e.target.value)}>
            <option value="please-select" disabled>
              Please select
            </option>
            {heightOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <LabelRow>
            <Label>Weight:</Label>
            <Req>*</Req>
          </LabelRow>
          <Select value={weight} onChange={e => setWeight(e.target.value)}>
            <option value="please-select" disabled>
              Please select
            </option>
            {weightOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </FieldGroup>
      </FormGrid2>

      <FormRowFull>
        <LabelRow>
          <Label>Allergies:</Label>
        </LabelRow>
        <TextArea placeholder="Enter allergies or type 'None' if not applicable" />
      </FormRowFull>

      <FormRowFull>
        <LabelRow>
          <Label>Diagnosis:</Label>
          <Req>*</Req>
        </LabelRow>
        <TextArea
          placeholder="Enter diagnosis"
          value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
        />
      </FormRowFull>

      <FormRowFull>
        <LabelRow>
          <Label>Surgery/Procedure:</Label>
        </LabelRow>
        <TextArea placeholder="Enter surgery/procedure" />
      </FormRowFull>

      <FormRowFull>
        <LabelRow>
          <Label>Cultural/Religious Attributes:</Label>
        </LabelRow>
        <TextArea placeholder="Enter cultural/religious attributes or type 'None' if not applicable" />
      </FormRowFull>

      <SubsectionTitle>Vital Signs</SubsectionTitle>

      <VitalGrid>
        <FieldGroup>
          <LabelRow>
            <Label>Body Temperature (F):</Label>
            <Req>*</Req>
          </LabelRow>
          <Input
            placeholder="Enter temperature"
            value={tempF}
            onChange={e => setTempF(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow>
            <Label>Blood Pressure (mm Hg):</Label>
            <Req>*</Req>
          </LabelRow>
          <Input
            placeholder="Enter blood pressure"
            value={bp}
            onChange={e => setBp(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow>
            <Label>Heart Rate (bpm):</Label>
            <Req>*</Req>
          </LabelRow>
          <Input
            placeholder="Enter heart rate"
            value={hr}
            onChange={e => setHr(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow>
            <Label>Respiration Rate (bpm):</Label>
            <Req>*</Req>
          </LabelRow>
          <Input
            placeholder="Enter respiratory rate"
            value={rr}
            onChange={e => setRr(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow>
            <Label>Room Air O2 Sat (%):</Label>
          </LabelRow>
          <Input placeholder="Enter O₂ saturation" />
        </FieldGroup>

        <FieldGroup>
          <LabelRow>
            <Label>Date of LMP:</Label>
          </LabelRow>
          <Input placeholder="Enter LMP or type 'N/A' if not applicable" />
        </FieldGroup>
      </VitalGrid>

      {renderFooter(false, "Next Tab")}
    </>
  );

  const renderHistoryTab = () => (
    <>
      <HintRow>
        <Req>*</Req>
        <span>Suggested fields</span>
      </HintRow>

      <FormRowFull>
        <LabelRow><Label>Past Medical History:</Label></LabelRow>
        <TextArea
          placeholder="Enter past medical history or type 'None'"
          value={pmh}
          onChange={e => setPmh(e.target.value)}
        />
      </FormRowFull>

      <FormRowFull>
        <LabelRow><Label>Past Surgical History:</Label></LabelRow>
        <TextArea
          placeholder="Enter past surgical history or type 'None'"
          value={psh}
          onChange={e => setPsh(e.target.value)}
        />
      </FormRowFull>

      <FormRowFull>
        <LabelRow><Label>Anesthetic History / Family Anesthetic History:</Label></LabelRow>
        <TextArea
          placeholder="Enter anesthetic history or type 'None'"
          value={anesthesiaHx}
          onChange={e => setAnesthesiaHx(e.target.value)}
        />
      </FormRowFull>

      <FormRowFull>
        <LabelRow><Label>Current Medications:</Label></LabelRow>
        <TextArea
          placeholder="Enter current medications or type 'None'"
          value={meds}
          onChange={e => setMeds(e.target.value)}
        />
      </FormRowFull>

      <FormRowFull>
        <LabelRow><Label>Alcohol Use:</Label></LabelRow>
        <TextArea
          placeholder="Enter alcohol use or type 'None'"
          value={alcohol}
          onChange={e => setAlcohol(e.target.value)}
        />
      </FormRowFull>

      <FormRowFull>
        <LabelRow><Label>Substance Use:</Label></LabelRow>
        <TextArea
          placeholder="Enter substance use or type 'None'"
          value={substance}
          onChange={e => setSubstance(e.target.value)}
        />
      </FormRowFull>

      {renderFooter(true, "Next Tab")}
    </>
  );

  const renderAssessmentTab = () => (
    <>
      <HintRow>
        <Req>*</Req>
        <span>Suggested fields</span>
      </HintRow>

      <SubsectionTitle>Review of Systems</SubsectionTitle>

      <FormGrid2>
        <FieldGroup>
          <LabelRow><Label>Neuro:</Label></LabelRow>
          <TextArea
            placeholder="Enter neurological findings or type 'WNL'"
            value={neuro}
            onChange={e => setNeuro(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>HEENT:</Label></LabelRow>
          <TextArea
            placeholder="Enter HEENT findings or type 'WNL'"
            value={heent}
            onChange={e => setHeent(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Respiratory:</Label></LabelRow>
          <TextArea
            placeholder="Enter respiratory findings or type 'WNL'"
            value={resp}
            onChange={e => setResp(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Cardiovascular:</Label></LabelRow>
          <TextArea
            placeholder="Enter cardiovascular findings or type 'WNL'"
            value={cardio}
            onChange={e => setCardio(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Gastrointestinal:</Label></LabelRow>
          <TextArea
            placeholder="Enter gastrointestinal findings or type 'WNL'"
            value={gi}
            onChange={e => setGi(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Genitourinary:</Label></LabelRow>
          <TextArea
            placeholder="Enter genitourinary findings or type 'WNL'"
            value={gu}
            onChange={e => setGu(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Endocrine:</Label></LabelRow>
          <TextArea
            placeholder="Enter endocrine findings or type 'WNL'"
            value={endo}
            onChange={e => setEndo(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Other:</Label></LabelRow>
          <TextArea
            placeholder="Enter other findings or type 'WNL'"
            value={otherFindings}
            onChange={e => setOtherFindings(e.target.value)}
          />
        </FieldGroup>
      </FormGrid2>

      <SubsectionTitle>Airway Assessment</SubsectionTitle>

      {/* airway inputs grouped in 2x2 grid */}
      <AirwayGrid2x2>
        <FieldGroup>
          <LabelRow><Label>Airway/Mallampati:</Label></LabelRow>
          <Select
            value={mallampati}
            onChange={e => setMallampati(e.target.value)}
          >
            <option value="please-select" disabled>
              Select Mallampati
            </option>
            {mallampatiOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>ULBT Grade:</Label></LabelRow>
          <Select
            value={ulbt}
            onChange={e => setUlbt(e.target.value)}
          >
            <option value="please-select" disabled>
              Select ULBT Grade
            </option>
            {ulbtOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Thyromental Distance in cm:</Label></LabelRow>
          <SmallInput
            placeholder="Enter distance in cm"
            value={thyromental}
            onChange={e => setThyromental(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Interincisor Distance in cm:</Label></LabelRow>
          <SmallInput
            placeholder="Enter distance in cm"
            value={interincisor}
            onChange={e => setInterincisor(e.target.value)}
          />
        </FieldGroup>
      </AirwayGrid2x2>

      {/* row 2: dentition / neck / oral mucosa */}
      <AirwayRow3>
        <FieldGroup>
          <LabelRow><Label>Dentition:</Label></LabelRow>
          <AirwayTextArea
            placeholder="Enter dentition findings or type 'WNL'"
            value={dentition}
            onChange={e => setDentition(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Neck:</Label></LabelRow>
          <AirwayTextArea
            placeholder="Enter neck findings or type 'WNL'"
            value={neck}
            onChange={e => setNeck(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Oral Mucosa:</Label></LabelRow>
          <AirwayTextArea
            placeholder="Enter oral mucosa findings or type 'WNL'"
            value={oralMucosa}
            onChange={e => setOralMucosa(e.target.value)}
          />
        </FieldGroup>
      </AirwayRow3>

      {renderFooter(true, "Next Tab")}
    </>
  );

  const renderLabsTab = () => (
    <>
      <HintRow>
        <Req>*</Req>
        <span>Suggested fields</span>
      </HintRow>

      <SubsectionTitle>Labs</SubsectionTitle>

      <SmallGrid3>
        <FieldGroup>
          <LabelRow><Label>Na:</Label></LabelRow>
          <TinyInput
            value={na}
            onChange={e => setNa(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>K:</Label></LabelRow>
          <TinyInput
            value={k}
            onChange={e => setK(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Cl:</Label></LabelRow>
          <TinyInput
            value={cl}
            onChange={e => setCl(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>CO2:</Label></LabelRow>
          <TinyInput
            value={co2}
            onChange={e => setCo2(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>BUN:</Label></LabelRow>
          <TinyInput
            value={bun}
            onChange={e => setBun(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Cr:</Label></LabelRow>
          <TinyInput
            value={cr}
            onChange={e => setCr(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Glu:</Label></LabelRow>
          <TinyInput
            value={glu}
            onChange={e => setGlu(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>WBC:</Label></LabelRow>
          <TinyInput
            value={wbc}
            onChange={e => setWbc(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Hgb:</Label></LabelRow>
          <TinyInput
            value={hgb}
            onChange={e => setHgb(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Hct:</Label></LabelRow>
          <TinyInput
            value={hct}
            onChange={e => setHct(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>PLT:</Label></LabelRow>
          <TinyInput
            value={plt}
            onChange={e => setPlt(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>PT:</Label></LabelRow>
          <TinyInput
            value={pt}
            onChange={e => setPt(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>PTT:</Label></LabelRow>
          <TinyInput
            value={ptt}
            onChange={e => setPtt(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>INR:</Label></LabelRow>
          <TinyInput
            value={inr}
            onChange={e => setInr(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>ABG:</Label></LabelRow>
          <TinyInput
            value={abg}
            onChange={e => setAbg(e.target.value)}
          />
        </FieldGroup>
      </SmallGrid3>

      <FormRowFull style={{ maxWidth: "1000px" }}>
        <LabelRow><Label>Other Labs:</Label></LabelRow>
        <TinyInput
          value={otherLabs}
          onChange={e => setOtherLabs(e.target.value)}
        />
      </FormRowFull>

      <SubsectionTitle>Imaging/Tests</SubsectionTitle>

      <SmallGrid2>
        <FieldGroup>
          <LabelRow><Label>EKG:</Label></LabelRow>
          <TinyInput
            value={ekg}
            onChange={e => setEkg(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>CXR:</Label></LabelRow>
          <TinyInput
            value={cxr}
            onChange={e => setCxr(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Echo:</Label></LabelRow>
          <TinyInput
            value={echo}
            onChange={e => setEcho(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <LabelRow><Label>Other Imaging:</Label></LabelRow>
          <TinyInput
            value={otherImaging}
            onChange={e => setOtherImaging(e.target.value)}
          />
        </FieldGroup>
      </SmallGrid2>

      <FooterRow>
        <BackButton onClick={handleBack}>Back</BackButton>

        <NextButton
          onClick={() => {
            // Option A: just download the .txt
            downloadCarePlanTxt(formState);

            // Option B (optional): also log the string somewhere for debugging
            // console.log(buildExportText(formState));
          }}
        >
          Generate Care Plan
        </NextButton>
      </FooterRow>
    </>
  );

  let tabContent;
  if (currentTab === "info") tabContent = renderInfoTab();
  else if (currentTab === "history") tabContent = renderHistoryTab();
  else if (currentTab === "assessment") tabContent = renderAssessmentTab();
  else if (currentTab === "labs") tabContent = renderLabsTab();

  const formState = buildFormState({
    age,
    sex,
    height,
    weight,
    diagnosis,
    tempF,
    bp,
    hr,
    rr,
    pmh,
    psh,
    anesthesiaHx,
    meds,
    alcohol,
    substance,
    neuro,
    heent,
    resp,
    cardio,
    gi,
    gu,
    endo,
    otherFindings,
    mallampati,
    ulbt,
    thyromental,
    interincisor,
    dentition,
    neck,
    oralMucosa,
    na,
    k,
    cl,
    co2,
    bun,
    cr,
    glu,
    wbc,
    hgb,
    hct,
    plt,
    pt,
    ptt,
    inr,
    abg,
    otherLabs,
    ekg,
    cxr,
    echo,
    otherImaging,
  });

  return (
    <PageWrapper>
      <HeaderCard>
        <Title>AI Anesthesia Care Plan Generator</Title>
        <Subtitle>
          Generate comprehensive, evidence-based anesthesia care plans with AI assistance
        </Subtitle>
      </HeaderCard>

      <SectionCard>
        <SectionHeader>
          <SectionTitleRow>
            <SectionIcon>🩺</SectionIcon>
            <SectionTitle>Patient Assessment</SectionTitle>
          </SectionTitleRow>

          <TabsBar>
            <TabButton
              $active={currentTab === "info"}
              onClick={() => setCurrentTab("info")}
            >
              Patient Information
            </TabButton>

            <TabButton
              $active={currentTab === "history"}
              onClick={() => setCurrentTab("history")}
            >
              Patient History
            </TabButton>

            <TabButton
              $active={currentTab === "assessment"}
              onClick={() => setCurrentTab("assessment")}
            >
              Patient Assessment
            </TabButton>

            <TabButton
              $active={currentTab === "labs"}
              onClick={() => setCurrentTab("labs")}
            >
              Labs/Tests
            </TabButton>
          </TabsBar>
        </SectionHeader>

        <br />
        {tabContent}
      </SectionCard>
    </PageWrapper>
  );
}
