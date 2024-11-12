import React, { useEffect, useState } from 'react';
import { List, Card, Button, Drawer, Typography, notification } from 'antd';

const { Title, Text } = Typography;

const MyList = () => {
    const [theses, setTheses] = useState([]);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [pdfFilePath, setPdfFilePath] = useState('');

    useEffect(() => {
        // Load the saved favorites from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('userFavorites')) || [];
        setTheses(savedFavorites);
    }, []);

    const handleViewDetails = (thesis) => {
        setSelectedThesis(thesis);
        setPdfFilePath(`http://localhost:8000/storage/${thesis.file_path}`);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedThesis(null);
        setPdfFilePath('');
    };

    const handleRemoveFromList = (id) => {
        const updatedTheses = theses.filter(thesis => thesis.id !== id);
        setTheses(updatedTheses);
        localStorage.setItem('userFavorites', JSON.stringify(updatedTheses));

        notification.success({
            message: "Removed",
            description: "The thesis has been removed from your list.",
        });
    };

    const handleViewPDF = () => {
        if (pdfFilePath) {
            window.open(pdfFilePath, '_blank');
        } else {
            notification.error({
                message: "File Not Found",
                description: "The PDF file is not available.",
            });
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: 'auto' }}>
            <Card title="My List">
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={theses}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                title={item.title}
                                extra={
                                    <>
                                        <Button type="link" onClick={() => handleViewDetails(item)}>View Details</Button>
                                        <Button type="link" danger onClick={() => handleRemoveFromList(item.id)}>Remove</Button>
                                    </>
                                }
                            >
                                <p>{item.abstract}</p>
                            </Card>
                        </List.Item>
                    )}
                />
            </Card>

            {/* Drawer for viewing thesis details */}
            <Drawer
                title="Thesis Details"
                placement="right"
                onClose={closeDrawer}
                open={drawerVisible}
                width={720}
            >
                {selectedThesis && (
                    <div>
                        <Title level={4}>{selectedThesis.title}</Title>
                        <p><Text strong>Author:</Text> {selectedThesis.author_name || 'N/A'}</p>
                        <p><Text strong>Abstract:</Text> {selectedThesis.abstract}</p>
                        <p><Text strong>Document Type:</Text> {selectedThesis.document_type || 'N/A'}</p>
                        <p><Text strong>Submission Date:</Text> {new Date(selectedThesis.submission_date).toLocaleDateString()}</p>

                        <Button 
                            type="primary" 
                            onClick={handleViewPDF} 
                            style={{ marginTop: 20 }}
                        >
                            View PDF
                        </Button>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default MyList;
