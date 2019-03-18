import React from 'react';
import { ButtonGroup } from 'reactstrap';

import styles from './Toolbar.module.css';
import Container from 'reactstrap/es/Container';

const Toolbar = ({ children, isFluid }) => {
  return (
    <div className={`nav-scroller bg-white shadow-sm ${styles.container}`}>
      <Container fluid={isFluid}>
        <div className={`col-md-12 `}>
          <nav className="nav nav-underline">
            <ButtonGroup>{children}</ButtonGroup>
          </nav>
        </div>
      </Container>
    </div>
  );
};

export default Toolbar;
