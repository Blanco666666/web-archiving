// ThesisDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Typography, Button } from 'antd';
import axios from 'axios';

const { Title, Paragraph } = Typography;

export default function ThesisDetails() {
    const { id } = useParams();
    const [thesis, setThesis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchThesisDetails();
    }, []);

    const fetchThesisDetails = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/theses/${id}`);
            setThesis(data);
        } catch (error) {
            console.error("Error fetching thesis details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading thesis details...</p>;

    if (!thesis) return <p>Thesis not found</p>;

    return (
        <div className="container">
            <Card style={{ width: '100%', marginTop: 16 }}>
                <Title level={2}>{thesis.title}</Title>
                <Paragraph><strong>Author:</strong> {thesis.author_name}</Paragraph>
                <Paragraph><strong>Submission Date:</strong> {new Date(thesis.submission_date).toLocaleDateString()}</Paragraph>
                <Paragraph><strong>Number of Pages:</strong> {thesis.number_of_pages}</Paragraph>
                <Title level={4}>Abstract</Title>
                <Paragraph>{thesis.abstract}</Paragraph>
                <Link to="/theses">
                    <Button type="primary">Back to List</Button>
                </Link>
            </Card>
        </div>
    );
}
