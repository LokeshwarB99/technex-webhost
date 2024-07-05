import React, { useState } from "react";
import Navbar1 from "./Navbar1";
import axios from "axios";

const Uploadquestions = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [answers, setAnswers] = useState([""]);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === "select") {
      setAnswers(["", "", "", ""]); // initialize 4 empty answers for multiple select
    } else {
      setAnswers([""]); // initialize with a single empty answer for other types
    }
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  const quesType = (type) => {
    if (type === "fill") {
      return "Fill Up";
    }
    if (type === "select") {
      return "Multiple Select";
    }
    return "Multiple Choice";
  };

  const handleSave = async (apiEndpoint) => {
    const questionData = {
      question: document.getElementsByName("ques")[0].value,
      options:
        selectedOption !== "fill"
          ? [
              document.getElementsByName("opt1")[0].value,
              document.getElementsByName("opt2")[0].value,
              document.getElementsByName("opt3")[0].value,
              document.getElementsByName("opt4")[0].value,
            ]
          : null,
      type: quesType(selectedOption),
      topic: document.getElementsByName("topic")[0].value,
      difficulty: document.getElementsByName("diff")[0].value,
      company: document.getElementsByName("company")[0].value,
      answer:
        selectedOption === "select"
          ? [
              document.getElementsByName("ans1")[0].value,
              document.getElementsByName("ans2")[0].value,
              document.getElementsByName("ans3")[0].value,
              document.getElementsByName("ans4")[0].value,
            ]
          : [document.getElementsByName("ans")[0].value], // This line was causing the issue
    };

    // Construct FormData object
    const formData = new FormData();
    formData.append("question", JSON.stringify(questionData));

    // Append image if selected
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await axios.post(
        `https://tech-back-sgqm.onrender.com/${apiEndpoint}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Data posted successfully:", response.data);
    } catch (error) {
      alert("Error posting data:", error);
    }
  };

  const handleSaveAndAddAnother = (apiEndpoint) => {
    handleSave(apiEndpoint);
    window.location.reload();
  };

  return (
    <div>
      <Navbar1 />
      <h1 style={{ marginTop: "20px", fontWeight: "500", textAlign: "center" }}>
        Hey admins, Upload up your questions
      </h1>

      <div className="container">
        <label className="label" htmlFor="type">
          Question type
        </label>
        <select
          className="select-field"
          name="type"
          onChange={handleChange}
          value={selectedOption}
        >
          <option value="">--Question type--</option>
          <option value="choice">Multiple choice</option>
          <option value="select">Multiple select</option>
          <option value="fill">Fill up's</option>
        </select>

        <label className="label" htmlFor="question">
          Question:
        </label>
        <textarea
          className="textarea-field"
          placeholder="Enter your question here"
          name="ques"
        />

        <label className="label" htmlFor="topic">
          Topic:
        </label>
        <input
          className="input-field"
          type="text"
          placeholder="Topic"
          name="topic"
        />

        <label className="label" htmlFor="difficulty">
          Difficulty:
        </label>
        <input
          className="input-field"
          type="text"
          placeholder="Difficulty"
          name="diff"
        />

        <label className="label" htmlFor="company">
          Company:
        </label>
        <input
          className="input-field"
          type="text"
          placeholder="Company"
          name="company"
        />

        {(selectedOption === "choice" || selectedOption === "select") && (
          <>
            <div className="opt">
              <label className="label" htmlFor="option1">
                Option 1:
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="option 1 ??"
                name="opt1"
              />

              <label className="label" htmlFor="option2">
                Option 2:
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="option 2 ??"
                name="opt2"
              />

              <label className="label" htmlFor="option3">
                Option 3:
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="option 3 ??"
                name="opt3"
              />

              <label className="label" htmlFor="option4">
                Option 4:
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="option 4 ??"
                name="opt4"
              />
            </div>
          </>
        )}

        {(selectedOption === "choice" || selectedOption === "fill") && (
          <div>
            <label className="label" htmlFor="answer">
              Answer is:
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="Answer"
              value={answers[0]}
              onChange={(e) => handleAnswerChange(e, 0)}
              name="ans"
            />
          </div>
        )}

        {selectedOption === "select" && (
          <div>
            <label className="label" htmlFor="answers">
              Answers:
            </label>
            {answers.map((answer, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  className="input-field"
                  type="text"
                  placeholder={`Answer ${index + 1}`}
                  value={answer}
                  onChange={(e) => handleAnswerChange(e, index)}
                  name={`ans${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}

        <label className="label" htmlFor="image">
          Upload Image:
        </label>
        <input type="file" onChange={handleImageChange} />

        <button
          className="button1"
          style={{ marginLeft: "20px" }}
          onClick={() => handleSave("api/tech_questions")}
        >
          Save to Tech Questions
        </button>
        <button
          className="button1"
          style={{ marginLeft: "20px", width: "220px" }}
          onClick={() => handleSaveAndAddAnother("api/tech_questions")}
        >
          Save & Add Another to Tech
        </button>
        <button
          className="button1"
          style={{ marginLeft: "20px" }}
          onClick={() => handleSave("api/verb_questions")}
        >
          Save to Verb Questions
        </button>
        <button
          className="button1"
          style={{ marginLeft: "20px", width: "220px" }}
          onClick={() => handleSaveAndAddAnother("api/verb_questions")}
        >
          Save & Add Another to Verb
        </button>
        <button
          className="button1"
          style={{ marginLeft: "20px" }}
          onClick={() => handleSave("api/apt_questions")}
        >
          Save to Apt Questions
        </button>
        <button
          className="button1"
          style={{ marginLeft: "20px", width: "220px" }}
          onClick={() => handleSaveAndAddAnother("api/apt_questions")}
        >
          Save & Add Another to Apt
        </button>
      </div>
    </div>
  );
};

export default Uploadquestions;
