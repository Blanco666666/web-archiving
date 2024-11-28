import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Space, Drawer, Spin, Input, Checkbox } from 'antd'; 
import { HeartOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash'; // Import debounce function

const { Title, Text } = Typography;
const { Search } = Input; // Ant Design Search Input

export default function ListTheses({ userRole }) {
    const [theses, setTheses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [pdfFilePath, setPdfFilePath] = useState('');
    const [userFavorites, setUserFavorites] = useState([]);
    const [query, setQuery] = useState('');
    const [years, setYears] = useState([]);
    const [showPending, setShowPending] = useState(false); 

    const hasEditPermission = userRole === 'admin' || userRole === 'superadmin';

    // Function to fetch theses
    const fetchTheses = async (query = '', years = [], status = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');  
            
            if (!token) {
                throw new Error('No authentication token found.');
            }
    
            const response = await axios.get('http://127.0.0.1:8000/api/theses', {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
                params: {
                    search: query,
                    years: years.join(','),
                    status: status || 'approved',
                },
            });
    
            // Check the response
            console.log('Fetched theses:', response.data); // Debugging response
            setTheses(response.data);
        } catch (error) {
            console.error('Error fetching theses:', error);
            // Handle the error gracefully
            let errorMessage = "Failed to fetch theses";
            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                errorMessage = "Network error, please check your connection";
            } else {
                errorMessage = error.message || errorMessage;
            }
            Swal.fire({ text: errorMessage, icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = debounce((searchTerm, years, status) => {
        fetchTheses(searchTerm, years, status);
    }, 500); 

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value, years, showPending ? 'pending' : 'approved'); 
    };

    const handleYearChange = (year, isChecked) => {
        const updatedYears = isChecked 
            ? [...years, year] 
            : years.filter(y => y !== year);
        setYears(updatedYears); 
        fetchTheses(query, updatedYears, showPending ? 'pending' : 'approved');
    };

    const handleStatusToggle = (checked) => {
        setShowPending(checked);  
        fetchTheses(query, years, checked ? 'pending' : 'approved'); 
    };

    useEffect(() => {
        fetchTheses(query, years, showPending ? 'pending' : 'approved');

        const savedFavorites = JSON.parse(localStorage.getItem('userFavorites')) || [];
        setUserFavorites(savedFavorites);
    }, [query, years, showPending]); 

    const handleViewThesis = (thesis) => {
        setSelectedThesis(thesis);
        const fileUrl = `http://localhost:8000/storage/${encodeURIComponent(thesis.file_path)}`;
        setPdfFilePath(fileUrl);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedThesis(null);
        setPdfFilePath('');
    };

    const handleAddToList = () => {
        if (selectedThesis && !userFavorites.some(item => item.id === selectedThesis.id)) {
            const updatedFavorites = [...userFavorites, selectedThesis];
            setUserFavorites(updatedFavorites);
            localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
            Swal.fire({ text: "Thesis added to your list", icon: "success" });
        } else {
            Swal.fire({ text: "This thesis is already in your list", icon: "info" });
        }
    };

    const handleDownloadPDF = () => {
        if (pdfFilePath) {
            const link = document.createElement('a');
            const fileUrl = new URL(pdfFilePath, window.location.origin).href;

            link.href = fileUrl;
            link.download = selectedThesis?.title + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error("PDF file path is missing");
        }
    };

    return (
        <div className="container thesis-container">
            <Search 
                placeholder="Search for a thesis" 
                value={query} 
                onChange={handleSearchChange}
                style={{ width: 300, marginBottom: 16 }} 
            />

            <div style={{ marginBottom: 16 }}>
                {['2024', '2023', '2022', '2021'].map(year => (
                    <Checkbox 
                        key={year}
                        value={year}
                        onChange={(e) => handleYearChange(year, e.target.checked)} 
                        checked={years.includes(year)} 
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
            <p><Text strong>Author:</Text> {selectedThesis.author_name || 'N/A'}</p>
            <p><Text strong>Abstract:</Text> {selectedThesis.abstract || 'No abstract available'}</p>
            <p><Text strong>Document Type:</Text> {selectedThesis.document_type || 'N/A'}</p>
            <p><Text strong>Submission Date:</Text> {new Date(selectedThesis.submission_date).toLocaleDateString() || 'N/A'}</p>

            {/* Conditionally render the Add to My List button */}
            <Button 
                type="primary" 
                onClick={handleAddToList} 
                icon={<HeartOutlined />} 
                style={{ display: userRole === 'admin' || userRole === 'superadmin' ? 'none' : 'inline-block' }}
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
