import React from 'react';
import { Users } from 'lucide-react';
import './Header.css';

const Header = () => (
    <header className="pageHeader">
        <h1 className="pageTitle">
            <Users />
            Payroll Dashboard
        </h1>
        <p className="pageSubtitle">
            This application manages payroll batches and employee assignments.
        </p>
    </header>
);

export default Header;