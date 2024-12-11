import React, { useState, useEffect } from 'react';
import { List, Card, Button, Drawer, Typography, notification, Modal, Input, Select, Space } from 'antd';
import { CopyOutlined, HeartOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MyList = () => {
    const [theses, setTheses] = useState([]);
    const [filteredTheses, setFilteredTheses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [pdfFilePath, setPdfFilePath] = useState('');
    const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
    const [isCitationModalVisible, setIsCitationModalVisible] = useState(false);
    const [citationFormat, setCitationFormat] = useState('APA');
    const [citationText, setCitationText] = useState('');

    useEffect(() => {
        // Load the saved favorites from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('userFavorites')) || [];
        setTheses(savedFavorites);
        setFilteredTheses(savedFavorites);
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = theses.filter(
            (thesis) =>
                thesis.title.toLowerCase().includes(query) ||
                (thesis.abstract && thesis.abstract.toLowerCase().includes(query))
        );
        setFilteredTheses(filtered);
    };

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

    const openPdfModal = () => {
        setIsPdfModalVisible(true);
    };

    const closePdfModal = () => {
        setIsPdfModalVisible(false);
    };

    const generateCitation = (thesis, format = 'APA') => {
        const authors = thesis.author_name || 'Unknown Author';
        const title = thesis.title || 'Untitled Thesis';
        const year = new Date(thesis.submission_date).getFullYear() || 'Unknown Year';

        switch (format) {
            case 'APA':
                return `${authors}. (${year}). ${title}.`;
            case 'MLA':
                return `${authors}. "${title}". ${year}.`;
            case 'Chicago':
                return `${authors}. "${title}". ${year}.`;
            default:
                return 'Citation format not supported.';
        }
    };

    const openCitationModal = (thesis) => {
        const initialCitation = generateCitation(thesis, citationFormat);
        setCitationText(initialCitation);
        setSelectedThesis(thesis);
        setIsCitationModalVisible(true);
    };

    const handleCitationFormatChange = (format) => {
        setCitationFormat(format);
        if (selectedThesis) {
            const updatedCitation = generateCitation(selectedThesis, format);
            setCitationText(updatedCitation);
        }
    };

    const handleCopyCitation = (citation) => {
        navigator.clipboard.writeText(citation).then(() => {
            notification.success({
                message: 'Citation Copied',
                description: 'The citation has been copied to your clipboard.',
            });
        });
    };

    const handleRemoveThesis = (thesis) => {
        Modal.confirm({
            title: 'Are you sure you want to remove this thesis?',
            content: `Title: ${thesis.title}`,
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                const updatedTheses = theses.filter((item) => item !== thesis);
                setTheses(updatedTheses);
                setFilteredTheses(updatedTheses);
                localStorage.setItem('userFavorites', JSON.stringify(updatedTheses));
                notification.success({
                    message: 'Thesis Removed',
                    description: 'The thesis has been removed from your list.',
                });
            },
        });
    };

    return (
        <div style={{ maxWidth: 800, margin: 'auto' }}>
            <Card title="My List">
                <Input
                    placeholder="Search Thesis..."
                    prefix={<SearchOutlined />}
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ marginBottom: 16 }}
                />
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={filteredTheses}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                title={item.title}
                                extra={
                                    <>
                                        <Button type="link" onClick={() => handleViewDetails(item)}>
                                            View Details
                                        </Button>
                                        <Button type="link" danger onClick={() => handleRemoveThesis(item)}>
                                            Remove
                                        </Button>
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
                        <p>
                            <Text strong>Author:</Text> {selectedThesis.author_name || 'N/A'}
                        </p>
                        <p>
                            <Text strong>Abstract:</Text> {selectedThesis.abstract || 'No abstract available'}
                        </p>
                        <p>
                            <Text strong>Document Type:</Text> {selectedThesis.document_type || 'N/A'}
                        </p>
                        <p>
                            <Text strong>Submission Date:</Text>{' '}
                            {new Date(selectedThesis.submission_date).toLocaleDateString() || 'N/A'}
                        </p>

                        {/* Citation Buttons */}
                        <Button
                            type="default"
                            onClick={() => openCitationModal(selectedThesis)}
                            icon={<CopyOutlined />}
                        >
                            Generate Citation
                        </Button>

                        <Button
                            type="default"
                            onClick={openPdfModal}
                            icon={<DownloadOutlined />}
                            style={{ marginLeft: 16 }}
                        >
                            View PDF
                        </Button>
                    </div>
                )}
            </Drawer>

            {/* Modal for PDF Viewer */}
            <Modal
                title="View PDF"
                visible={isPdfModalVisible}
                onCancel={closePdfModal}
                footer={null}
                width="80%"
            >
                {pdfFilePath ? (
                    <iframe
                        src={pdfFilePath}
                        title="PDF Viewer"
                        width="100%"
                        height="600px"
                        style={{ border: 'none' }}
                    />
                ) : (
                    <p>No PDF file available.</p>
                )}
            </Modal>

            {/* Citation Modal */}
            <Modal
                title="Generate Citation"
                visible={isCitationModalVisible}
                onCancel={() => setIsCitationModalVisible(false)}
                footer={null}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Select
                        value={citationFormat}
                        onChange={handleCitationFormatChange}
                        style={{ width: '100%' }}
                    >
                        <Select.Option value="APA">APA (7th Edition)</Select.Option>
                        <Select.Option value="MLA">MLA</Select.Option>
                        <Select.Option value="Chicago">Chicago</Select.Option>
                    </Select>
                    <Input.TextArea
                        rows={5}
                        value={citationText}
                        onChange={(e) => setCitationText(e.target.value)}
                    />
                </Space>
                <Button
                    type="primary"
                    style={{ marginTop: '10px' }}
                    onClick={() => handleCopyCitation(citationText)}
                >
                    Copy to Clipboard
                </Button>
            </Modal>
        </div>
    );
};

export default MyList;