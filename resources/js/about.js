import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AOS from 'aos';
import HeaderComponent from './layout/header';

const About = () => {
    return (
        <div>
            <HeaderComponent />
            <section className="About py-5">
                <Container>
                    <Row className="text-center mb-4">
                        <Col>
                            <h1>About FSUU</h1>
                            <p>We are a Filipino, Catholic, diocesan, educational institution committed to imparting our students with the skills, knowledge, and competence to succeed in their chosen fields of study. Our administrators, faculty, and staff are guided by the Urian core values of Unity, Religiosity, Integrity, Altruism, and Nationalism. We offer a holistic brand of education, and we are proud to be recognized as one of the leading institutions in Northeastern Mindanao.

As we forward educational enhancement, research development, and service to the community, our university produces professionals who make significant contributions in their future lines of work, both here and abroad. Three campuses ensure safe and conducive avenues for learning: the Archbishop Morelos Campus in Libertad, the Juan de Dios Pueblos Senior High School in our main campus at the heart of Butuan City.  Altogether,  FSUU provides an atmosphere of excellence and innovation that is mindful of society’s ever-changing needs.</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} data-aos="fade-right">
                            <h3>Mission Vision</h3>
                            <p>
                            Father Saturnino Urios University, a lay-empowered, Filipino, Catholic, Diocesan, Educational Institution, envisions a community of men and women committed to pursue the work of Christ for the wholeness of society.

                            </p>
                        </Col>
                        <Col md={4} data-aos="fade-up">
                            <h3>ALMA MATER SONG</h3>
                            <p>
                            ” The FSUU Hymn”
Seat of wisdom and of knowledge
In this southern timberland
Fountain you will always be
Of the love of man for man
In your fold the youth awakens
To the sacred noble truth
That for man to find happiness
Is to serve his fellowmen

Father Urios hail to you
We your children far and near
Shall your truth forever hold
Shall your name forever bear

Father Urios hail to you
We your children far and near
Shall your truth forever hold
Shall your name forever bear
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default About;
