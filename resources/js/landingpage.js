import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from 'react-bootstrap';
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
        document.title = 'FSUU';
    }, []);

    useEffect(() => {
        AOS.init({ duration: 1200 });
        
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
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
                                Your journey toward academic excellence starts here. Join us today and become part of a community dedicated to learning, innovation, and growth.
                            </p>
                            <Link to="/register">
                                <Button variant="primary" className="me-3">Get Started</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="primary">Log In</Button>
                            </Link>
                        </Col>
                        <Col md={6} xs={6} data-aos="fade-left">
                            <Image src="https://imgs.search.brave.com/Y2ofQa3mTvSZR5aJkGVgEBu2hdzpS4kIvHNM15o1Mbw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvZW4vOC84Ny9G/YXRoZXJfU2F0dXJu/aW5vX1VyaW9zX1Vu/aXZlcnNpdHlfbG9n/by5wbmc_MjAyMDA5/MjUwMDE0MjM" alt="University Image" thumbnail />
                        </Col>
                    </Row>
                    <div className="video-container">
                        <video autoPlay loop muted className="hero-video">
                            <source src="" type="video/mp4" />
                        </video>
                    </div>
                </Container>
            </section>
            <Container>
            <Row>
                <Col xs={12} sm={6} md={4} lg={3} data-aos="fade-up">
                    <Card style={{ marginBottom: '2rem', width: '100%' }}>
                        <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Cras justo odio</ListGroup.Item>
                            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                            <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3} data-aos="fade-up">
                    <Card style={{ marginBottom: '2rem', width: '100%' }}>
                        <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Cras justo odio</ListGroup.Item>
                            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                            <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3} data-aos="fade-up">
                    <Card style={{ marginBottom: '2rem', width: '100%' }}>
                        <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Cras justo odio</ListGroup.Item>
                            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                            <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3} data-aos="fade-up">
                    <Card style={{ marginBottom: '2rem', width: '100%' }}>
                        <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Cras justo odio</ListGroup.Item>
                            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                            <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

            <div className={`border-line ${isVisible ? 'visible' : ''}`}></div>

            <section className="about py-5">
                <Container>
                    <Row className="text-center mb-4" data-aos="fade-up">
                        <Col>
                            <h2>About Father Saturnino Urios University</h2>
                            <p className="lead">Empowering students since 1901, fostering intellectual curiosity, and nurturing future leaders.</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} data-aos="fade-up">
                            <h3>Our Mission</h3>
                            <p>
                                asdasdasdasasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdsadsadasdasdasdasdasdasdsdaasd
                            </p>
                        </Col>
                        <Col md={4} data-aos="fade-up" data-aos-delay="200">
                            <h3>Our Vision</h3>
                            <p>
                                asdasdasdasdasdasdsaddasaasdsdaasdasdsdagfasgasgasgasgagasgagagagasgasgasgasgasgasgasagasgas
                            </p>
                        </Col>
                        <Col md={4} data-aos="fade-up" data-aos-delay="400">
                            <h3>Our Values</h3>
                            <p>
                                asgasgagdfhgdhfgjghkrtyiruehdbcvbfgjdgetyueuwsdgsgdgfhdvsdyhwrywgsgdfgertyefvbdfhedrywrt
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>
            
            <div className="hero">
                <div className="content">
                   
                    <Carousel>
      <Carousel.Item interval={1000}>
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={500}>
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>


                    <h1 className='text-black'>Welcome to Father Saturnino Urios University</h1>
                    <p className='text-black'>Your journey toward academic excellence starts here.</p>
                </div>
            </div>

            <section className="info bg-light py-4">

            <div className={`border-line ${isVisible ? 'visible' : ''}`}></div>
                <Container>
                    <Row>
                        <Col md={6} data-aos="fade-right">
                            <Dropdown className="d-inline mx-2">
                                <DropdownToggle id="dropdown-autoclose-true" className="custom-toggle">
                                    Programs Offered
                                </DropdownToggle>

                                <DropdownMenu className="fade custom-dropdown-menu">
                                    <DropdownItem href="#">Undergraduate Programs</DropdownItem>
                                    <DropdownItem href="#">Graduate Programs</DropdownItem>
                                    <DropdownItem href="#">Research & Innovation</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Col>

                       
                        <Col md={6} data-aos="fade-left">
                            <h3>Why Choose Us?</h3>
                            <p>
                                At Father Saturnino Urios University, we offer a diverse and inclusive academic environment, state-of-the-art facilities, and an unparalleled dedication to student success.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
