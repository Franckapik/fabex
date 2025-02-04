import React, { useState, useEffect } from "react";
import { CNCParametersPanel } from "./components/CNCParametersPanel";
import { CNCScene } from "./components/CNCScene";
import helpTexts from './components/helpTexts'; // Import the help texts
import "./styles.css";

function App() {
  const [depth, setDepth] = useState(5); // Default depth value
  const [params, setParams] = useState({
    operation_depth_start: 0,
    operation_depth_max: 10,
    cutter_diameter: 3,
    // Add other default parameters as needed
  });
  const [helpTitle, setHelpTitle] = useState("");
  const [helpDescription, setHelpDescription] = useState("");
  const [language, setLanguage] = useState("English"); // Default language

  const handleSetHelpText = (text) => {
    const [title, description] = text.split(": ");
    setHelpTitle(title);
    setHelpDescription(description);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    // Update help text when language changes
    if (helpTitle) {
      handleSetHelpText(`${helpTitle}: ${helpTexts[language][helpTitle]}`);
    }
  }, [language]);

  return (
    <div className="main-container">
      <div className="main-content">
        <div className="scene">
          <img src="/logo_fabex.svg" alt="Logo" className="logo" />
          <CNCScene depth={depth} params={params} />
        </div>
        <div className="help-text">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "18px", fontWeight: "bold" }}>{helpTitle}</h4>
            <select style={{ position: "absolute", right: 0 }} value={language} onChange={handleLanguageChange}>
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
          </div>
          <p style={{ margin: 0, fontSize: "16px" }}>{helpDescription}</p>
        </div>
      </div>
      <div className="sidebar">
        <CNCParametersPanel onUpdate={(newParams) => setParams(newParams)} setHelpText={handleSetHelpText} language={language} key={language} />
      </div>
    </div>
  );
}

export default App;
