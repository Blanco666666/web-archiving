import React, { useState } from 'react';
import { Input, Checkbox, List, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const yearOptions = [2019, 2020, 2021, 2022, 2023, 2024];

const SearchBar = ({ theses, onThesisSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTheses, setFilteredTheses] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);

    // Handle search input change
    const handleInputChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchTerm(query);
        filterTheses(query, selectedYears);
    };

    // Filter theses based on search query and selected years
    const filterTheses = (query, years) => {
        // Reset if no filters are applied
        if (!query && years.length === 0) {
            setFilteredTheses([]);
            return;
        }

        let filtered = theses.filter((thesis) =>
            thesis.title.toLowerCase().includes(query) ||
            thesis.abstract.toLowerCase().includes(query) ||
            (thesis.author_name && thesis.author_name.toLowerCase().includes(query))
        );

        // Further filter by selected years if any are chosen
        if (years.length > 0) {
            filtered = filtered.filter((thesis) =>
                years.includes(new Date(thesis.submission_date).getFullYear())
            );
        }

        setFilteredTheses(filtered);
    };

    // Handle thesis selection
    const handleSelect = (thesis) => {
        setSearchTerm(thesis.title);  // Update search bar to selected thesis title
        setFilteredTheses([]);  // Clear the filtered list after selection
        onThesisSelect(thesis);  // Trigger drawer with selected thesis
    };

    // Update filtered theses when year checkboxes change
    const handleYearChange = (years) => {
        setSelectedYears(years);
        filterTheses(searchTerm, years);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px' }}>
            <Input
                placeholder="Search Thesis (title, abstract, author)"
                value={searchTerm}
                onChange={handleInputChange}
                prefix={<SearchOutlined />}
                allowClear
            />

            {/* Year Filter Checkboxes */}
            <div style={{ marginTop: '10px' }}>
                <Checkbox.Group
                    options={yearOptions.map((year) => ({ label: year, value: year }))}
                    value={selectedYears}
                    onChange={handleYearChange}
                    style={{ display: 'flex', flexWrap: 'wrap' }}
                />
            </div>

            {/* Display filtered theses */}
            {filteredTheses.length > 0 ? (
                <List
                    style={{ marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}
                    bordered
                    dataSource={filteredTheses}
                    renderItem={(thesis) => (
                        <List.Item
                            key={thesis.id}
                            onClick={() => handleSelect(thesis)}
                            style={{ cursor: 'pointer' }}
                        >
                            {thesis.title} by {thesis.author_name}
                        </List.Item>
                    )}
                />
            ) : (
                searchTerm && (
                    <Empty description="No theses found" style={{ marginTop: '10px' }} />
                )
            )}
        </div>
    );
};

export default SearchBar;
