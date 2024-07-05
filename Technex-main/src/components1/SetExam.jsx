import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Input, Pagination, Checkbox } from "semantic-ui-react";

const SetExam = () => {
  const [aptitudeQuestions, setAptitudeQuestions] = useState([]);
  const [verbalQuestions, setVerbalQuestions] = useState([]);
  const [technicalQuestions, setTechnicalQuestions] = useState([]);
  const [selectedTechnicalQuestions, setSelectedTechnicalQuestions] = useState(
    []
  );
  const [testName, setTestName] = useState("");
  const [selectedVerbalQuestions, setSelectedVerbalQuestions] = useState([]);
  const [selectedAptitudeQuestions, setSelectedAptitudeQuestions] = useState(
    []
  );
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchId, setSearchId] = useState("");
  const [searchQuestion, setSearchQuestion] = useState("");
  const [searchTopic, setSearchTopic] = useState("");
  const [searchDifficulty, setSearchDifficulty] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [activeTab, setActiveTab] = useState("technical");

  useEffect(() => {
    const fetchDatabase = () => {
      axios
        .get("http://localhost:5000/get_aptitude_questions")
        .then((response) => setAptitudeQuestions(response.data));

      axios
        .get("http://localhost:5000/get_technical_questions")
        .then((response) => {
          setTechnicalQuestions(response.data);
          setDisplayedQuestions(response.data);
        });
      axios
        .get("http://localhost:5000/get_verbal_questions")
        .then((response) => setVerbalQuestions(response.data));
    };
    fetchDatabase();
  }, []);

  useEffect(() => {
    switch (activeTab) {
      case "aptitude":
        setDisplayedQuestions(aptitudeQuestions);
        break;
      case "verbal":
        setDisplayedQuestions(verbalQuestions);
        break;
      default:
        setDisplayedQuestions(technicalQuestions);
    }
    setCurrentPage(1); // Reset to first page on tab switch
  }, [activeTab, aptitudeQuestions, verbalQuestions, technicalQuestions]);

  const handleSearch = (event, setSearch) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredQuestions = displayedQuestions.filter((question) => {
    if (!question) return false; // skip null or undefined questions
    const idMatch = question.id.toString().includes(searchId);
    const questionMatch =
      question.question &&
      question.question.toLowerCase().includes(searchQuestion.toLowerCase());
    const topicMatch =
      question.topic &&
      question.topic.toLowerCase().includes(searchTopic.toLowerCase());
    const difficultyMatch =
      question.difficulty &&
      question.difficulty
        .toLowerCase()
        .includes(searchDifficulty.toLowerCase());
    const companyMatch =
      question.company &&
      question.company.toLowerCase().includes(searchCompany.toLowerCase());
    return (
      idMatch && questionMatch && topicMatch && difficultyMatch && companyMatch
    );
  });

  // const filteredQuestions = displayedQuestions.filter((question) => {
  //   const idMatch = question.id.toString().includes(searchId);
  //   const questionMatch = question.question
  //     .toLowerCase()
  //     .includes(searchQuestion.toLowerCase());
  //   const topicMatch = question.topic
  //     .toLowerCase()
  //     .includes(searchTopic.toLowerCase());
  //   const difficultyMatch = question.difficulty
  //     .toLowerCase()
  //     .includes(searchDifficulty.toLowerCase());
  //   const companyMatch = question.company
  //     .toLowerCase()
  //     .includes(searchCompany.toLowerCase());
  //   return (
  //     idMatch && questionMatch && topicMatch && difficultyMatch && companyMatch
  //   );
  // });

  const questionsPerPage = 10;
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const displayedPageQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handleCheckboxChange = (question) => {
    let setSelectedQuestions;
    let selectedQuestions;
    if (activeTab === "technical") {
      setSelectedQuestions = setSelectedTechnicalQuestions;
      selectedQuestions = selectedTechnicalQuestions;
    } else if (activeTab === "verbal") {
      setSelectedQuestions = setSelectedVerbalQuestions;
      selectedQuestions = selectedVerbalQuestions;
    } else {
      setSelectedQuestions = setSelectedAptitudeQuestions;
      selectedQuestions = selectedAptitudeQuestions;
    }
    setSelectedQuestions((prev) => {
      if (prev.some((q) => q.id === question.id)) {
        return prev.filter((q) => q.id !== question.id);
      } else {
        return [...prev, question];
      }
    });
  };

  const handleRemoveSelected = (id, tab) => {
    if (tab === "technical") {
      setSelectedTechnicalQuestions((prev) => prev.filter((q) => q.id !== id));
    } else if (tab === "verbal") {
      setSelectedVerbalQuestions((prev) => prev.filter((q) => q.id !== id));
    } else {
      setSelectedAptitudeQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleSubmit = () => {
    const allSelectedQuestions = [
      ...selectedTechnicalQuestions,
      ...selectedVerbalQuestions,
      ...selectedAptitudeQuestions,
    ];
    console.log(allSelectedQuestions);
    console.log(testName);
  };

  const selectedQuestions =
    activeTab === "technical"
      ? selectedTechnicalQuestions
      : activeTab === "verbal"
      ? selectedVerbalQuestions
      : selectedAptitudeQuestions;

  return (
    <div>
      <div>
        <Button onClick={() => setActiveTab("technical")}>Technical</Button>
        <Button onClick={() => setActiveTab("verbal")}>Verbal</Button>
        <Button onClick={() => setActiveTab("aptitude")}>Aptitude</Button>
      </div>
      <div>
        <Input
          icon="search"
          placeholder="Search ID"
          value={searchId}
          onChange={(e) => handleSearch(e, setSearchId)}
        />
        <Input
          icon="search"
          placeholder="Search Question"
          value={searchQuestion}
          onChange={(e) => handleSearch(e, setSearchQuestion)}
        />
        <Input
          icon="search"
          placeholder="Search Topic"
          value={searchTopic}
          onChange={(e) => handleSearch(e, setSearchTopic)}
        />
        <Input
          icon="search"
          placeholder="Search Difficulty"
          value={searchDifficulty}
          onChange={(e) => handleSearch(e, setSearchDifficulty)}
        />
        <Input
          icon="search"
          placeholder="Search Company"
          value={searchCompany}
          onChange={(e) => handleSearch(e, setSearchCompany)}
        />
      </div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Question</Table.HeaderCell>
            <Table.HeaderCell>Options</Table.HeaderCell>
            <Table.HeaderCell>Answer</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Topic</Table.HeaderCell>
            <Table.HeaderCell>Difficulty</Table.HeaderCell>
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Select</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {displayedPageQuestions.map((question) => (
            <Table.Row key={question.id}>
              <Table.Cell>{question.id}</Table.Cell>
              <Table.Cell>{question.question}</Table.Cell>
              <Table.Cell>
                {question.options && question.options.join(", ")}
              </Table.Cell>
              <Table.Cell>
                {question.answer && question.answer.join(", ")}
              </Table.Cell>
              <Table.Cell>{question.type}</Table.Cell>
              <Table.Cell>{question.topic}</Table.Cell>
              <Table.Cell>{question.difficulty}</Table.Cell>
              <Table.Cell>{question.company}</Table.Cell>
              <Table.Cell>
                <Checkbox
                  checked={selectedQuestions.some((q) => q.id === question.id)}
                  onChange={() => handleCheckboxChange(question)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        totalPages={totalPages}
        activePage={currentPage}
        onPageChange={(e, { activePage }) => setCurrentPage(activePage)}
      />
      <h3>Selected Questions</h3>
      <span>Test Name: </span>
      <input
        type="text"
        name=""
        id=""
        placeholder="Test Name"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
      />
      <ul>
        {selectedTechnicalQuestions.map((question) => (
          <li key={question.id}>
            {question.question} (Technical)
            <Button
              onClick={() => handleRemoveSelected(question.id, "technical")}
            >
              Remove
            </Button>
          </li>
        ))}
        {selectedVerbalQuestions.map((question) => (
          <li key={question.id}>
            {question.question} (Verbal)
            <Button onClick={() => handleRemoveSelected(question.id, "verbal")}>
              Remove
            </Button>
          </li>
        ))}
        {selectedAptitudeQuestions.map((question) => (
          <li key={question.id}>
            {question.question} (Aptitude)
            <Button
              onClick={() => handleRemoveSelected(question.id, "aptitude")}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default SetExam;
