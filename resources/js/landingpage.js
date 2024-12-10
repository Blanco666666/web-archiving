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
                        <h1>Welcome to the Library at Father Saturnino Urios University</h1>
<p className="lead">
    Discover knowledge and resources to support your journey of education, innovation, and leadership.
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
                                src="https://imgs.search.brave.com/VPYgfQ2HQEGRg6_hqxAbxVSXiY6S-dKRV_hLjtcGWmg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvZW4vOC84Ny9G/YXRoZXJfU2F0dXJu/aW5vX1VyaW9zX1Vu/aXZlcnNpdHlfbG9n/by5wbmc_MjAyMDA5/MjUwMDE0MjM"
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
                                src="https://scontent.fcgy2-1.fna.fbcdn.net/v/t1.6435-9/84573036_3245135085530014_7269321024238256128_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG4CJRDpbG0ZevrWp-xXfIPnnrUda19jCOeetR1rX2MI6ahNiwAs0LYfsmMsM6bi0O9v73Lzq1_G__kBMLxzo6E&_nc_ohc=xqHwag72JIUQ7kNvgGpQ_Pc&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=AI7q3zKcBu7hut4OBT0nDBR&oh=00_AYDvMLL22LnOfyi4solj3sGpNN4OU8SpLgUQVrfMMmZRtQ&oe=676FC3A2"
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
                                src="https://scontent.fcgy2-1.fna.fbcdn.net/v/t1.6435-9/84573036_3245135085530014_7269321024238256128_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG4CJRDpbG0ZevrWp-xXfIPnnrUda19jCOeetR1rX2MI6ahNiwAs0LYfsmMsM6bi0O9v73Lzq1_G__kBMLxzo6E&_nc_ohc=xqHwag72JIUQ7kNvgGpQ_Pc&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=AI7q3zKcBu7hut4OBT0nDBR&oh=00_AYDvMLL22LnOfyi4solj3sGpNN4OU8SpLgUQVrfMMmZRtQ&oe=676FC3A2"
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
                                src="https://scontent.fcgy2-1.fna.fbcdn.net/v/t1.6435-9/84573036_3245135085530014_7269321024238256128_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG4CJRDpbG0ZevrWp-xXfIPnnrUda19jCOeetR1rX2MI6ahNiwAs0LYfsmMsM6bi0O9v73Lzq1_G__kBMLxzo6E&_nc_ohc=xqHwag72JIUQ7kNvgGpQ_Pc&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=AI7q3zKcBu7hut4OBT0nDBR&oh=00_AYDvMLL22LnOfyi4solj3sGpNN4OU8SpLgUQVrfMMmZRtQ&oe=676FC3A2"
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
                                src="https://scontent.fcgy2-1.fna.fbcdn.net/v/t1.6435-9/84573036_3245135085530014_7269321024238256128_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG4CJRDpbG0ZevrWp-xXfIPnnrUda19jCOeetR1rX2MI6ahNiwAs0LYfsmMsM6bi0O9v73Lzq1_G__kBMLxzo6E&_nc_ohc=xqHwag72JIUQ7kNvgGpQ_Pc&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=AI7q3zKcBu7hut4OBT0nDBR&oh=00_AYDvMLL22LnOfyi4solj3sGpNN4OU8SpLgUQVrfMMmZRtQ&oe=676FC3A2"
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

            <Footer />
        </div>
    );
};

export default LandingPage;
