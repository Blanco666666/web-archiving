import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Space, Drawer, Spin, Input, Checkbox } from 'antd';
import { HeartOutlined, DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';

const { Title, Text } = Typography;
const { Search } = Input;

export default function ListTheses({ userRole }) {
    const [theses, setTheses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [pdfFilePath, setPdfFilePath] = useState('');
    const [userFavorites, setUserFavorites] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedYears, setSelectedYears] = useState([]);
    const [showPending, setShowPending] = useState(false);

    const hasEditPermission = ['admin', 'superadmin'].includes(userRole);

    // Fetch theses with dynamic filters (search query, years, and status)
    const fetchTheses = async (query = '', years = [], status = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found.');
            }

            const response = await axios.get('http://127.0.0.1:8000/api/theses', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    search: query,
                    years: years.join(','),
                    status: status || 'approved', // Default to approved status
                },
            });

            setTheses(response.data);
        } catch (error) {
            let errorMessage = 'Failed to fetch theses';
            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                errorMessage = 'Network error, please check your connection';
            }
            Swal.fire({ text: errorMessage, icon: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Debounced search handler
    const debouncedSearch = debounce((searchTerm, years, status) => {
        fetchTheses(searchTerm, years, status);
    }, 500);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value, selectedYears, showPending ? 'pending' : 'approved');
    };

    // Increment thesis view count
    const incrementThesisView = async (thesisId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://127.0.0.1:8000/api/theses/${thesisId}/increment-views`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTheses((prevTheses) =>
                prevTheses.map((thesis) =>
                    thesis.id === thesisId ? { ...thesis, views: response.data.views } : thesis
                )
            );
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    };

    // Handle year selection
    const handleYearChange = (year, isChecked) => {
        const updatedYears = isChecked
            ? [...selectedYears, year]
            : selectedYears.filter((y) => y !== year);
        setSelectedYears(updatedYears);
        fetchTheses(query, updatedYears, showPending ? 'pending' : 'approved');
    };

    // Handle thesis status filter (pending or approved)
    const handleStatusToggle = (checked) => {
        setShowPending(checked);
        fetchTheses(query, selectedYears, checked ? 'pending' : 'approved');
    };

    // Handle thesis selection and show details in drawer
    const handleViewThesis = (thesis) => {
        incrementThesisView(thesis.id);
        setSelectedThesis(thesis);
        const fileUrl = `http://localhost:8000/storage/${encodeURIComponent(thesis.file_path)}`;
        setPdfFilePath(fileUrl);
        setDrawerVisible(true);
    };

    // Close drawer
    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedThesis(null);
        setPdfFilePath('');
    };

    // Handle adding thesis to the user's list (favorites)
    const handleAddToList = () => {
        if (selectedThesis && !userFavorites.some((item) => item.id === selectedThesis.id)) {
            const updatedFavorites = [...userFavorites, selectedThesis];
            setUserFavorites(updatedFavorites);
            localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
            Swal.fire({ text: 'Thesis added to your list', icon: 'success' });
        } else {
            Swal.fire({ text: 'This thesis is already in your list', icon: 'info' });
        }
    };

    // Handle PDF download
    const handleDownloadPDF = () => {
        if (pdfFilePath) {
            const link = document.createElement('a');
            const fileUrl = new URL(pdfFilePath, window.location.origin).href;
            link.href = fileUrl;
            link.download = `${selectedThesis?.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error('PDF file path is missing');
        }
    };

    // Generate citation in different formats
    const generateCitation = (thesis, format = 'APA') => {
        // Parse and clean the author_name JSON string
        let authors = [];
        try {
            authors = JSON.parse(thesis.author_name || '[]'); // Parse author_name as an array
        } catch (err) {
            console.error('Error parsing author_name:', err);
        }
    
        // Format authors for citation
        let formattedAuthors = 'Unknown Author';
        if (authors.length === 1) {
            formattedAuthors = authors[0]; // Single author
        } else if (authors.length === 2) {
            formattedAuthors = `${authors[0]} and ${authors[1]}`; // Two authors
        } else if (authors.length > 2) {
            const lastAuthor = authors.pop(); // Extract the last author
            formattedAuthors = `${authors.join(', ')}, and ${lastAuthor}`; // Format for multiple authors
        }
    
        const title = thesis.title || 'Untitled Thesis';
        const year = new Date(thesis.submission_date).getFullYear() || 'Unknown Year';
    
        // Format citation based on the selected style
        switch (format) {
            case 'APA':
                return `${formattedAuthors}. (${year}). ${title}.`;
            case 'MLA':
                return `${formattedAuthors}. "${title}". ${year}.`;
            case 'Chicago':
                return `${formattedAuthors}. "${title}". ${year}.`;
            default:
                return 'Citation format not supported';
        }
    };
    // Copy citation to clipboard
    const handleCopyCitation = (citation) => {
        navigator.clipboard.writeText(citation).then(() => {
            Swal.fire({ text: 'Citation copied to clipboard!', icon: 'success' });
        }).catch((err) => {
            Swal.fire({ text: 'Failed to copy citation.', icon: 'error' });
        });
    };

    // Handle keyword click (search for keyword)
    const handleKeywordClick = (keyword) => {
        setQuery(keyword);
        fetchTheses(keyword, selectedYears, showPending ? 'pending' : 'approved');
    };

    // Load saved favorites from localStorage
    useEffect(() => {
        fetchTheses(query, selectedYears, showPending ? 'pending' : 'approved');
        const savedFavorites = JSON.parse(localStorage.getItem('userFavorites')) || [];
        setUserFavorites(savedFavorites);
    }, [query, selectedYears, showPending]);

    return (
        <div className="container thesis-container">
            <Search
                placeholder="Search for a thesis"
                value={query}
                onChange={handleSearchChange}
                style={{ width: 300, marginBottom: 16 }}
            />

            <div style={{ marginBottom: 16 }}>
                {['2024', '2023', '2022', '2021'].map((year) => (
                    <Checkbox
                        key={year}
                        value={year}
                        onChange={(e) => handleYearChange(year, e.target.checked)}
                        checked={selectedYears.includes(year)}
                        style={{ marginRight: 8 }}
                    >
                        {year}
                    </Checkbox>
                ))}
            </div>

            <Space direction="vertical" style={{ width: '100%' }}>
                {loading ? (
                    <Spin size="large" />
                ) : theses.length > 0 ? (
                    theses.map((thesis) => (
                        <Card
                            key={thesis.id}
                            title={<Title level={4}>{thesis.title}</Title>}
                            style={{ marginBottom: 16 }}
                            actions={[
                                <Button type="primary" onClick={() => handleViewThesis(thesis)}>
                                    View
                                </Button>,
                            ]}
                        >
                            <Card type="inner" title="Abstract">
                                <Text>{thesis.abstract || 'No abstract available'}</Text>
                            </Card>
                            <Card type="inner" title="Views" style={{ marginTop: 16 }}>
                                <Text>{thesis.views || 0} readers</Text>
                            </Card>
                            <Card type="inner" title="Keywords" style={{ marginTop: 16 }}>
                                <div>
                                    {thesis.keywords?.split(',').map((keyword, index) => (
                                        <Button
                                            key={index}
                                            type="link"
                                            onClick={() => handleKeywordClick(keyword.trim())}
                                        >
                                            {keyword.trim()}
                                        </Button>
                                    ))}
                                </div>
                            </Card>
                            <Card type="inner" title="Submission Date" style={{ marginTop: 16 }}>
                                <Text>{new Date(thesis.submission_date).toLocaleDateString() || 'N/A'}</Text>
                            </Card>
                        </Card>
                    ))
                ) : (
                    <div className="text-center">
                        <p>No theses available</p>
                    </div>
                )}
            </Space>

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
                            <Text strong>Submission Date:</Text> {new Date(selectedThesis.submission_date).toLocaleDateString() || 'N/A'}
                        </p>

                        <Button
    type="default"
    onClick={() => handleCopyCitation(generateCitation(selectedThesis, 'APA'))}
    icon={<CopyOutlined />}
>
    Copy APA Citation
</Button>

<Button
    type="default"
    onClick={() => handleCopyCitation(generateCitation(selectedThesis, 'MLA'))}
    icon={<CopyOutlined />}
    style={{ marginLeft: 16 }}
>
    Copy MLA Citation
</Button>

<Button
    type="default"
    onClick={() => handleCopyCitation(generateCitation(selectedThesis, 'Chicago'))}
    icon={<CopyOutlined />}
    style={{ marginLeft: 16 }}
>
    Copy Chicago Citation
</Button>

                        <Button
                            type="primary"
                            onClick={handleAddToList}
                            icon={<HeartOutlined />}
                            style={{
                                display: hasEditPermission ? 'none' : 'inline-block',
                            }}
                        >
                            Add to My List
                        </Button>

                        <Button
                            type="default"
                            onClick={handleDownloadPDF}
                            icon={<DownloadOutlined />}
                            style={{ marginLeft: 16 }}
                        >
                            Download PDF
                        </Button>
                    </div>
                )}
            </Drawer>
        </div>
    );
}
