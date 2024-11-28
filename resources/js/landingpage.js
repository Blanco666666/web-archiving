import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import Footer from './layout/footer';
import Header from './layout/header';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        document.title = 'Father Saturnino Urios University';
    }, []);

    useEffect(() => {
        AOS.init({ duration: 1200 });

        const handleScroll = () => {
            setIsVisible(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            <Header />
            <section className="hero bg-light text-black text-center py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} data-aos="fade-right">
                            <h1>Welcome to Father Saturnino Urios University</h1>
                            <p className="lead">
                                Empowering students since 1901 to achieve excellence in education, innovation, and leadership.
                            </p>
                            <Link to="/register">
                                <Button variant="primary" className="me-3">Get Started</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="primary">Log In</Button>
                            </Link>
                        </Col>
                        <Col md={6} xs={6} data-aos="fade-left">
                            <Image
                                src="https://www.urios.edu.ph/wp-content/uploads/2020/09/fsuu-logo.png"
                                alt="FSUU Logo"
                                fluid
                            />
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="my-5">
                <Row>
                    <Col xs={12} sm={6} md={4} lg={3} data-aos="fade-up">
                        <Card className="mb-4">
                            <Card.Img
                                variant="top"
                                src="https://www.urios.edu.ph/wp-content/uploads/2020/09/campus.jpg"
                                alt="FSUU Campus"
                            />
                            <Card.Body>
                                <Card.Title>State-of-the-Art Campus</Card.Title>
                                <Card.Text>Experience modern facilities for an enhanced learning journey.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} sm={6} md={4} lg={3} data-aos="fade-up">
                        <Card className="mb-4">
                            <Card.Img
                                variant="top"
                                src="https://www.urios.edu.ph/wp-content/uploads/2020/09/academics.jpg"
                                alt="Academic Programs"
                            />
                            <Card.Body>
                                <Card.Title>Academic Excellence</Card.Title>
                                <Card.Text>Explore diverse programs designed to shape your future.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} sm={6} md={4} lg={3} data-aos="fade-up">
                        <Card className="mb-4">
                            <Card.Img
                                variant="top"
                                src="https://www.urios.edu.ph/wp-content/uploads/2020/09/research.jpg"
                                alt="Research and Innovation"
                            />
                            <Card.Body>
                                <Card.Title>Research Opportunities</Card.Title>
                                <Card.Text>Engage in groundbreaking research and global collaborations.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} sm={6} md={4} lg={3} data-aos="fade-up">
                        <Card className="mb-4">
                            <Card.Img
                                variant="top"
                                src="https://www.urios.edu.ph/wp-content/uploads/2020/09/community.jpg"
                                alt="Community Engagement"
                            />
                            <Card.Body>
                                <Card.Title>Community Engagement</Card.Title>
                                <Card.Text>Join initiatives that make a difference locally and globally.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <section className="about py-5 bg-light">
                <Container>
                    <Row className="text-center mb-4" data-aos="fade-up">
                        <Col>
                            <h2>About Us</h2>
                            <p className="lead">
                                At Father Saturnino Urios University, we are committed to fostering intellectual growth and holistic development.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} data-aos="fade-up">
                            <h3>Our Mission</h3>
                            <p>We aim to produce globally competent individuals who embody integrity, service, and leadership.</p>
                        </Col>
                        <Col md={4} data-aos="fade-up" data-aos-delay="200">
                            <h3>Our Vision</h3>
                            <p>To be a premier Catholic institution dedicated to forming ethical, innovative, and socially responsible leaders.</p>
                        </Col>
                        <Col md={4} data-aos="fade-up" data-aos-delay="400">
                            <h3>Our Values</h3>
                            <p>Excellence, service, inclusivity, and faith are the cornerstones of our educational philosophy.</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
