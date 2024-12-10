import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Typography, Space, Drawer, Select, Spin, Table, Input, Checkbox } from 'antd';
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const hasEditPermission = ['admin', 'superadmin'].includes(userRole);

    const showDownloadModal = () => {
        setIsModalVisible(true);
    };
    
    const [departments, setDepartments] = useState([
        "Computer Science",
        "Business Administration",
        "Arts and Science Program",
        "Nursing Program",
        "Criminal Justice Education Program",
        "Accountancy Program",
        "Teachers Education Program",
        "Engineering and Technology Program",
    ]);

    const handleDepartmentChange = (value) => {
        setSelectedDepartment(value);
        fetchTheses(query, selectedYears, showPending ? 'pending' : 'approved', value);
    };
    // Fetch theses with dynamic filters (search query, years, and status)
    const fetchTheses = async (query = '', years = [], status = '', department = '') => {
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
                    status: status || 'approved',
                    department,
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

    const incrementThesisView = async (thesisId) => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/theses/${thesisId}/increment-views`
            );
    
            // Update the view count in the frontend state
            setTheses((prevTheses) =>
                prevTheses.map((thesis) =>
                    thesis.id === thesisId ? { ...thesis, views: response.data.views } : thesis
                )
            );
        } catch (error) {
            console.error('Error incrementing views:', error);
            Swal.fire({ text: 'Failed to increment views.', icon: 'error' });
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
    
        // Set the abstract file path
        const abstractFileUrl = `http://localhost:8000/storage/${encodeURIComponent(thesis.abstract_file_path)}`;
        setPdfFilePath(abstractFileUrl);
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
            link.download = `${selectedThesis?.title}_Abstract.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error('Abstract PDF file path is missing');
        }
        setIsModalVisible(false); // Close the modal
    };
    
    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    // Generate citation in different formats
    const generateCitation = (thesis, format = 'APA') => {
        // Parse and clean the author_name JSON string
        let authors = [];
        try {
            authors = JSON.parse(thesis.author_name || '[]');
        } catch (err) {
            console.error('Error parsing author_name:', err);
        }
    
        // Format authors for citation
        let formattedAuthors = 'Unknown Author';
        if (authors.length === 1) {
            formattedAuthors = authors[0];
        } else if (authors.length === 2) {
            formattedAuthors = `${authors[0]} and ${authors[1]}`;
        } else if (authors.length > 2) {
            const lastAuthor = authors.pop();
            formattedAuthors = `${authors.join(', ')}, and ${lastAuthor}`;
        }
    
        const title = thesis.title || 'Untitled Thesis';
        const year = new Date(thesis.submission_date).getFullYear() || 'Unknown Year';
    
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
    
    const [citationModalVisible, setCitationModalVisible] = useState(false);
    const [citationFormat, setCitationFormat] = useState('APA');
    const [citationText, setCitationText] = useState('');
    
    const openCitationModal = (thesis) => {
        const initialCitation = generateCitation(thesis, citationFormat);
        setCitationText(initialCitation);
        setSelectedThesis(thesis);
        setCitationModalVisible(true);
    };
    
    const handleCitationFormatChange = (format) => {
        setCitationFormat(format);
        if (selectedThesis) {
            const updatedCitation = generateCitation(selectedThesis, format);
            setCitationText(updatedCitation);
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

    const handleYearRangeChange = (range) => {
        let calculatedYears = [];
        const currentYear = new Date().getFullYear();
    
        if (range === 'past_5_years') {
            calculatedYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
        } else if (range === 'past_10_years') {
            calculatedYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
        } else if (range === 'past_20_years') {
            calculatedYears = Array.from({ length: 20 }, (_, i) => currentYear - i);
        }
    
        setSelectedYears(calculatedYears);
        fetchTheses(query, calculatedYears, showPending ? 'pending' : 'approved');
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/departments'); // Replace with your API endpoint
                if (Array.isArray(response.data)) {
                    setDepartments(response.data); // Directly assign if response is an array
                } else {
                    setDepartments(response.data.departments || []); // Adjust based on the API structure
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
                message.error('Failed to load departments.');
            }
        };
    
        fetchDepartments();
    }, []);

    



    return (
        <div className="container thesis-container">

<Space style={{ marginBottom: 16, width: '100%' }} direction="horizontal">
    <Search
        placeholder="Search for a thesis"
        value={query}
        onChange={handleSearchChange}
        style={{ width: 300 }}
    />
<Select
    placeholder="Select Department"
    value={selectedDepartment}
    onChange={handleDepartmentChange}
    style={{ width: 200 }}
>
    <Option value="">All Departments</Option>
    {departments.map((department, index) => (
        <Option key={index} value={department}>
            {department}
        </Option>
    ))}
</Select>
</Space>

<div style={{ marginBottom: 16 }}>
    <Checkbox
        onChange={(e) => handleYearRangeChange(e.target.checked ? 'past_5_years' : '')}
        checked={selectedYears.length === 5}
        style={{ marginRight: 8 }}
    >
        Past 5 Years
    </Checkbox>
    <Checkbox
        onChange={(e) => handleYearRangeChange(e.target.checked ? 'past_10_years' : '')}
        checked={selectedYears.length === 10}
        style={{ marginRight: 8 }}
    >
        Past 10 Years
    </Checkbox>
    <Checkbox
        onChange={(e) => handleYearRangeChange(e.target.checked ? 'past_20_years' : '')}
        checked={selectedYears.length === 20}
        style={{ marginRight: 8 }}
    >
        Past 20 Years
    </Checkbox>
</div>

<Table
    columns={[
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        handleViewThesis(record);
                    }}
                >
                    {text}
                </Button>
            ),
        },
        {
            title: 'Abstract',
            dataIndex: 'abstract',
            key: 'abstract',
            ellipsis: true,
        },

        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Views',
            dataIndex: 'views',
            key: 'views',
        },
        {
            title: 'Date',
            dataIndex: 'submission_date',
            key: 'submission_date',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="default"
                        onClick={() => {
                            handleViewThesis(record);
                        }}
                        icon={<CopyOutlined />}
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ]}
    dataSource={theses}
    rowKey="id"
    loading={loading}
    pagination={{ pageSize: 10 }}
/>

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
                            <Text strong>Date:</Text> {new Date(selectedThesis.submission_date).toLocaleDateString() || 'N/A'}
                        </p>

                        <Button
    type="default"
    onClick={() => openCitationModal(selectedThesis)}
    icon={<CopyOutlined />}
>
    Generate Citation
</Button>

                        <Modal
    title="Generate Citation"
    visible={citationModalVisible}
    onCancel={() => setCitationModalVisible(false)}
    footer={null}
>
    <Space direction="vertical" style={{ width: '100%' }}>
        <Select
            value={citationFormat}
            onChange={handleCitationFormatChange}
            style={{ width: '100%' }}
        >
            <Option value="APA">APA (7th Edition)</Option>
            <Option value="MLA">MLA</Option>
            <Option value="Chicago">Chicago</Option>
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
        onClick={() => {
            Swal.fire({
                text: 'Citation copied to clipboard!',
                icon: 'success',
            });
            navigator.clipboard.writeText(citationText);
        }}
    >
        Copy to Clipboard
    </Button>
</Modal>

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
    onClick={() => setIsModalVisible(true)}
    icon={<DownloadOutlined />}
    style={{ marginLeft: 16 }}
>
    View PDF
</Button>
<Modal
    title="View PDF"
    visible={isModalVisible}
    onCancel={() => setIsModalVisible(false)}
    footer={null}
    width="80%" // Adjust width as needed
>
    {pdfFilePath ? (
        <iframe
            src={pdfFilePath}
            title="PDF Viewer"
            width="100%"
            height="600px" // Adjust height as needed
            style={{ border: 'none' }}
        />
    ) : (
        <p>No PDF file available.</p>
    )}
</Modal>

                    </div>
                    
                )}
            </Drawer>
        </div>
    );
}
