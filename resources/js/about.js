import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AOS from 'aos';

const About = () => {
    return (
        <div>
            <section className="About py-5">
                <Container>
                    <Row className="text-center mb-4">
                        <Col>
                            <h1>About Urios</h1>
                            <p>you know</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} data-aos="fade-right">
                            <h3>Our Mission</h3>
                            <p>
                                To provide a holistic, quality education that nurtures both the mind and heart, fostering responsible citizens with a commitment to social justice.
                            </p>
                        </Col>
                        <Col md={4} data-aos="fade-up">
                            <h3>Our Vision</h3>
                            <p>
                                A university known for academic excellence, research breakthroughs, and service to humanity through a Christ-centered approach.
                            </p>
                        </Col>
                        <Col md={4} data-aos="fade-left">
                            <h3>Our Values</h3>
                            <p>
                                Integrity, leadership, compassion, and excellence are at the core of all we do.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default About;
