import React, { useState, useEffect, useRef } from 'react';
import './TestCaseGenerator.css';

const TestCaseGenerator = () => {
  const [noOfTestCases, setNoOfTestCases] = useState('');
  const [linesPerTestCase, setLinesPerTestCase] = useState(1);
  const [lines, setLines] = useState([]);
  const [generatedTestCases, setGeneratedTestCases] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    scrollToBottom();
  }, [generatedTestCases]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'noOfTestCases') {
      setNoOfTestCases(value);
    } else if (name === 'linesPerTestCase') {
      setLinesPerTestCase(value);
    }
  };

  const handleLineInputChange = (e, index, key) => {
    const { value } = e.target;
    const updatedLines = [...lines];
    updatedLines[index][key] = value;
    setLines(updatedLines);
  };

  const handleAddLine = () => {
    setLines([...lines, { lineType: 'integer', min: '', max: '', minLength: '', maxLength: '', characters: '' }]);
  };

  const handleRemoveLine = (index) => {
    const updatedLines = [...lines];
    updatedLines.splice(index, 1);
    setLines(updatedLines);
  };

  const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomString = (length, characters) => {
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  };

  const handleGenerateTestCase = () => {
    if (!noOfTestCases || !linesPerTestCase || lines.length === 0) {
      setErrorMessage('Please fill in all the required fields.');
      return;
    }

    let testCases = '';
    const linesToDisplay = lines.slice(0, linesPerTestCase);
    for (let i = 0; i < noOfTestCases; i++) {
      for (let j = 0; j < linesPerTestCase && j < linesToDisplay.length; j++) {
        const line = linesToDisplay[j];
        if (line.lineType === 'integer') {
          const { min, max } = line;
          if (!min || !max) {
            setErrorMessage('Please fill in all the required fields.');
            return;
          }
          const randomNumber = getRandomInteger(parseInt(min), parseInt(max));
          testCases += `${randomNumber} `;
        } else if (line.lineType === 'string') {
          const { minLength, maxLength, characters } = line;
          if (!minLength || !maxLength || !characters) {
            setErrorMessage('Please fill in all the required fields.');
            return;
          }
          const randomLength = getRandomInteger(parseInt(minLength), parseInt(maxLength));
          const randomString = getRandomString(randomLength, characters);
          testCases += `${randomString} `;
        }
      }
      testCases += '\n';
    }
    setGeneratedTestCases(testCases);
    setErrorMessage('');
  };

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadTestCases = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedTestCases], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'test_cases.txt';
    element.click();
  };

  return (
    <div className="container">
    <div>
      <h1>Test Case Generator</h1>

      <label htmlFor="noOfTestCases">Number of Test Cases:</label>
      <input type="number" name="noOfTestCases" value={noOfTestCases} onChange={handleInputChange} placeholder="Enter a number" />

      <label htmlFor="linesPerTestCase">Number of Lines per Test Case:</label>
      <input type="number" name="linesPerTestCase" value={linesPerTestCase} onChange={handleInputChange} placeholder="Enter a number" min="1" max="20" />

      {lines.map((line, index) => (
        <div key={index}>
          <h3>Line {index + 1}</h3>
          <label htmlFor={`lineType${index}`}>Line Type:</label>
          <select name={`lineType${index}`} value={line.lineType} onChange={(e) => handleLineInputChange(e, index, 'lineType')}>
            <option value="integer">Integer</option>
            <option value="string">String</option>
          </select>

          {line.lineType === 'integer' && (
            <>
              <label htmlFor={`min${index}`}>Min Value:</label>
              <input type="number" name={`min${index}`} value={line.min || ''} onChange={(e) => handleLineInputChange(e, index, 'min')} placeholder="Enter a number" />

              <label htmlFor={`max${index}`}>Max Value:</label>
              <input type="number" name={`max${index}`} value={line.max || ''} onChange={(e) => handleLineInputChange(e, index, 'max')} placeholder="Enter a number" />
            </>
          )}

          {line.lineType === 'string' && (
            <>
              <label htmlFor={`minLength${index}`}>Min Length:</label>
              <input type="number" name={`minLength${index}`} value={line.minLength || ''} onChange={(e) => handleLineInputChange(e, index, 'minLength')} placeholder="Enter a number" />

              <label htmlFor={`maxLength${index}`}>Max Length:</label>
              <input type="number" name={`maxLength${index}`} value={line.maxLength || ''} onChange={(e) => handleLineInputChange(e, index, 'maxLength')} placeholder="Enter a number" />

              <label htmlFor={`characters${index}`}>Characters:</label>
              <input type="text" name={`characters${index}`} value={line.characters || ''} onChange={(e) => handleLineInputChange(e, index, 'characters')} placeholder="Enter characters" />
            </>
          )}

          <button onClick={() => handleRemoveLine(index)}>Remove Line</button>
        </div>
      ))}

      {lines.length < 20 && <button onClick={handleAddLine}>Add Line</button>}

      <button onClick={handleGenerateTestCase}>Generate Test Case</button>

      {generatedTestCases && (
        <div>
          <h2 className="test-cases">Generated Test Cases:</h2>
          <pre>{generatedTestCases}</pre>
          <button className="download-button" onClick={handleDownloadTestCases} >Download Test Cases</button>
        </div>
      )}

      {errorMessage && <p>{errorMessage}</p>}

      <div ref={bottomRef}></div>
    </div>
    </div>
  );
};

export default TestCaseGenerator;
