import React, { useState, useEffect } from "react";
import { CNCParametersPanel } from "./components/CNCParametersPanel";
import { CNCScene } from "./components/CNCScene";
import helpTexts from './components/helpTexts'; // Import the help texts
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faStepForward, faGamepad } from '@fortawesome/free-solid-svg-icons'; // Import icons
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
  const [mode, setMode] = useState("Free"); // Default mode
  const [showStepModal, setShowStepModal] = useState(false); // State for Step by Step modal visibility
  const [showGameModal, setShowGameModal] = useState(false); // State for Game modal visibility
  const [instructions, setInstructions] = useState([]); // State for instructions
  const [currentStep, setCurrentStep] = useState(0); // State for current step

  const handleSetHelpText = (text) => {
    const [title, description] = text.split(": ");
    setHelpTitle(title);
    setHelpDescription(description);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "Step by Step") {
      setShowStepModal(true); // Show Step by Step modal when mode is selected
    } else if (newMode === "Game") {
      setShowGameModal(true); // Show Game modal when mode is selected
    } else if (newMode === "Free") {
      setInstructions([]); // Clear instructions when Free mode is selected
    }
  };

  const handleMouseEnter = (title, description) => {
    setHelpTitle(title);
    setHelpDescription(description);
  };

  const handleMouseLeave = () => {
    setHelpTitle("");
    setHelpDescription("");
  };

  const handleOperationSelect = (operation) => {
    const steps = getStepsForOperation(operation);
    setInstructions(steps);
    setCurrentStep(0);
    setShowStepModal(false);
    setShowGameModal(false);
  };

  const getStepsForOperation = (operation) => {
    switch (operation) {
      case "Profile":
        return [
          "Step 1: Set the start point.",
          "Step 2: Adjust the cut type.",
          "Step 3: Set the toolpath distance.",
          "Step 4: Configure the depth."
        ];
      case "Pocket":
        return [
          "Step 1: Set the pocket type.",
          "Step 2: Adjust the skin.",
          "Step 3: Set the toolpath spacing.",
          "Step 4: Configure the depth."
        ];
      case "Drill":
        return [
          "Step 1: Set the drill hole position.",
          "Step 2: Adjust the drill depth.",
          "Step 3: Configure the feedrate."
        ];
      case "Parallel":
        return [
          "Step 1: Set the path angle.",
          "Step 2: Adjust the toolpath spacing.",
          "Step 3: Configure the depth."
        ];
      default:
        return [];
    }
  };

  const handleNextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
          <div className="logo-mode-wrapper">
            <div className="mode-menu">
              <div className="mode-item" onClick={() => handleModeChange("Free")} onMouseEnter={() => handleMouseEnter("Free Mode", "Test without constraints")} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon icon={faRocket} className={`mode-icon ${mode === "Free" ? "active" : ""}`} />
                <span className="mode-label">Free</span>
              </div>
              <div className="mode-item" onClick={() => handleModeChange("Step by Step")} onMouseEnter={() => handleMouseEnter("Step by Step Mode", "Guided learning")} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon icon={faStepForward} className={`mode-icon ${mode === "Step by Step" ? "active" : ""}`} />
                <span className="mode-label">Step by Step</span>
              </div>
              <div className="mode-item" onClick={() => handleModeChange("Game")} onMouseEnter={() => handleMouseEnter("Game Mode", "Learn through challenges")} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon icon={faGamepad} className={`mode-icon ${mode === "Game" ? "active" : ""}`} />
                <span className="mode-label">Game</span>
              </div>
            </div>
          </div>
          {mode !== "Free" && (
            <div className="objective-wrapper" style={{ backgroundColor: "red" }}></div>
          )}
          <CNCScene depth={depth} params={params} />
          {instructions.length > 0 && (
            <div className="instructions-panel">
              <h3>Instructions</h3>
              <p>{instructions[currentStep]}</p>
              <div className="instructions-buttons">
                <button onClick={handlePreviousStep} disabled={currentStep === 0}>Previous</button>
                <button onClick={handleNextStep} disabled={currentStep === instructions.length - 1}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="sidebar">
        <div className="parameters-panel">
          <CNCParametersPanel onUpdate={(newParams) => setParams(newParams)} setHelpText={handleSetHelpText} language={language} key={language} />
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
      {showStepModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Step by Step Mode</h2>
            <p>This mode will guide you through the process step by step.</p>
            <h3>Operations:</h3>
            <div className="operations-grid">
              <button className="operation-button" onClick={() => handleOperationSelect("Profile")}>Profile</button>
              <button className="operation-button" onClick={() => handleOperationSelect("Pocket")}>Pocket</button>
              <button className="operation-button" onClick={() => handleOperationSelect("Drill")}>Drill</button>
              <button className="operation-button" onClick={() => handleOperationSelect("Parallel")}>Parallel</button>
            </div>
            <button onClick={() => setShowStepModal(false)}>Close</button>
          </div>
        </div>
      )}
      {showGameModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Game Mode</h2>
            <p>This mode will help you learn through challenges and missions.</p>
            <h3>Operations:</h3>
            <div className="operations-grid">
              <button className="operation-button" onClick={() => handleOperationSelect("Profile")}>Profile</button>
              <button className="operation-button" onClick={() => handleOperationSelect("Pocket")}>Pocket</button>
              <button className="operation-button" onClick={() => handleOperationSelect("Drill")}>Drill</button>
              <button className="operation-button" onClick={() => handleOperationSelect("Parallel")}>Parallel</button>
            </div>
            <button onClick={() => setShowGameModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
