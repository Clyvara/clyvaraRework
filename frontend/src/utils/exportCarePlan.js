// exportCarePlan.js

// 1. build a flat object with nice labels
export function buildExportObject(formState) {
    return {
      // Patient Information
      Age: formState.age,
      Sex: formState.sex,
      Height: formState.height,
      Weight: formState.weight,
      Diagnosis: formState.diagnosis,
      "Body Temperature (F)": formState.tempF,
      "Blood Pressure (mm Hg)": formState.bp,
      "Heart Rate (bpm)": formState.hr,
      "Respiration Rate (bpm)": formState.rr,
  
      // Patient History
      "Past Medical History": formState.pmh,
      "Past Surgical History": formState.psh,
      "Anesthetic / Family Anesthetic History": formState.anesthesiaHx,
      "Medications": formState.meds,
      "Alcohol Use": formState.alcohol,
      "Substance Use": formState.substance,
  
      // Review of Systems
      Neuro: formState.neuro,
      HEENT: formState.heent,
      Respiratory: formState.resp,
      Cardiovascular: formState.cardio,
      Gastrointestinal: formState.gi,
      Genitourinary: formState.gu,
      Endocrine: formState.endo,
      Other: formState.otherFindings,
  
      // Airway
      Mallampati: formState.mallampati,
      "ULBT Grade": formState.ulbt,
      "Thyromental Distance (cm)": formState.thyromental,
      "Interincisor Distance (cm)": formState.interincisor,
      Dentition: formState.dentition,
      Neck: formState.neck,
      "Oral Mucosa": formState.oralMucosa,
  
      // Labs
      Na: formState.na,
      K: formState.k,
      Cl: formState.cl,
      CO2: formState.co2,
      BUN: formState.bun,
      Cr: formState.cr,
      Glu: formState.glu,
      WBC: formState.wbc,
      Hgb: formState.hgb,
      Hct: formState.hct,
      PLT: formState.plt,
      PT: formState.pt,
      PTT: formState.ptt,
      INR: formState.inr,
      ABG: formState.abg,
      "Other Labs": formState.otherLabs,
  
      // Imaging / Tests
      EKG: formState.ekg,
      CXR: formState.cxr,
      Echo: formState.echo,
      "Other Imaging": formState.otherImaging,
    };
  }
  
  // 2. convert object → text lines "Label: value"
  export function buildExportText(formState) {
    const data = buildExportObject(formState);
  
    const lines = Object.entries(data).map(([label, value]) => {
      return `${label}: ${value || ""}`;
    });
  
    return lines.join("\n");
  }
  
  // 3. trigger browser download OR return the string
  export function downloadCarePlanTxt(formState) {
    const text = buildExportText(formState);
  
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "careplanInputs.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
  }
  