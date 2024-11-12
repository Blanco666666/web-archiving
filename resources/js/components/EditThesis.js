import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditThesis() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get thesis ID from URL params

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [file, setFile] = useState(null);
  const [submissionDate, setSubmissionDate] = useState("");
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false); // Loading state for button

  useEffect(() => {
    fetchThesis();
  }, []);

  const fetchThesis = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/theses/${id}`);
      const { title, abstract, submission_date } = data.thesis;
      setTitle(title);
      setAbstract(abstract);
      setSubmissionDate(submission_date || ""); // Ensure a default value
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch thesis details";
      Swal.fire({
        text: message,
        icon: "error"
      });
    }
  };

  const changeFileHandler = (event) => {
    setFile(event.target.files[0]);
  };

  const updateThesis = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state

    const formData = new FormData();
    formData.append('_method', 'PATCH'); // Laravel PATCH method handling
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('submission_date', submissionDate);
    if (file !== null) {
      formData.append('file_path', file); // Ensure this key matches your API
    }

    try {
      const { data } = await axios.post(`http://localhost:8000/api/theses/${id}`, formData);
      Swal.fire({
        icon: "success",
        text: data.message
      });
      navigate("/"); // Redirect after successful update
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setValidationError(error.response.data.errors);
        } else {
          const message = error.response.data.message || "An error occurred";
          Swal.fire({
            text: message,
            icon: "error"
          });
        }
      } else {
        Swal.fire({
          text: "Network error. Please try again later.",
          icon: "error"
        });
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Update Thesis</h4>
              <hr />
              <div className="form-wrapper">
                {Object.keys(validationError).length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {Object.entries(validationError).map(([key, value]) => (
                            <li key={key}>{value.join(', ')}</li> // Join array of errors
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <Form onSubmit={updateThesis}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                          required // Optional, depending on your validation needs
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Abstract">
                        <Form.Label>Abstract</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={abstract}
                          onChange={(event) => setAbstract(event.target.value)}
                          required // Optional, depending on your validation needs
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="SubmissionDate">
                        <Form.Label>Submission Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={submissionDate}
                          onChange={(event) => setSubmissionDate(event.target.value)}
                          required // Optional, depending on your validation needs
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="File" className="mb-3">
                        <Form.Label>Upload New Thesis (Optional)</Form.Label>
                        <Form.Control type="file" onChange={changeFileHandler} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button 
                    variant="primary" 
                    className="mt-2" 
                    size="lg" 
                    block="block" 
                    type="submit"
                    disabled={loading} // Disable while loading
                  >
                    {loading ? "Updating..." : "Update"}
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
